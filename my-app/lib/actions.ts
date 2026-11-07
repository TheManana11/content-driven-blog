"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost, deletePost, updatePost } from "@/lib/api";
import type { FormState, PostInput } from "@/types/post";

// Server Actions: functions that run on the server when a form is submitted.
// Each one reads the form, asks lib/api.ts to call NestJS, and then either
// returns error messages to the form or refreshes the pages and redirects.
//
// Why revalidatePath? The browser keeps a copy of pages it has already visited.
// After a change we call revalidatePath so those copies are thrown away and
// the next visit shows the new data.
//
// redirect() works by throwing a special signal, so it must be the last line
// and must not be inside a try/catch.

// Reads the two form fields and trims extra spaces.
function readPostForm(formData: FormData): PostInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
  };
}

export async function createPostAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readPostForm(formData);

  const errors = await createPost(values);
  if (errors) {
    return { errors, values };
  }

  revalidatePath("/");
  redirect("/?status=created");
}

// `id` is attached in advance with updatePostAction.bind(null, post.id),
// so the form itself only passes (prevState, formData).
export async function updatePostAction(
  id: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readPostForm(formData);

  const errors = await updatePost(id, values);
  if (errors) {
    return { errors, values };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}?status=updated`);
}

// `id` is bound the same way as above. React also passes (prevState, formData),
// but delete needs neither, so we simply leave them out of the parameter list.
export async function deletePostAction(id: number): Promise<FormState> {
  const errors = await deletePost(id);
  if (errors) {
    return { errors };
  }

  revalidatePath("/");
  redirect("/?status=deleted");
}
