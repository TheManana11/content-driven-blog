# Content-Driven Blog

> A full-stack blog: a Next.js frontend, a NestJS REST API and a PostgreSQL database accessed through Prisma.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![NestJS 12](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)
![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Data flow](#data-flow)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Using the app](#using-the-app)
- [API reference](#api-reference)
- [Error handling](#error-handling)
- [Caching and revalidation](#caching-and-revalidation)
- [Environment variables](#environment-variables)
- [Git workflow](#git-workflow)
- [What I learned](#what-i-learned)
- [Author](#author)
- [License](#license)

## Overview

Content-Driven Blog is a learning project. It started as a Next.js app that read posts from the fake JSONPlaceholder API. It is now a real full-stack application where every post is stored permanently in PostgreSQL.

The repository holds **two independent applications**, each with its own `package.json` and `node_modules`:

| Folder | Application | Port |
| --- | --- | --- |
| `frontend/` | Next.js website (pages, forms, Server Actions) | 3000 |
| `backend/` | NestJS REST API (validation, business logic, database access) | 3001 |

The guiding principle is **simplicity over cleverness**: each file has one job, and the code uses only the core concepts of each framework.

## Features

- List all posts (newest first), read one post, create, edit and delete posts.
- All data is stored in PostgreSQL and survives restarts.
- Validation happens once, in the backend (NestJS DTOs). The frontend shows the backend's messages in the form and keeps what the user typed.
- Clear error handling: "Page not found" for missing or invalid posts, a friendly error page when the backend is down, and inline errors when a save or delete fails.
- Confirmation before deleting, pending states on buttons, dark mode.
- SEO: page titles, descriptions, canonical URLs, `robots.txt` and `sitemap.xml`.

## Tech stack

| Layer | Technology | Version |
| --- | --- | --- |
| Frontend | Next.js (App Router, Server Components, Server Actions) | 16.4 |
| | React | 19.3 |
| | Tailwind CSS | 4 |
| Backend | NestJS (modules, controllers, services, DTOs, pipes) | 12 |
| | class-validator / class-transformer | 0.15 / 0.5 |
| | @nestjs/config (`.env` files) | 12 |
| Database | PostgreSQL (local development server from `prisma dev`) | |
| | Prisma ORM, Prisma Client, `@prisma/adapter-pg` | 7.10.1 |
| Language | TypeScript (strict) | 5 (frontend), 6 (backend) |
| Tools | npm, ESLint (frontend), oxlint (backend), Git and GitHub | |

Requires **Node.js 22.12 or newer** (developed on Node 26 with npm 12).

## Architecture

```mermaid
flowchart TD
    Browser["Browser"]

    subgraph FE["frontend/ (Next.js, port 3000)"]
        Pages["Pages (Server Components)<br/>app/"]
        Actions["Server Actions<br/>lib/actions.ts"]
        Api["API functions<br/>lib/api.ts"]
    end

    subgraph BE["backend/ (NestJS, port 3001)"]
        Pipe["ValidationPipe + DTOs"]
        Controller["PostsController"]
        Service["PostsService"]
        Prisma["PrismaService"]
    end

    DB[("PostgreSQL")]

    Browser -->|"page request"| Pages
    Browser -->|"form submit"| Actions
    Pages --> Api
    Actions --> Api
    Api -->|"fetch (HTTP + JSON)"| Pipe
    Pipe --> Controller
    Controller --> Service
    Service --> Prisma
    Prisma -->|"SQL"| DB
```

Key rules:

- **The browser never talks to NestJS directly.** Only the Next.js server does, so the API address (`BACKEND_API_URL`) stays private and no CORS setup is needed.
- **Only the backend talks to the database**, and only through `PrismaService`.
- **`frontend/lib/api.ts` is the only frontend file that knows the API**, and **`PostsService` is the only backend file that runs queries.**

## Data flow

### Reading a post

```mermaid
sequenceDiagram
    actor User
    participant Page as Post page (Server Component)
    participant Api as lib/api.ts
    participant Ctrl as PostsController
    participant Svc as PostsService
    participant DB as PostgreSQL

    User->>Page: GET /posts/4
    Page->>Api: getPostById("4")
    Api->>Ctrl: GET /api/posts/4
    Note over Ctrl: ParseIntPipe turns "4" into 4<br/>("abc" → 400)
    Ctrl->>Svc: findOne(4)
    Svc->>DB: SELECT ... WHERE id = 4 (Prisma)
    DB-->>Svc: row or nothing
    Svc-->>Ctrl: post, or NotFoundException (404)
    Ctrl-->>Api: JSON
    Api-->>Page: Post, or null for 400/404
    Page-->>User: HTML, or the "Page not found" page
```

### Creating a post (from the form to the database and back)

```mermaid
sequenceDiagram
    actor User
    participant Form as PostForm (Client Component)
    participant Action as createPostAction (Server Action)
    participant Api as lib/api.ts
    participant Nest as NestJS (ValidationPipe → Controller → Service)
    participant DB as PostgreSQL

    User->>Form: types title and content, clicks "Create post"
    Form->>Action: FormData
    Action->>Api: createPost({ title, body })
    Api->>Nest: POST /api/posts (JSON)
    alt invalid data
        Nest-->>Api: 400 + messages
        Api-->>Action: ["Title is required."]
        Action-->>Form: { errors, values }
        Form-->>User: error list, typed text kept
    else valid
        Nest->>DB: INSERT INTO "Post" (Prisma)
        DB-->>Nest: new row
        Nest-->>Api: 201 + created post
        Action->>Action: revalidatePath("/")
        Action-->>User: redirect to /?status=created ("Post created.")
    end
```

Editing (`PATCH`) and deleting (`DELETE`) follow the same path. The post id is attached to the action with `.bind(null, id)`.

## Project structure

```text
Content-driven/
├── frontend/                         Next.js application
│   ├── app/
│   │   ├── layout.tsx                Root layout: fonts, header, footer, title template
│   │   ├── page.tsx                  Home: list of posts + status notice
│   │   ├── loading.tsx               Skeleton shown while a page loads
│   │   ├── error.tsx                 Friendly error page (e.g. backend down)
│   │   ├── global-error.tsx          Fallback if the root layout itself fails
│   │   ├── not-found.tsx             "Page not found"
│   │   ├── robots.ts, sitemap.ts     SEO files
│   │   └── posts/
│   │       ├── create/page.tsx       New post form
│   │       └── [id]/
│   │           ├── page.tsx          One post + Edit / Delete
│   │           └── edit/page.tsx     Edit form
│   ├── components/
│   │   ├── layout/                   Site header and footer
│   │   └── posts/                    Card, list, form, delete button, status notice
│   ├── lib/
│   │   ├── api.ts                    The only file that calls the NestJS API
│   │   ├── actions.ts                Server Actions: create, update, delete
│   │   └── site.ts                   Site name and public URL
│   ├── types/post.ts                 Post, PostInput, FormState
│   └── .env.example                  BACKEND_API_URL, NEXT_PUBLIC_SITE_URL
│
├── backend/                          NestJS application
│   ├── src/
│   │   ├── main.ts                   Starts the app: /api prefix, ValidationPipe, port
│   │   ├── app.module.ts             Root module: ConfigModule + PostsModule
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts      Exports PrismaService
│   │   │   └── prisma.service.ts     PrismaClient + PostgreSQL adapter
│   │   └── posts/
│   │       ├── posts.module.ts
│   │       ├── posts.controller.ts   HTTP routes → service
│   │       ├── posts.service.ts      Logic + Prisma queries + 404s
│   │       └── dto/                  CreatePostDto, UpdatePostDto (validation rules)
│   ├── prisma/
│   │   ├── schema.prisma             The Post model
│   │   └── migrations/               SQL that creates the tables
│   ├── prisma.config.ts              Settings for the Prisma CLI
│   └── .env.example                  PORT, DATABASE_URL
│
└── README.md                         This file
```

Each folder has its own README with more detail: [frontend/README.md](frontend/README.md), [backend/README.md](backend/README.md).

## Getting started

**Prerequisites:** Node.js 22.12+ and npm, plus Git.

### 1. Clone

```bash
git clone https://github.com/TheManana11/content-driven-blog.git
cd content-driven-blog
```

### 2. Backend and database

```bash
cd backend
npm install
cp .env.example .env
npx prisma dev --name blog --detach   # start the local PostgreSQL server
npx prisma migrate deploy             # create the Post table
npx prisma generate                   # generate the Prisma Client
npm run start:dev                     # API on http://localhost:3001/api
```

`npx prisma dev` runs a local development PostgreSQL server managed by Prisma, so no database installation or password is needed. After restarting your computer, start it again with `npx prisma dev start blog`. To use your own PostgreSQL server instead, put its connection string in `DATABASE_URL`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                           # website on http://localhost:3000
```

Always start the backend first. If it is not running, the website shows "Something went wrong" with a **Try again** button.

### Scripts

| Folder | Command | What it does |
| --- | --- | --- |
| `backend/` | `npm run start:dev` | Start the API and restart on file changes |
| `backend/` | `npm run build` / `npm run start:prod` | Compile to `dist/` / run the compiled app |
| `backend/` | `npm run lint` | Lint with oxlint |
| `backend/` | `npx prisma studio` | Browse and edit the data in the browser |
| `backend/` | `npx prisma migrate dev --name <name>` | Create and apply a migration after changing `schema.prisma` |
| `frontend/` | `npm run dev` | Start the website in development mode |
| `frontend/` | `npm run build` / `npm run start` | Production build / serve it |
| `frontend/` | `npm run lint` | Lint with ESLint |

## Using the app

| Page | What you can do |
| --- | --- |
| `/` | See all posts, newest first. Click a card to open it, or **New post**. |
| `/posts/create` | Write a title (3–100 characters) and content (10–2000 characters). |
| `/posts/:id` | Read a post. **Edit** opens the form; **Delete** asks for confirmation. |
| `/posts/:id/edit` | Change the title and/or content. |

After a create, edit or delete you are redirected and a short notice confirms it ("Post created.", "Post updated.", "Post deleted.").

## API reference

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Success | Errors |
| --- | --- | --- | --- |
| GET | `/posts` | 200, all posts (newest first) | |
| GET | `/posts/:id` | 200, one post | 400 non-numeric id, 404 not found |
| POST | `/posts` | 201, the created post | 400 validation failed |
| PATCH | `/posts/:id` | 200, the updated post | 400 validation / id, 404 not found |
| DELETE | `/posts/:id` | 204, no content | 400 non-numeric id, 404 not found |

Request body for `POST` (both required) and `PATCH` (both optional):

```json
{ "title": "3 to 100 characters", "body": "10 to 2000 characters" }
```

A post as returned by the API:

```json
{
  "id": 4,
  "title": "Created and edited from the browser",
  "body": "This post went from the form, through a Server Action, to NestJS, Prisma and PostgreSQL.",
  "createdAt": "2026-11-07T18:44:15.520Z",
  "updatedAt": "2026-11-07T18:44:45.803Z"
}
```

Errors use NestJS's built-in format, for example:

```json
{ "message": ["Title must be at least 3 characters."], "error": "Bad Request", "statusCode": 400 }
```

## Error handling

| Situation | Backend | What the user sees |
| --- | --- | --- |
| Invalid form data | 400 from `ValidationPipe` (one message per field) | The messages above the form, typed text kept |
| Unknown field sent | 400 (`forbidNonWhitelisted`) | (Not possible from the form) |
| Post does not exist | 404 `NotFoundException` | "Page not found" |
| Id is not a number (`/posts/abc`) | 400 from `ParseIntPipe` | "Page not found" |
| Id too large for the database | 404 (checked in `PostsService`) | "Page not found" |
| Backend not running | (no response) | Page: "Something went wrong" + **Try again**. Form or delete: "Could not reach the server." |
| Unexpected server error | 500 | A generic message; internal details are never shown |

## Caching and revalidation

The frontend uses the simplest caching model:

- Every read uses `fetch(..., { cache: "no-store" })`, so pages always show what is currently in the database.
- After a create, update or delete, the Server Action calls `revalidatePath(...)` and then `redirect(...)`. `revalidatePath` clears the copies of pages the browser has already visited, so going back to the list shows the change immediately.

## Environment variables

**`backend/.env`** (copy from `.env.example`, never committed)

| Variable | Example | Description |
| --- | --- | --- |
| `PORT` | `3001` | Port the API listens on |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:51214/template1?sslmode=disable` | PostgreSQL connection string (the example is the local `prisma dev` server) |

**`frontend/.env.local`** (copy from `.env.example`, never committed)

| Variable | Example | Description |
| --- | --- | --- |
| `BACKEND_API_URL` | `http://localhost:3001/api` | NestJS API address. Server-only (no `NEXT_PUBLIC_` prefix), never sent to the browser |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site address for canonical URLs, `robots.txt` and the sitemap |

## Git workflow

Each step was developed on its own branch, checked (type check, lint, build, manual tests) and merged into `main` with `--no-ff`, so every feature stays visible in the history.

**Part 1: the original Next.js blog (JSONPlaceholder)**

`feature/project-setup` → `feature/app-layout`, `feature/posts-list`, `feature/post-details`, `feature/create-post` → `feature/edit-post`, `feature/delete-post` → `feature/error-handling`, `feature/seo` → `feature/docs`

**Part 2: the full-stack version**

| Branch | What it did |
| --- | --- |
| `feature/frontend-refactor` | Simplified the frontend, removed JSONPlaceholder and Zod, moved `my-app/` to `frontend/` |
| `feature/backend-setup` | NestJS app with ConfigModule, `/api` prefix and global ValidationPipe |
| `feature/database-prisma` | Prisma 7, the `Post` model, the first migration, PrismaService |
| `feature/posts-api` | PostsModule with the five CRUD endpoints and DTO validation |
| `feature/frontend-backend-integration` | End-to-end testing of both apps together (no code changes were needed) |
| `feature/final-review` | This README, final checks |

## What I learned

- **Next.js:** Server Components for reading data, Server Actions for changing it, `useActionState` for showing errors, `revalidatePath` + `redirect` after a change, and error/not-found/loading boundaries.
- **NestJS:** how a request travels through the global prefix, pipes (`ValidationPipe`, `ParseIntPipe`), the controller and the service; how modules, providers and exports make Dependency Injection work; built-in exceptions and status codes.
- **Validation:** DTO classes with class-validator decorators as the single source of truth, and `whitelist` / `forbidNonWhitelisted` / `transform` / `stopAtFirstError` on the ValidationPipe.
- **Prisma and PostgreSQL:** modelling a table in `schema.prisma`, turning it into SQL with migrations, using Prisma Client through a NestJS `PrismaService`, and connecting through a driver adapter in Prisma 7.
- **Configuration:** keeping secrets in `.env` files, private server-only variables vs. public `NEXT_PUBLIC_` ones.
- **Working with Git:** one branch per step, checks before every merge, and preserving file history when moving folders.

## Author

**Ahmad Manana**

GitHub: [TheManana11](https://github.com/TheManana11)

Feedback, questions and suggestions are very welcome. Feel free to open an [issue](https://github.com/TheManana11/content-driven-blog/issues) on GitHub.

## License

No license specified yet — all rights reserved by the author.
