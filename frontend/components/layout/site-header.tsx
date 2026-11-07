import Link from "next/link";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className={`rounded text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 ${focusRing}`}
        >
          Content-Driven Blog
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-4 sm:gap-6">
            <li>
              <Link
                href="/"
                className={`rounded text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 ${focusRing}`}
              >
                Posts
              </Link>
            </li>
            <li>
              <Link
                href="/posts/create"
                className={`inline-flex items-center rounded-md bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${focusRing}`}
              >
                New post
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
