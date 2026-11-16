---
name: confluence-docs
description: Use when a product decision, idea, architecture, database, API, or how we build (CI, review, hosting, stack) was discussed or changed; when as-built behaviour no longer matches Confluence space TTP; before finishing a feature or after brainstorming; or when the user mentions documentation, Decisions, Ideas, wiki, or Confluence.
---

# Prompt Confluence updates (TTP)

Team knowledge lives in Confluence space **TTP**, not in chat. When this session produced something the wiki should hold, **prompt the user** with the points. Do not create or edit Confluence until they say to update it.

## What Confluence is for

A third person should understand **how we are building the product and why** — the goal, the use-case, the thinking that led to a choice. They should not need to reverse-engineer that from TypeScript.

Write:

- Why we built it this way (and not the obvious alternative)
- What the use-case is, who it is for, how we plan to use it
- What a reader would get wrong if they only looked at the code

Do **not** write:

- How to write the code (imports, handler templates, lint, file naming, Prettier)
- A copy of `AGENTS.md` or `docs/`
- Anything the code or config already shows

Repo `AGENTS.md` / `docs/` stay the source of truth for **how agents write code**. Update those in the same change when they become wrong (`backend/docs/maintaining-docs.md`). This skill is the **wiki** half.

Jira is work to do (`jira-ticket`). Confluence is what we believe and why we build this way. An idea can need both; prompt each skill separately.

Keep the Cursor and Claude copies identical (`.cursor/skills/confluence-docs/` and `.claude/skills/confluence-docs/`).

## Interview before writing

If why / thinking / use-case / how we plan to use it is missing, **ask before you write the page**. Do not invent the user's reasons from the code.

Skip a question that this session already answered. Do not dump a questionnaire; ask only the gaps (usually 2–5). Wait for the answers, then draft.

Ask in this spirit (adapt; do not read as a script):

- Why did you build it this way, and what did you reject?
- What were you thinking — what problem or fear drove it?
- What is the use-case, and who is it for?
- How do you plan to use it today vs later?
- What would a third person misunderstand if they only read the repo?

```
Before I write this on Confluence I still don't know:

1. <gap in why / use-case / plan>
2. <gap>

Once you answer I can draft the page as thinking, not as a coding guide.
```

**Skip the interview when:** the user already explained why in this session; the change is only “this Decision shipped” / a fact they already confirmed; or you are only parking a Later bullet (the unknown stays on the page as Later).

If they said “update Confluence” but the why is still unknown, interview first, then write.

## When to prompt

Prompt at the first natural pause after the points exist: end of a brainstorm, after “we decided X”, or before calling work done.

**Prompt when any of these happened:**

- A product **rule** was locked (how Active works, who can exit, …)
- A product **thought** was explored but not locked
- As-built behaviour, screens, or identity no longer match Overview
- How the system is put together changed in a way a third person should know (layers, request path, auth, hosting) — as **why this shape**, not a file tour
- Tables or relationships changed in meaning (database)
- What an endpoint is **for**, who calls it, or why its contract looks like that (API)
- How we **build** changed (CI, review, Claude, hosting, a stack choice) — the thinking, not the YAML

**Do not prompt for:** a routine lint/format fix, tests that do not change a contract, comments, explaining existing code with no new rule, or when the user already said skip docs this session. Do not offer a wiki page that copies coding rules from `AGENTS.md` / `docs/`. Do still prompt when an `AGENTS.md` or `docs/` edit is where a why / use-case / stack choice landed — that belongs on a conventions page, not a republish of the rules.

Skipping the prompt because the user did not mention docs is a miss. They should not have to remember the wiki.

## Classify (read [destinations.md](destinations.md) for URLs)

| Kind | Folder | Test |
| --- | --- | --- |
| **Overview** | Product | What the product **does today** for a user. Not a roadmap. Not a code walkthrough. |
| **Decision** | Product / Decisions | Core rule is **locked**. An implementer should not re-open it. Lead with why. |
| **Idea** | Product / Ideas | Not committed. Another approach is still on the table. |
| **Later** section | On an existing Decision | Adjacent **hole of that same story** (e.g. admin exit on Exit a trip). |
| **Architecture** | Architecture | Why the system is shaped this way (containers, request path, hosting). |
| **Database** | Architecture | What the tables mean for the product; not SQL style guides. |
| **API** | API | What the endpoint is for and the caller-facing contract. Title is the name; path in the body. Shared cookie/errors → Contract. |
| **Conventions** | Engineering conventions | Why we build this way (CI, review, stack). **Not** a copy of coding rules. |

Do not dump brainstorms onto Overview, Architecture, Database, or API pages. Do not treat a Decision as shipped until the code matches. Promote Idea → Decision when the rule locks. Promote Decision → Overview/Architecture/API when it ships (Decision page can stay as “why”).

## Prompt shape (required)

Use this shape — points first, then suggested pages, then a question. Do not edit the wiki in the same turn as the prompt. If the interview still has gaps, those questions come **before** this prompt, or in the same message **instead of** writing.

```
Here we discussed these points which need to be updated in the documentation:

1. <point in plain language — why / use-case, not a code instruction>
   → <create | update | Later section> · <page or folder>

Want me to update Confluence?
```

Batch every point from this pause into **one** prompt. Name the existing page when it exists; say **create** when it does not. Search TTP before proposing a duplicate.

**Example**

```
Here we discussed these points which need to be updated in the documentation:

1. Active is derived: if the only traveller exits, the trip goes Inactive, not Ended
   → update · Exit a trip, Participant journey state
2. Admin exit (transfer ownership? only-admin → End trip?)
   → Later section · Exit a trip (do not create a new page until we lock a rule)

Want me to update Confluence?
```

If they say no / not now: stop. If they say yes / update / apply: interview if needed, then follow [Updating](#updating).

## Updating

Only after confirmation (and after interview answers, if you asked).

1. Read [destinations.md](destinations.md). Fetch the latest page (`snapshotToken`) before editing.
2. Search TTP for an existing page. Prefer update over a second page on the same topic.
3. Classic pages, `contentWidth` wide. No Live Docs. ASCII diagrams in `pre` / text fences.
4. Match the page you are changing: Decision pages stay “Not shipped” until the code exists and lead with why; API pages state purpose then the caller contract (path, typed request headers/body, meaning of fields, status codes, sample responses). Curl is optional as a demonstration of that contract, not a coding lesson. Titles have no path. Do not paste handler code or AGENTS.md.
5. Link Related pages. Overview “Not built yet” should point at new Decisions; remove that line when the behaviour ships.
6. When you **create** a catalogued page (API endpoint, Decision, Idea, architecture or conventions page), append its title and id to both `.cursor/skills/confluence-docs/` and `.claude/skills/confluence-docs/` `destinations.md` in the same change. Skip this for a Later bullet on an existing Decision.
7. Reply with the page URL and what changed.

If Confluence tools fail, paste the same points and say you could not write the wiki. Do not add a repo markdown substitute unless the user asks.

## Rationalizations

| Excuse | Reality |
| --- | --- |
| “User didn’t ask for docs” | This skill is the ask. Prompt anyway. |
| “I’ll do it at the end” | End-of-session dumps get dropped. Prompt at the first pause. |
| “It was only brainstorming” | That is an Idea or a Later bullet — still wiki. |
| “Overview Not built yet is enough” | A locked rule needs a Decision page, not a one-liner. |
| “Too small” | If we would forget it next week, it is not too small. |
| “I’ll put it in the PR / Jira” | PR/Jira are not the knowledge base. |
| Silent wiki edit | Prompt first. Same bar as `jira-ticket`. |
| “I’ll copy AGENTS.md so humans have it too” | Coding how-to stays in the repo. Wiki is why we build. |
| “I can infer why from the code” | Ask. Do not invent the user’s thinking. |

## Red flags

- Calling the task done with no prompt after a doc-worthy discussion
- Writing Confluence in the same breath as the first mention of the points
- Writing a page of how-to-code, import order, or lint rules
- Inventing why / use-case instead of asking
- Putting an Idea on Overview, or as-built on a Decision as if it had shipped
- Creating a new Ideas page for a hole that belongs in a Decision’s Later section
