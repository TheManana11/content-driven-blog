# backend

The NestJS REST API for **Content-Driven Blog**. The Next.js frontend (`../frontend`) calls this API; this API is the only part of the project that will talk to the database.

## Setup

1. Install dependencies: `npm install` (Node.js 20.19+ or 22.12+).
2. Copy `.env.example` to `.env` and adjust the values if needed.
3. Start the local database (Prisma's development PostgreSQL server):
   `npx prisma dev --name blog --detach`
   After a restart of your computer, start it again with `npx prisma dev start blog`.
4. Create the tables: `npx prisma migrate deploy`
5. Generate the Prisma Client: `npx prisma generate`
6. Run `npm run start:dev`. The API runs on http://localhost:3001/api.

## API endpoints

| Method | Endpoint | Success | Errors |
| --- | --- | --- | --- |
| GET | `/api/posts` | 200, all posts (newest first) | |
| GET | `/api/posts/:id` | 200, one post | 400 non-numeric id, 404 not found |
| POST | `/api/posts` | 201, the created post | 400 validation failed |
| PATCH | `/api/posts/:id` | 200, the updated post | 400 validation / id, 404 not found |
| DELETE | `/api/posts/:id` | 204, no content | 400 non-numeric id, 404 not found |

Request body for POST (both fields required) and PATCH (both optional):

```json
{ "title": "3 to 100 characters", "body": "10 to 2000 characters" }
```

## Database commands

| Command | Description |
| --- | --- |
| `npx prisma migrate dev --name <name>` | After changing `schema.prisma`: create and apply a new migration |
| `npx prisma generate` | Regenerate the TypeScript client in `src/generated/prisma` |
| `npx prisma studio` | Open a browser view of the data |
| `npx prisma dev ls` | Show whether the local database server is running |

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
| `DATABASE_URL` | see `.env.example` | PostgreSQL connection string used by Prisma |
