import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { CreatePostInput, Post, UpdatePostInput } from "@/types/post";

/**
 * The only module that talks to JSONPlaceholder.
 * JSONPlaceholder fakes mutations: POST/PATCH/DELETE return success responses
 * but nothing is persisted, so a re-fetch always returns the original data.
 */

const API_URL = "https://jsonplaceholder.typicode.com";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export const postTag = (id: number) => `post-${id}`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
      ...init?.headers,
    },
  });
  // Error bodies are not parsed: some failures (e.g. 500) return HTML, not JSON.
  if (!res.ok) throw new ApiError(res.status);
  return (await res.json()) as T;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  return request<Post[]>("/posts");
}

export async function getPost(id: number): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", postTag(id));

  try {
    return await request<Post>(`/posts/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const post = await request<Post>("/posts", {
    method: "POST",
    body: JSON.stringify({ ...input, userId: 1 }),
  });
  // Guard against the API silently dropping fields.
  if (post.title !== input.title || post.body !== input.body) {
    throw new ApiError(502, "API returned an unexpected response");
  }
  return post;
}

export async function updatePost(
  id: number,
  input: UpdatePostInput,
): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deletePost(id: number): Promise<void> {
  await request<unknown>(`/posts/${id}`, { method: "DELETE" });
}
