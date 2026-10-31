"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createPost } from "@/lib/data/posts";
import { createPostSchema, toFieldErrors } from "@/lib/validation/post";
import type { ActionState } from "@/types/post";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function createPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = {
    title: asString(formData.get("title")),
    body: asString(formData.get("body")),
  };

  // Server Actions are public endpoints: always validate on the server.
  const result = createPostSchema.safeParse(values);
  if (!result.success) {
    return { errors: toFieldErrors(result.error), values };
  }

  try {
    await createPost(result.data);
  } catch {
    return { message: "Could not create the post. Please try again.", values };
  }

  // Correct in principle: expires the cached post list. JSONPlaceholder does
  // not persist writes, so the list will not actually change.
  updateTag("posts");

  // redirect() throws internally, so it must stay outside try/catch.
  redirect("/?status=created");
}
