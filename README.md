# Trip Sync

A trip planner for groups. Name the trip, pick a destination, set when you want to arrive, and come back to it later.

This repository is proprietary. You may read the code. You may not copy, modify, or reuse it without written permission from Two-Fold Labs. See [LICENSE](LICENSE).

## What it does today

- Create a trip with a name, destination, and arrival time
- Search destinations with Google Places
- Start as a guest, with no account required
- Look up an existing trip by id

## Stack

| Layer | Tech |
| --- | --- |
| App | React 19, TypeScript, Vite, MUI, Tailwind CSS |
| API | Node.js, Express 5, TypeScript, PostgreSQL |
| Maps | Google Maps and Places |

The frontend lives in `frontend/`. The API lives in `backend/`.

## Run locally

You need Node.js 22, a local PostgreSQL database, and a Google Places API key.

### API

```bash
cd backend
cp .env.example .env
```

Set `DATABASE_URL`, `GOOGLE_API_KEY`, and `JWT_SECRET` in `backend/.env`. Then:

```bash
npm install
npm run migrate -- up
npm run dev
```

The API listens on `http://localhost:3000`.

### App

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Vite proxies `/api` to the backend. Open the URL it prints, usually `http://localhost:5173`.

## License

Copyright (c) 2026 Two-Fold Labs. All rights reserved.

This is not open source. Contact Two-Fold Labs if you need permission to use this code.
