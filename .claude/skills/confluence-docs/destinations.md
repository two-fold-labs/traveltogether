# TTP destinations

Site: `https://two-fold-labs.atlassian.net/wiki`
cloudId: `f49dac42-7090-4e76-8cde-003b94ea1d81`
Space: **TTP** (Trip Tracker Project), spaceId `622595`

Search before creating: `space = TTP AND title ~ "<keywords>"`.

Hub: [Trip Tracker documentation](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/overview) (homepage id `622698`).

Keep the Cursor and Claude copies identical (`.cursor/skills/confluence-docs/` and `.claude/skills/confluence-docs/`).

## Folders

| Folder | Id | Put here |
| --- | --- | --- |
| [Product](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/4194305) | `4194305` | Overview only. Parents the Decisions and Ideas folders — do not create those pages here. |
| [Decisions](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/4227074) | `4227074` | Locked product rules (may be unshipped) |
| [Ideas](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/4227073) | `4227073` | Uncommitted product thoughts |
| [Architecture](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/2949186) | `2949186` | System / frontend / backend / database |
| [API](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/3112978) | `3112978` | One page per endpoint + Contract |
| [Engineering conventions](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/folder/3047460) | `3047460` | Why we build this way (CI, review, stack). Not a copy of coding rules. |

## Stable pages

| Page | Id | Update when |
| --- | --- | --- |
| [Overview](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/2949121/Overview) | `2949121` | As-built product, screens, identity; “Not built yet” links |
| [Participant journey state](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/4259841/Participant+journey+state) | `4259841` | Journey vs trip clocks |
| [Exit a trip](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/4882433/Exit+a+trip) | `4882433` | Leave trip, derived Active |
| [System architecture](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/2981889/System+architecture) | `2981889` | Containers, request path, hosting |
| [Frontend architecture](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3047443/Frontend+architecture) | `3047443` | Why the React app is shaped this way (not a file tour) |
| [Backend architecture](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3080193/Backend+architecture) | `3080193` | Why the Express app and auth are shaped this way (not a file tour) |
| [Database design](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3014657/Database+design) | `3014657` | A table or relationship changed in meaning for the product (not SQL detail) |
| [Contract](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3047426/Contract) | `3047426` | Cookie, error envelope, status codes |
| [Frontend conventions](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3014674/Frontend+conventions) | `3014674` | A frontend stack or build choice changed, or its reasoning did (never to mirror `frontend/AGENTS.md`) |
| [Backend conventions](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/3112961/Backend+conventions) | `3112961` | A backend stack or build choice changed, or its reasoning did (never to mirror `backend/AGENTS.md`) |
| [GitHub Actions](https://two-fold-labs.atlassian.net/wiki/spaces/TTP/pages/5996546/GitHub+Actions) | `5996546` | CI, auto-format, Cursor review, or Claude-on-PR setup changed, or why we run them did |

API endpoint pages (create a new sibling when adding a route): Health `2949138`, Guest login `2785286`, Search places `3309569`, Create trip `2556071`, List trips `3342337`, Get trip `3375105`. Contract stays last in the folder.

## Authoring

- Classic **page**, not Live Doc. `contentWidth`: `wide`.
- Fetch the page and use the returned `snapshotToken` (`v:N`). Do not guess the version.
- Tables: no `data-layout=wide` (overflows the text column).
- Lead with why / use-case / thinking. Do not paste AGENTS.md, import order, or handler templates.
- Decision pages: state **Not shipped** vs shipped in the intro. Keep a **Later (not decided)** section for holes of that story.
- Idea pages: problem / wish, options if any, explicit “not committed”.
- API: title is the feature name only; purpose first, then the caller contract: path, typed request headers/body, status codes, and sample responses (required). Curl is optional as a demo.
- Diagrams: ASCII in a text/`pre` fence (Remix/AI diagrams are off on this site).
