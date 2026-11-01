---
name: jira-ticket
description: Draft and create a well-formed Jira ticket in the trip-tracker project (TT) for a Story, Subtask, Issue/bug, Improvement/refactor, Idea, or Epic. Use whenever work is identified but postponed ("later", "out of scope", "not now", a TODO, a known limitation, a bug noticed while doing something else), when part of the current task is left unfinished and should be split out so the main feature can ship working for the user, or when the user asks to log, track, or create a ticket.
---

# Jira ticket for trip-tracker

Turn something we decided not to do right now into a ticket that makes sense weeks later with no other context.

Two cases:
- **Deferred:** something new came up that's out of scope for the current work.
- **Split-out:** part of the current task is left unfinished. Ticket the remainder so the main feature can ship in a working state from the user's point of view. This does **not** mean changing the main ticket's Jira status — never transition it; the user decides that. In the description, say what was already done, what's left, and reference the original ticket (if any) as a linked issue. If the current task is a Story, the remainder can be a Subtask under it; otherwise make it a sibling of the same type.

## Jira config

- Site: `https://two-fold-labs.atlassian.net`
- cloudId: `f49dac42-7090-4e76-8cde-003b94ea1d81`
- Project key: `TT` (Trip Tracker Project, team-managed)
- Issue types: `Epic`, `Story`, `Task`, `Subtask`, `Bug`, `Improvement`

## Type mapping

| What it is | Jira issue type | Labels | Notes |
|---|---|---|---|
| Story — user-facing feature | `Story` | — | Parent may be an Epic |
| Task — part of a Story | `Subtask` | — | **Requires a parent Story key** |
| Task — standalone work, not part of a Story (upgrade, setup, chore) | `Task` | — | Parent may be an Epic |
| Issue — something broken | `Bug` | — | |
| Improvement / refactor | `Improvement` | `refactor` and/or `tech-debt` if apt | |
| Idea — not yet committed | `Task` | `idea` | Priority usually `Low`/`Lowest` |
| Epic — a feature area grouping stories | `Epic` | — | Only when the user asks |

If `Bug` or `Improvement` is rejected as an issue type (not yet added to TT), stop and tell the user rather than falling back to `Task`.

## Labels

Use only these labels — a closed list. Never invent or vary them (no `Frontend`, `front-end`, `fe`); if none fits, ask the user whether to add one to this list.

| Group | Label | Meaning |
|---|---|---|
| Area | `frontend` | React app in `frontend/` |
| Area | `backend` | API / server in `backend/` |
| Area | `db` | Schema, migrations, queries |
| Area | `ci` | GitHub Actions, code-review workflow |
| Area | `infra` | Deployment, env config, hosting |
| Area | `docs` | README, `plans/`, documentation |
| Kind | `idea` | Not committed; may never be done |
| Kind | `refactor` | Restructure without behaviour change |
| Kind | `tech-debt` | Known shortcut to pay back |
| Workflow | `quick-win` | Doable in under ~1 hour |
| Workflow | `deferred` | Came up mid-work and was postponed |

Every ticket gets:
1. **At least one area label.**
2. Kind labels where they apply (`idea` is required for Ideas).
3. `quick-win` if it's realistically under an hour — say so in the draft so the user can disagree.
4. `deferred` if it came up mid-work (as opposed to planned up front).

Don't encode priority, status, feature area (use Epics), or issue type in labels.

## Priority

| Priority | Use when |
|---|---|
| `Highest` | Data loss, security hole, app unusable |
| `High` | A main flow is broken, or it blocks the next planned feature |
| `Medium` | Default for real work |
| `Low` | Nice to have, polish, minor tech debt |
| `Lowest` | Ideas, someday/maybe |

Propose a priority with a one-line reason; the user decides.

## Ticket size: one ticket, one shippable step

Keep each ticket small enough to finish, merge, and move on from: one PR, roughly a day of work or less, leaving the app working. Prefer several small linked tickets over one large one.

**Split when** any of these is true:
- The summary needs "and" to describe it.
- One part can ship and be useful while another still has open questions or needs a decision.
- One part depends on another being built first.
- It has more than ~5 acceptance criteria.

**How to split:**
- Split into slices that each work end to end, not into layers (not "frontend ticket" + "backend ticket" when neither works alone). Each ticket must be done and testable on its own.
- Order them: the foundation first, then what builds on it. Link each dependent ticket as **blocked by** the one it needs.
- Don't split below a `quick-win`. A piece under an hour stays inside its neighbour.
- 3+ related tickets for one feature area: offer an Epic (don't create one unasked).

Example: "app-wide snackbar + global TanStack error handling" became TT-4 (snackbar + "Trip created") and TT-5 (global `onError`), with TT-5 blocked by TT-4.

## Workflow

### 1. Gather context — before drafting

Collect, don't invent:
- **From the conversation:** what we were doing when this came up, what the problem/idea is, why it's being deferred.
- **From the repo:** current branch (`git branch --show-current`), short commit SHA (`git rev-parse --short HEAD`), and the exact files/lines involved. Read the code if needed so the file references are accurate.
- **For a Subtask:** the parent Story. Search open stories with JQL `project = TT AND issuetype = Story AND statusCategory != Done ORDER BY created DESC` and ask which one.
- **Duplicate check:** search `project = TT AND statusCategory != Done AND text ~ "<2-3 keywords>"`. If something similar exists, show it and ask whether to add a comment there instead.

If anything a section needs is unknown (repro steps, expected behaviour, acceptance criteria), **ask the user** — one short batch of questions. Never fill gaps with guesses.

### 2. Draft

**Size check first:** apply [Ticket size](#ticket-size-one-ticket-one-shippable-step). If it should be split, propose the split (titles + one line each + order) before drafting the full descriptions.

**Summary (title):** imperative, specific, ≤ 80 chars, prefixed with area.
- Good: `[Frontend] Debounce destination autocomplete requests`
- Bad: `Fix autocomplete`

**Description:** markdown, using the template for the type below. Drop a section only if it truly doesn't apply. File references use repo-relative paths with lines, e.g. `frontend/src/features/trips/api.ts:42`.

### 3. Confirm

Show the full draft — type, summary, priority (with reason), labels, parent, description — and wait for the user's OK or edits. **Never create without explicit confirmation.**

When several items were deferred in one session, draft them all together and confirm as a batch.

### 4. Create

Call `createJiraIssue` with `cloudId`, `projectKey: "TT"`, `issueType`, `summary`, `description`, `labels`, `priority`, and `parent` (for Subtasks / Stories under an Epic).

If the create is rejected because the `priority` field isn't on the screen (team-managed projects can have it disabled), retry once without priority, then tell the user to enable the Priority field in TT's project settings.

For split tickets, create them in dependency order, then link each pair with the `createJiraIssueLink` operation (via `discover` → `executeWrite`): `linkType: "Blocks"`, `inwardIssue` = the ticket that must be done first, `outwardIssue` = the blocked one. Also name the blocker in the blocked ticket's description.

### 5. Report

If the ticket points at a specific code location, add a `// TODO(TT-<n>): <short summary>` comment there (using the file's comment syntax), so the code links back to the ticket.

Reply with the key and link (`https://two-fold-labs.atlassian.net/browse/TT-<n>`), plus where the TODO comment was added.

## Description templates

### Story
```
## User story
As a <user>, I want <goal> so that <benefit>.

## Context
<What prompted this; where the app is today.>

## Scope
**In:** ...
**Out:** ...

## Acceptance criteria
- [ ] ...
- [ ] ...

## Technical notes
<Approach ideas, APIs/components involved, open questions.>

## References
- Branch / commit: `<branch>` @ `<sha>`
- Files: ...
```

### Subtask
```
## What
<The specific piece of the parent story.>

## Done when
- [ ] ...

## Files
- ...
```

### Task (standalone)
```
## What
<The work to do, in a few sentences.>

## Why
<What it unblocks or why it's needed.>

## Context
<Where things stand today; what prompted this.>

## Done when
- [ ] ...

## References
- Branch / commit: `<branch>` @ `<sha>`
- Files: ...

## Why deferred
...
```

### Issue (bug)
```
## Summary
<One or two sentences: what's broken.>

## Steps to reproduce
1. ...

## Expected
...

## Actual
...  (include error message / console output if any)

## Suspected cause
<file:line and reasoning, if known — say "unknown" otherwise.>

## Impact
<Who/what is affected, how often, any workaround.>

## Environment
- Branch / commit: `<branch>` @ `<sha>`
- Where: frontend / backend / both

## Why deferred
<Why this wasn't fixed when found.>
```

### Improvement / refactor
```
## Current state
<How it works now, with file:line.>

## Problem
<Why that's a problem: maintainability, perf, correctness risk, DX.>

## Proposed change
<What to do instead. Alternatives if any.>

## Benefits
...

## Risks / effort
<What could break; rough size S / M / L.>

## Done when
- [ ] ...

## Why deferred
...
```

### Idea
```
## Idea
<The idea in a few sentences.>

## Why it might be worth it
...

## Open questions
- ...

## Possible first step
<Smallest thing that would validate it.>
```

### Epic
```
## Goal
<The feature area and the outcome it delivers.>

## Stories (planned)
- ...

## Out of scope
...
```
