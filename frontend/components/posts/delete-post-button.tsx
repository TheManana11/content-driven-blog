"use client";

import { useActionState } from "react";
import { deletePostAction } from "@/lib/actions";

// A Client Component because it needs the browser for two things:
// the window.confirm() prompt and useActionState (pending state + errors).
// It uses the same useActionState pattern as PostForm.
export function DeletePostButton({ postId }: { postId: number }) {
  const [state, formAction, pending] = useActionState(
    deletePostAction.bind(null, postId),
    {},
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        // If the user clicks "Cancel", stop the form from submitting.
        if (!window.confirm("Delete this post? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600 dark:focus-visible:outline-red-400"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state.errors && (
        <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
          {state.errors.join(" ")}
        </p>
      )}
    </form>
  );
}
