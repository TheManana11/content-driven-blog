"use client";

// Replaces the root layout when it crashes, so it must render its own
// <html> and <body>. globals.css is not loaded here, hence inline styles.
export default function GlobalError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          textAlign: "center",
        }}
      >
        <title>Something went wrong</title>
        <div role="alert">
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please try again.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
