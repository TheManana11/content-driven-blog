"use client";

import Link from "next/link";

// Shown when a page below the root layout throws an error, for example when
// getPosts() fails because the backend is down.
// Error boundaries must be Client Components because "Try again" needs onClick.
// We never show the error's own text: it may contain internal details.
export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t complete that request. This is usually temporary, so
        please try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {/* retry() fetches and renders the page again. */}
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
