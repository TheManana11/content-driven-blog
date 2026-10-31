"use client";

import { useFormStatus } from "react-dom";
import { deletePostAction } from "@/app/posts/_actions/delete-post";

// This is a Client Component only because window.confirm and onSubmit need the
// browser. Keeping it this small lets the post page itself stay a Server
// Component. A Client Component may import a "use server" action and call
// .bind on it (bound args are serialized and sent to the server).
//
// Progressive enhancement: without JS the form still submits to the action,
// just without the confirmation prompt.

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600 dark:focus-visible:outline-red-400"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function DeletePostButton({ postId }: { postId: number }) {
  return (
    <form
      action={deletePostAction.bind(null, postId)}
      onSubmit={(e) => {
        // preventDefault stops React from invoking the action.
        if (!window.confirm("Delete this post? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <DeleteSubmitButton />
    </form>
  );
}
