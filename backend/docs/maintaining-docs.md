# Maintaining the guidance docs

Read this before editing `AGENTS.md` or anything in `docs/`.

## When to update

Update the docs in the same change whenever your work makes them wrong: a renamed or moved file, a changed command, a new env var, a new module pattern, a removed gotcha.

## What you may change on your own

- **Factual updates:** file names and paths, commands, names of constants or functions, lists that went stale. Make them directly.
- **Rules and conventions** (how code _should_ be written, what goes where, what is forbidden): do **not** change these on your own. Propose the change, explain why, and wait for approval.

## Where content belongs

| Content                                                                        | Place                                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| A rule the agent would break without being told, relevant to almost every task | `AGENTS.md`                                                         |
| Knowledge needed only for some tasks                                           | A doc in `docs/`, listed in the `AGENTS.md` table                   |
| Something ESLint, `tsc` or the build already enforces                          | Nowhere. Point to the config file instead                           |
| A multi-step procedure repeated often                                          | Consider a skill; not before it has been done by hand several times |

## Writing rules

- **One fact, one place.** Don't repeat a rule between `AGENTS.md` and a doc, or between docs. Link instead.
- **Point, don't copy.** Don't restate what code or config already shows (`eslint.config.js`, `tsconfig.json`, `package.json`, or the source itself). Document what the code can't say: why, conventions, and what to avoid.
- **Principles over instances.** Write "never expose secrets", not a list of the one field that caused a past mistake.
- **Keep `AGENTS.md` short.** When it grows, move detail into a doc and leave a one-line pointer. Only add a line if the agent would get it wrong without it.
- **Every doc starts with a "Read this when…" line** and has a row in the `AGENTS.md` table. Add the row in the same change that creates the doc.
- **Don't record unsettled decisions as standard.** Say plainly that something isn't standardized yet and tell the agent to follow the surrounding code.
- **Don't present legacy code as the model.** Mark it legacy and say where new code goes.
- **Remove temporary notes** once the cause is fixed.
- Imperative, specific, checkable wording. No filler.

## After editing

Re-read the files you touched for contradictions with each other and with the code. If the docs and the code disagree and you are unsure which is right, ask.
