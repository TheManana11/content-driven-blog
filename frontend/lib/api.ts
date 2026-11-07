import type { Post, PostInput } from "@/types/post";

// The only file that knows the NestJS API's address and talks to it.
// BACKEND_API_URL has no NEXT_PUBLIC_ prefix, so it stays on the server and is
// never sent to the browser.
const API_URL = process.env.BACKEND_API_URL ?? "http://localhost:3001/api";

// ---------- Reading data (used by Server Components) ----------

// `cache: "no-store"` asks for fresh data on every request, so a page always
// shows what is currently in the database.

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`, { cache: "no-store" });

  if (!response.ok) {
    // Caught by app/error.tsx, which shows a friendly message.
    throw new Error(`Failed to load posts (status ${response.status})`);
  }

  return response.json();
}

// Returns null when the post does not exist, so the page can call notFound().
// `id` comes straight from the URL; the backend decides whether it is valid.
export async function getPostById(id: string): Promise<Post | null> {
  const response = await fetch(`${API_URL}/posts/${id}`, { cache: "no-store" });

  // 404: no post with this id. 400: the id is not a number (e.g. /posts/abc).
  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load post ${id} (status ${response.status})`);
  }

  return response.json();
}

// ---------- Changing data (used by Server Actions) ----------

// Each function below returns:
//   null      -> the request succeeded
//   string[]  -> it failed; the messages can be shown to the user

export function createPost(input: PostInput): Promise<string[] | null> {
  return sendRequest("POST", "/posts", input);
}

export function updatePost(
  id: number,
  input: PostInput,
): Promise<string[] | null> {
  return sendRequest("PATCH", `/posts/${id}`, input);
}

export function deletePost(id: number): Promise<string[] | null> {
  return sendRequest("DELETE", `/posts/${id}`);
}

// Shared by the three functions above, so the error handling lives in one place.
async function sendRequest(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  data?: PostInput,
): Promise<string[] | null> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    // fetch itself throws when the backend is not running at all.
    return ["Could not reach the server. Please try again later."];
  }

  if (response.ok) {
    return null;
  }

  // 400 Bad Request: NestJS validation failed. Its messages are written for
  // people (e.g. "title must be longer than or equal to 3 characters"), so we
  // show them as they are.
  if (response.status === 400) {
    const errorBody = await response.json();
    return Array.isArray(errorBody.message)
      ? errorBody.message
      : [errorBody.message];
  }

  if (response.status === 404) {
    return ["This post no longer exists."];
  }

  // Anything else (usually 500) may contain internal details, so we hide it.
  return ["Something went wrong on the server. Please try again."];
}
