"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { deletePost, postTag } from "@/lib/data/posts";
import { parsePostId } from "@/lib/validation/post";

// The form also passes FormData as a trailing argument after the bound id; we
// don't need it, so the signature simply omits it.
export async function deletePostAction(id: number): Promise<void> {
  // Server Actions are public endpoints and bound args come from the client,
  // so validate the id here. JSONPlaceholder answers 200 for ANY id on DELETE,
  // so the API would never reject a bad one for us.
  if (!Number.isInteger(id) || parsePostId(String(id)) === null) {
    throw new Error("Invalid post id.");
  }

  // Unlike create/edit, delete has no form fields to re-render with errors, so
  // unexpected API errors are simply thrown and surface in error.tsx.
  await deletePost(id);

  // Correct for a real backend: expire the list and the single-post cache.
  // JSONPlaceholder doesn't actually delete anything, so the post will still
  // be there afterwards.
  updateTag("posts");
  updateTag(postTag(id));

  // redirect() throws internally, so it must stay outside any try/catch.
  redirect("/?status=deleted");
}
