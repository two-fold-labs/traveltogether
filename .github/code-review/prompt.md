You are reviewing a pull request in this repository. The checkout is the pull request head. The unified diff is the file `.code-review-pr.diff` at the repository root.

Read that diff. Read the changed files and any nearby code you need in order to understand the change. Find every `AGENTS.md` and every markdown file under a `docs/` directory, from the repository root and from the folders of the changed files, and apply the ones that match.

Review all of the following:

- Generic coding practice on every changed file: naming, duplication, dead code, types, and noise.
- Repository rules. A rule that names a stack applies only to files that use that stack. Frontend rules about MUI, Tailwind, theme tokens, Vite, or icons stay on frontend files. Backend rules about Express, SQL, zod, auth, or module layers stay on backend files. A language or engineering rule applies across the repository even when the document currently lives in only one folder. When two documents disagree, the one closer to the file wins.
- Behavior. Reason from the diff and the surrounding code. Comment where the logic looks wrong or incomplete, or where a path the change is responsible for is missing. Do not run the application, tests, or package managers.

Do not comment on formatting that Prettier owns, such as quotes, wrapping, or trailing commas. Do not comment on a line that is not part of the diff. Do not approve the pull request and do not request changes.

Return only a JSON object, with no markdown fence and no text around it:

{"comments":[{"path":"frontend/src/Example.tsx","line":12,"body":"One concrete finding a reviewer can verify on this line."}]}

`path` is relative to the repository root. `line` is the new-file line number in `.code-review-pr.diff`. `body` states the rule or the broken behavior in a few sentences. If there is nothing to report, return {"comments":[]}.
