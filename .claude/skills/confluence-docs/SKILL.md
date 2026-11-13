---
name: confluence-docs
description: Use when a product decision, idea, architecture, database schema, API contract, or engineering convention was discussed or changed; when as-built behaviour no longer matches Confluence space TTP; before finishing a feature or after brainstorming; or when the user mentions documentation, Decisions, Ideas, wiki, or Confluence.
---

# Prompt Confluence updates (TTP)

Team knowledge lives in Confluence space **TTP**, not in chat. When this session produced something the wiki should hold, **prompt the user** with the points. Do not create or edit Confluence until they say to update it.

Repo `AGENTS.md` / `docs/` stay the agent source of truth. Update those in the same change when they become wrong (`backend/docs/maintaining-docs.md`). This skill is the **wiki** half.

Jira is work to do (`jira-ticket`). Confluence is what we believe or how it works. An idea can need both; prompt each skill separately.

Keep the Cursor and Claude copies identical (`.cursor/skills/confluence-docs/` and `.claude/skills/confluence-docs/`).

## When to prompt

Prompt at the first natural pause after the points exist: end of a brainstorm, after “we decided X”, or before calling work done.

**Prompt when any of these happened:**

- A product **rule** was locked (how Active works, who can exit, …)
- A product **thought** was explored but not locked
- As-built behaviour, screens, or identity no longer match Overview
- Layers, request path, auth, or hosting changed (architecture)
- Tables, columns, constraints, or migrations changed (database)
- An endpoint or shared contract changed (API)
- How we write code changed (engineering conventions)

**Do not prompt for:** lint/format, tests that do not change a contract, comments, explaining existing code with no new rule, or when the user already said skip docs this session.

Skipping the prompt because the user did not mention docs is a miss. They should not have to remember the wiki.

## Classify (read [destinations.md](destinations.md) for URLs)

| Kind | Folder | Test |
| --- | --- | --- |
| **Overview** | Product | What the **code does today**. Not a roadmap. |
| **Decision** | Product / Decisions | Core rule is **locked**. An implementer should not re-open it. |
| **Idea** | Product / Ideas | Not committed. Another approach is still on the table. |
| **Later** section | On an existing Decision | Adjacent **hole of that same story** (e.g. admin exit on Exit a trip). |
| **Architecture** | Architecture | How the system is structured (system / frontend / backend). |
| **Database** | Architecture | Schema as applied by migrations. |
| **API** | API | One classic page per endpoint; title is the name, path in the body. Shared cookie/errors → Contract. |
| **Conventions** | Engineering conventions | Human-readable copy of repo coding rules. |

Do not dump brainstorms onto Overview, Architecture, Database, or API pages. Do not treat a Decision as shipped until the code matches. Promote Idea → Decision when the rule locks. Promote Decision → Overview/Architecture/API when it ships (Decision page can stay as “why”).

## Prompt shape (required)

Use this shape — points first, then suggested pages, then a question. Do not edit the wiki in the same turn as the prompt.

```
Here we discussed these points which need to be updated in the documentation:

1. <point in plain language>
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

If they say no / not now: stop. If they say yes / update / apply: follow [Updating](#updating).

## Updating

Only after confirmation.

1. Read [destinations.md](destinations.md). Fetch the latest page (`snapshotToken`) before editing.
2. Search TTP for an existing page. Prefer update over a second page on the same topic.
3. Classic pages, `contentWidth` wide. No Live Docs. ASCII diagrams in `pre` / text fences.
4. Match the page you are changing: Decision pages stay “Not shipped” until the code exists; API pages keep curl, typed headers/body, status codes, sample responses; titles have no path.
5. Link Related pages. Overview “Not built yet” should point at new Decisions; remove that line when the behaviour ships.
6. Reply with the page URL and what changed.

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

## Red flags

- Calling the task done with no prompt after a doc-worthy discussion
- Writing Confluence in the same breath as the first mention of the points
- Putting an Idea on Overview, or as-built on a Decision as if it had shipped
- Creating a new Ideas page for a hole that belongs in a Decision’s Later section
