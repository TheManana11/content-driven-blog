import type { z } from "zod";
import type { createPostSchema, updatePostSchema } from "@/lib/validation/post";

/** Post as returned by JSONPlaceholder. */
export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type PostFieldErrors = Partial<Record<"title" | "body", string[]>>;

/** Shape returned by Server Actions and consumed by useActionState. */
export type ActionState = {
  errors?: PostFieldErrors;
  message?: string;
  values?: { title: string; body: string };
};
