# frontend

The Next.js 16 frontend for **Content-Driven Blog**. It reads and changes posts through our own NestJS REST API (the `backend/` folder). It never talks to the database directly.

## Folder structure

| Folder | What it holds |
| --- | --- |
| `app/` | Pages, layouts, routing, loading and error boundaries, metadata |
| `components/` | Reusable UI components |
| `lib/api.ts` | The only file that calls the NestJS API (`fetch`) |
| `lib/actions.ts` | Server Actions used by the forms (create, update, delete) |
| `types/` | TypeScript interfaces |

## Setup

1. Install dependencies: `npm install` (Node.js 20.9 or newer).
2. Copy `.env.example` to `.env.local` and adjust the values if needed.
3. Start the backend first, then run `npm run dev` and open http://localhost:3000.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `BACKEND_API_URL` | `http://localhost:3001/api` | NestJS API address. Server-only, never sent to the browser. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL used for canonical URLs, `robots.txt` and the sitemap |
