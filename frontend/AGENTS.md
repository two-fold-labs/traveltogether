# AGENTS.md — Frontend

Stack: React 19 · TypeScript · Vite · MUI v9.4 (`@mui/material`, Emotion) · Tailwind CSS v4 · FontAwesome · `@vis.gl/react-google-maps`.

Commands (from `frontend/`): `npm run dev` · `npm run lint` · `npm run build`

## Always follow

1. **Styling order:** MUI component props (including `Stack`/`Grid` for layout) → theme override (if repeated) → Tailwind `className` → `sx` only for MUI internals or runtime theme values.
2. **Layout:** `Stack` for 1-D rows/columns, `Grid` for 2-D grids. Tailwind only for what MUI has no prop for: positioning, overflow, gradients, blur, radius, shadows, one-off sizing, responsive visibility.
3. **Mobile first.** Unprefixed Tailwind classes are mobile; enhance with `sm: md: lg:`. Check at 375px.
4. **No hardcoded colors.** Use semantic tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `brand-*`). Never Tailwind's default palette.
5. **Icons:** `<Icon name="..." />` only. No `@mui/icons-material`.
6. **Imports:** MUI path imports (`@mui/material/Button`), `@/` alias, type-only imports with `import { type X }`.
7. **Dependency direction:** `app → pages → features → components → lib`. Never import upward. Domain-aware code goes in `features/<name>/`, not `components/`.
8. **No** `any`, non-null `!`, `console.log`, plain CSS files, or inline `style` for static values.
9. **Before finishing:** `npm run lint` and `npx tsc -b` must pass. Works in light and dark mode.

## Deferred work → Jira

Offer to log a Jira ticket (project `TT`) with the `jira-ticket` skill (`.claude/skills/jira-ticket/`) when:

- a story, task, bug, improvement or idea comes up that we won't do now, or
- part of the current task is left unfinished: split the leftover into its own ticket so the main feature can ship in a working state for the user.

Never create a ticket without the user's confirmation.

## MCP servers

Cursor reads **`.cursor/mcp.json`**. Root **`.mcp.json`** is the portable copy (same servers) for other MCP clients. Other files under `.cursor/` stay local (gitignored). Enable the servers in Cursor Settings → MCP. Do not put secrets in either file.

| Server       | Use for                                     | Notes                                                                  |
| ------------ | ------------------------------------------- | ---------------------------------------------------------------------- |
| `mui-mcp`    | `fetchDocs` for MUI v9 API/docs when unsure | Don't use `generateReactCode`; it ignores our theme and Tailwind rules |
| `playwright` | Agent UI debugging in a browser             | Optional; not required to run `npm run dev`                            |

## Read the matching doc before starting

| When you are…                                                                                 | Read                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Building or restyling a component, responsive or dark-mode behavior                           | [docs/styling.md](docs/styling.md)         |
| Changing colors, typography, theme overrides, `index.css`, or unsure which color class to use | [docs/theme.md](docs/theme.md)             |
| Creating or moving files, or adding cross-folder imports                                      | [docs/structure.md](docs/structure.md)     |
| Writing a new component, hook, util, or env variable                                          | [docs/conventions.md](docs/conventions.md) |
