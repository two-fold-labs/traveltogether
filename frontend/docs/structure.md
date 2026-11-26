# Folder structure and dependency rules

Read this when creating a new file or folder, moving code, or adding an import across folders.

```
src/
├── app/                 # app shell: providers, router, app-level layout (Header etc.)
├── pages/               # thin route components; compose features; no business logic
├── features/<name>/     # domain code: components/, hooks/, api.ts, queryKeys.ts, types.ts, index.ts
├── components/
│   ├── ui/              # generic, domain-agnostic building blocks (Icon, Logo, DarkModeButton…)
│   └── layout/          # generic structural pieces (PageShell, Section, SplitPane…)
├── lib/                 # pure helpers: cn(), api client, formatters
├── hooks/               # shared hooks used by 2+ features
├── theme/               # see theme.md
├── types/               # shared types
├── index.css
└── main.tsx
```

Some existing files (`components/Map`, `components/LocationShare`, `components/LocationHeader`, `utils/`) predate this structure and are being migrated. Put new code in the structure above. Do not add new files to the old locations.

## Where does a new file go?

1. Mentions trips, locations, or users → `features/<name>/components`.
2. Reusable visual element with no domain knowledge → `components/ui`.
3. Arranges other content, no meaning of its own → `components/layout`.
4. Composes features into the app frame (header with trip buttons, router outlet) → `app/`.
5. A route → `pages/` (thin).

"Used in many places" does not make something shared. Domain-aware components stay in their feature and are imported from the feature's public entry point.

## Dependency direction (one way only)

```
app → pages → features → components → lib
```

- `components/` never imports from `features/`, `pages/`, or `app/`.
- `features/` never imports from `pages/` or `app/`, and not from other features. Move shared things down to `components/` or `lib/`.
- `lib/` imports nothing from the rest of `src/`.
- Inside a feature, use relative imports. Outside, import from the feature's `index.ts` only.
- No circular imports (`import-x/no-cycle` is enforced).
- Avoid barrel files except one public entry per feature.

Start code in the feature that needs it. Promote to shared only when a second feature needs it. Do not create empty folders ahead of time.
