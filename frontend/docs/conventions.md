# Component and code conventions

Read this when writing a new component, hook, or utility.

## Components

- Function components, one per file, file name = component name (`PascalCase.tsx`). Hooks are `useX.ts`.
- One component per file means any function that returns JSX, including small private helpers used by a single parent (`TripList`, `Metric`, `Badge`). Put each in its own file next to its parent, even if only that parent imports it. Plain non-JSX helpers and constants can stay in the component file.
- Props typed with an `interface` named `<Component>Props`. When wrapping a MUI component, extend its props (`extends ButtonProps`) and spread the rest.
- Accept `className` on reusable components and merge it with the component's own classes using `cn()` from `@/lib/cn` (`clsx` + `tailwind-merge`) once it exists. Use `class-variance-authority` for components with several variants.
- Prefer composition (`children`, slot props) over boolean-prop explosions.
- Wrap MUI in `components/ui` only when adding behavior or a repeated style that cannot live in the theme. Otherwise use the MUI component directly.
- Accessibility: every icon-only button has `aria-label`. Use semantic elements and real labels. `jsx-a11y` is enforced.
- Keep components small. Extract a hook or subcomponent when a file passes roughly 150 lines or `complexity` warns.

## Imports

MUI uses path imports, not the barrel:

```tsx
import Button from '@mui/material/Button'; // yes
import { Button } from '@mui/material'; // no (createTheme in theme.ts is the one exception)
```

- Use the `@/` alias for anything outside the current feature or folder. Use relative imports within the same feature.
- Type-only imports use `import { type X }` (enforced).
- Order (enforced): builtin → external → `@/` internal → relative, blank line between groups, alphabetical within.

## Icons

Add the FontAwesome icon to the map in `src/components/Icon.tsx`, then use `<Icon name="..." />`. Do not import `FontAwesomeIcon` anywhere else.

## TypeScript and lint limits

- No `any`. No non-null `!` assertions (use a guard). No `console.log` (only `warn`/`error`). No nested ternaries.
- Complexity 15, depth 4, max 4 function params.

## Formatting

Prettier is the source of truth: semicolons, single quotes, trailing commas, Tailwind class sorting. Run `npx prettier --write <files>` on files you touch.

## Environment variables

- Must start with `VITE_`, read through `import.meta.env`.
- Declare types in `src/vite-env.d.ts` and list them in `.env.example`.
- Never commit real keys or `.env` files.
