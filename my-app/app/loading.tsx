// Automatic Suspense boundary around every page below the root layout.
export default function Loading() {
  return (
    <div aria-busy="true">
      <span role="status" className="sr-only">
        Loading…
      </span>
      <div className="mb-8 animate-pulse space-y-3">
        <div className="h-9 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-72 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <ul
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <li
            key={i}
            className="h-36 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
