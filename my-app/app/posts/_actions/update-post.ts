"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { postTag, updatePost } from "@/lib/data/posts";
import {
  parsePostId,
  toFieldErrors,
  updatePostSchema,
} from "@/lib/validation/post";
import type { ActionState } from "@/types/post";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

// `id` is bound from the page with .bind(null, id), so the form only passes
// (prevState, formData).
export async function updatePostAction(
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Actions are public endpoints and bound arguments come from the client:
  // re-validate the id on the server.
  if (!Number.isInteger(id) || parsePostId(String(id)) === null) {
    return { message: "Invalid post." };
  }

  const values = {
    title: asString(formData.get("title")),
    body: asString(formData.get("body")),
  };

  const result = updatePostSchema.safeParse(values);
  if (!result.success) {
    return { errors: toFieldErrors(result.error), values };
  }

  try {
    await updatePost(id, result.data);
  } catch {
    return { message: "Could not update the post. Please try again.", values };
  }

  // Correct for a real backend: expires the list and this post. JSONPlaceholder
  // does not persist writes, so the old content will still show.
  updateTag("posts");
  updateTag(postTag(id));

  // redirect() throws internally, so it must stay outside try/catch.
  redirect(`/posts/${id}?status=updated`);
}
