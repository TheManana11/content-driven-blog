export const SITE_NAME = "Content-Driven Blog";

// Set NEXT_PUBLIC_SITE_URL when deploying (e.g. https://myblog.com).
// It is public by design: it is a URL, not a secret.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
