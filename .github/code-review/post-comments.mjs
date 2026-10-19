#!/usr/bin/env node
// Posts inline pull request comments from a Cursor CLI review.

import { readFileSync } from "node:fs";

const MARKER = "<!-- code-review -->";
const MAX_COMMENTS = 40;
const MAX_BODY = 4000;
const API_VERSION = "2022-11-28";

export function changedLines(diff) {
  const lines = new Set();
  let path = null;
  let newLine = null;

  for (const raw of diff.split(/\r?\n/)) {
    if (raw.startsWith("diff --git ")) {
      path = null;
      newLine = null;
      continue;
    }
    if (raw.startsWith("+++ ")) {
      let name = raw.slice(4);
      if (name.startsWith("b/")) name = name.slice(2);
      path = name === "/dev/null" ? null : name;
      continue;
    }
    if (raw.startsWith("@@")) {
      const header = raw.split(" ");
      if (header.length < 3 || !header[2].startsWith("+")) {
        newLine = null;
        continue;
      }
      newLine = Number(header[2].slice(1).split(",")[0]);
      continue;
    }
    if (!path || newLine == null) continue;
    if (raw.startsWith("\\")) continue;
    if (raw.startsWith("+")) {
      lines.add(`${path}:${newLine}`);
      newLine += 1;
      continue;
    }
    if (raw.startsWith("-")) continue;
    lines.add(`${path}:${newLine}`);
    newLine += 1;
  }

  return lines;
}

function jsonObject(text) {
  let stripped = text.trim();
  if (stripped.startsWith("```")) {
    stripped = stripped.slice(stripped.indexOf("\n") + 1);
    if (stripped.trimEnd().endsWith("```")) {
      stripped = stripped.trimEnd().slice(0, -3);
    }
  }
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start < 0 || end < start) {
    throw new Error("review output did not contain a JSON object");
  }
  const parsed = JSON.parse(stripped.slice(start, end + 1));
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("review JSON must be an object");
  }
  return parsed;
}

export function extractComments(payload) {
  let data = jsonObject(payload);
  if (typeof data.result === "string") data = jsonObject(data.result);
  if (!Array.isArray(data.comments)) throw new Error("comments must be a list");

  const cleaned = [];
  for (const item of data.comments) {
    if (!item || typeof item !== "object") continue;
    const path = String(item.path ?? "")
      .replaceAll("\\", "/")
      .replace(/^\.\//, "");
    if (!path || path.startsWith("/") || path.split("/").includes("..")) continue;
    const line = Number(item.line);
    const body = String(item.body ?? "").trim();
    if (!Number.isInteger(line) || line < 1 || !body) continue;
    cleaned.push({ path, line, body: body.slice(0, MAX_BODY) });
  }
  return cleaned;
}

export function selectComments(comments, valid, existing) {
  const selected = [];
  const seen = new Set();
  for (const comment of comments) {
    const key = `${comment.path}:${comment.line}`;
    if (!valid.has(key) || existing.has(key) || seen.has(key)) continue;
    seen.add(key);
    selected.push(comment);
    if (selected.length >= MAX_COMMENTS) break;
  }
  return selected;
}

async function request(method, url, token, body) {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": API_VERSION,
      "User-Agent": "traveltogether-code-review",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, raw: await response.text() };
}

async function existingCommentLines(repo, pr, token) {
  const found = new Set();
  for (let page = 1; ; page += 1) {
    const { status, raw } = await request(
      "GET",
      `https://api.github.com/repos/${repo}/pulls/${pr}/comments?per_page=100&page=${page}`,
      token,
    );
    if (status !== 200) {
      throw new Error(`listing review comments failed (${status}): ${raw}`);
    }
    const batch = JSON.parse(raw);
    if (batch.length === 0) return found;
    for (const comment of batch) {
      if (!String(comment.body ?? "").includes(MARKER)) continue;
      const line = comment.line ?? comment.original_line;
      if (comment.path && Number.isInteger(line)) found.add(`${comment.path}:${line}`);
    }
  }
}

async function postComment(repo, pr, token, commit, comment) {
  const body = comment.body.includes(MARKER) ? comment.body : `${comment.body}\n\n${MARKER}`;
  const { status, raw } = await request(
    "POST",
    `https://api.github.com/repos/${repo}/pulls/${pr}/comments`,
    token,
    {
      body,
      commit_id: commit,
      path: comment.path,
      line: comment.line,
      side: "RIGHT",
      subject_type: "line",
    },
  );
  if (status !== 200 && status !== 201) {
    console.error(`comment failed (${status}) ${comment.path}:${comment.line}: ${raw}`);
  }
  return status;
}

async function run(reviewPath, diffPath) {
  const comments = extractComments(readFileSync(reviewPath, "utf8"));
  const valid = changedLines(readFileSync(diffPath, "utf8"));
  const repo = process.env.GITHUB_REPOSITORY;
  const pr = process.env.PR_NUMBER;
  const commit = process.env.COMMIT_SHA;
  const token = process.env.GITHUB_TOKEN;
  const existing = await existingCommentLines(repo, pr, token);
  const chosen = selectComments(comments, valid, existing);
  console.log(`comments from review: ${comments.length}; posting: ${chosen.length}`);
  if (chosen.length === 0) return 0;

  let failures = 0;
  for (const comment of chosen) {
    const status = await postComment(repo, pr, token, commit, comment);
    if (status === 200 || status === 201 || status === 422) continue;
    failures += 1;
  }
  return failures ? 1 : 0;
}

function selfTest() {
  const diff = [
    "diff --git a/backend/src/constants/trip.constants.ts b/backend/src/constants/trip.constants.ts",
    "--- a/backend/src/constants/trip.constants.ts",
    "+++ b/backend/src/constants/trip.constants.ts",
    "@@ -1,4 +1,5 @@",
    " export const TRIP_STATUS = {",
    "-  CREATED: 'created',",
    '+  CREATED: "created",',
    "+  EXTRA: true,",
    "   STARTED: 'started',",
    " }",
    "",
  ].join("\n");
  const valid = changedLines(diff);
  const file = "backend/src/constants/trip.constants.ts";
  if (!valid.has(`${file}:2`) || !valid.has(`${file}:3`) || !valid.has(`${file}:1`) || !valid.has(`${file}:4`)) {
    throw new Error(`unexpected diff lines: ${[...valid].join(", ")}`);
  }

  const payload = JSON.stringify({
    type: "result",
    result: [
      "```json",
      JSON.stringify({
        comments: [
          { path: file, line: 3, body: "EXTRA is a new flag with no reader." },
          { path: "missing.ts", line: 1, body: "not in the diff" },
          { path: "../secrets.env", line: 1, body: "no" },
        ],
      }),
      "```",
    ].join("\n"),
  });
  const comments = extractComments(payload);
  if (selectComments(comments, valid, new Set([`${file}:3`])).length !== 0) {
    throw new Error("duplicate comment was not skipped");
  }
  const chosen = selectComments(comments, valid, new Set());
  if (chosen.length !== 1 || chosen[0].line !== 3) {
    throw new Error(`expected one comment on line 3, got ${JSON.stringify(chosen)}`);
  }
  console.log("self-test ok");
}

const selfTestFlag = process.argv.includes("--self-test");
if (selfTestFlag) {
  selfTest();
} else {
  const reviewIndex = process.argv.indexOf("--review");
  const diffIndex = process.argv.indexOf("--diff");
  if (reviewIndex < 0 || diffIndex < 0) {
    console.error("usage: post-comments.mjs --review <file> --diff <file>");
    process.exit(1);
  }
  run(process.argv[reviewIndex + 1], process.argv[diffIndex + 1])
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(`code review comments failed: ${error.message}`);
      process.exit(1);
    });
}
