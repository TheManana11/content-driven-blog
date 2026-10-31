import { z } from "zod";
import type { PostFieldErrors } from "@/types/post";

export const MAX_POST_ID = 100;

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Title must be at least 3 characters." })
    .max(100, { error: "Title must be 100 characters or fewer." }),
  body: z
    .string()
    .trim()
    .min(10, { error: "Content must be at least 10 characters." })
    .max(2000, { error: "Content must be 2000 characters or fewer." }),
});

export const createPostSchema = postSchema;
export const updatePostSchema = postSchema;

/** Returns a valid post id (1..MAX_POST_ID) or null. Rejects "01", "1.5", "-1", "abc". */
export function parsePostId(raw: string): number | null {
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const id = Number(raw);
  return id <= MAX_POST_ID ? id : null;
}

export function toFieldErrors(error: z.ZodError): PostFieldErrors {
  return z.flattenError(error).fieldErrors;
}
