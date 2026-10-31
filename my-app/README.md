# my-app

This folder contains the Next.js 16 application for **Content-Driven Blog**, a blog that reads and writes posts through the public JSONPlaceholder API. For the overview, architecture, data flow and design decisions, see the [root README](../README.md).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Create a production build (needs network access) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

Requires Node.js 20.9 or newer. Install dependencies first with `npm install`.

## Environment variable

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL used for canonical URLs, `robots.txt` and the sitemap |

Set it in `.env.local` when deploying.

## More

Full documentation: [../README.md](../README.md)
