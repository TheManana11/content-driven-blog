# backend

The NestJS REST API for **Content-Driven Blog**. The Next.js frontend (`../frontend`) calls this API; this API is the only part of the project that will talk to the database.

## Setup

1. Install dependencies: `npm install` (Node.js 20.19+ or 22.12+).
2. Copy `.env.example` to `.env` and adjust the values if needed.
3. Run `npm run start:dev`. The API runs on http://localhost:3001/api.

## Scripts

| Script | Description |
| --- | --- |
| `npm run start:dev` | Start the API and restart it when a file changes |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm run start:prod` | Run the compiled app from `dist/` |
| `npm run lint` | Check the code with oxlint |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3001` | Port the API listens on |
