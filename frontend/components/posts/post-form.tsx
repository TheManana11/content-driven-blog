"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/types/post";

// Shared by the create page and the edit page.
//
// This is a Client Component because useActionState is a React hook, and hooks
// only run in the browser. useActionState gives us three things:
//   state      -> whatever the Server Action returned last time (errors + values)
//   formAction -> a wrapped version of the action to put on <form action>
//   pending    -> true while the action is running, used to disable the button
type PostFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: { title: string; body: string };
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
};

const inputClass =
  "w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function PostForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
  cancelHref,
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  // After a failed submit, show what the user typed; otherwise the defaults.
  const title = state.values?.title ?? defaultValues?.title ?? "";
  const body = state.values?.body ?? defaultValues?.body ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Error messages returned by the backend (through the Server Action). */}
      {state.errors && (
        <div
          role="alert"
          className="rounded border border-red-600 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500 dark:bg-red-950 dark:text-red-200"
        >
          <ul className="list-inside list-disc">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* The HTML attributes (required, minLength, maxLength) give quick
          feedback in the browser. The backend still checks everything. */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={100}
          defaultValue={title}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium">
          Content
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          required
          minLength={10}
          maxLength={2000}
          defaultValue={body}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="text-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
