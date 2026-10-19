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

function stripFence(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
}

function balancedObjects(text) {
  const found = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      continue;
    }
    if (character === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }
    if (character === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        found.push(text.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return found;
}

function commentsObjectFromText(text) {
  const fenced = stripFence(text);
  for (const candidate of [text.trim(), fenced]) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && Array.isArray(parsed.comments)) return parsed;
    } catch {
      // The answer may surround the JSON with other text.
    }
  }
  const objects = balancedObjects(fenced);
  for (let index = objects.length - 1; index >= 0; index -= 1) {
    try {
      const parsed = JSON.parse(objects[index]);
      if (parsed && Array.isArray(parsed.comments)) return parsed;
    } catch {
      // Skip braces that are not a comments object.
    }
  }
  throw new Error("review output did not contain a comments list");
}

export function extractComments(payload) {
  let text = payload;
  try {
    const outer = JSON.parse(payload.trim());
    if (outer && typeof outer.result === "string") text = outer.result;
    else if (outer && Array.isArray(outer.comments)) return cleanComments(outer.comments);
  } catch {
    // The file may already be the assistant text.
  }
  return cleanComments(commentsObjectFromText(text).comments);
}

function cleanComments(comments) {
  if (!Array.isArray(comments)) throw new Error("comments must be a list");

  const cleaned = [];
  for (const item of comments) {
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

export function commentPayload(commit, comment) {
  const body = comment.body.includes(MARKER) ? comment.body : `${comment.body}\n\n${MARKER}`;
  return {
    body,
    commit_id: commit,
    path: comment.path,
    line: comment.line,
    side: "RIGHT",
  };
}

async function postComment(repo, pr, token, commit, comment) {
  const { status, raw } = await request(
    "POST",
    `https://api.github.com/repos/${repo}/pulls/${pr}/comments`,
    token,
    commentPayload(commit, comment),
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
    if (status === 200 || status === 201) continue;
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
  const noisy = JSON.stringify({
    type: "result",
    result: `Earlier note { "path": "not-the-review" }.\n${JSON.stringify({
      comments: [{ path: file, line: 3, body: "EXTRA is a new flag with no reader." }],
    })}`,
  });
  const fromNoisy = extractComments(noisy);
  if (fromNoisy.length !== 1 || fromNoisy[0].path !== file) {
    throw new Error(`noisy agent output parsed wrong: ${JSON.stringify(fromNoisy)}`);
  }
  if (selectComments(comments, valid, new Set([`${file}:3`])).length !== 0) {
    throw new Error("duplicate comment was not skipped");
  }
  const chosen = selectComments(comments, valid, new Set());
  if (chosen.length !== 1 || chosen[0].line !== 3) {
    throw new Error(`expected one comment on line 3, got ${JSON.stringify(chosen)}`);
  }
  const posted = commentPayload("abc", chosen[0]);
  if (posted.subject_type || posted.line !== 3 || posted.side !== "RIGHT" || !posted.body.includes(MARKER)) {
    throw new Error(`unexpected comment payload: ${JSON.stringify(posted)}`);
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
