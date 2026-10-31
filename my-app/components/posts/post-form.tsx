"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionState } from "@/types/post";

type PostFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { title: string; body: string };
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
};

const inputClass =
  "w-full rounded border border-zinc-300 bg-white px-3 py-2 text-zinc-900 aria-[invalid=true]:border-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function PostForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
  cancelHref,
}: PostFormProps) {
  const [state, formAction] = useActionState(action, {} as ActionState);

  const titleError = state.errors?.title?.[0];
  const bodyError = state.errors?.body?.[0];
  const title = state.values?.title ?? defaultValues?.title ?? "";
  const body = state.values?.body ?? defaultValues?.body ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <div
          role="alert"
          className="rounded border border-red-600 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500 dark:bg-red-950 dark:text-red-200"
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        {/* key changes with the submitted values so defaultValue is re-applied
            after React resets the form. */}
        <input
          key={`title-${title}`}
          id="title"
          name="title"
          type="text"
          required
          maxLength={100}
          defaultValue={title}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "title-error" : undefined}
          className={inputClass}
        />
        {titleError && (
          <p id="title-error" className="text-sm text-red-700 dark:text-red-400">
            {titleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium">
          Content
        </label>
        <textarea
          key={`body-${body}`}
          id="body"
          name="body"
          rows={8}
          required
          maxLength={2000}
          defaultValue={body}
          aria-invalid={bodyError ? true : undefined}
          aria-describedby={bodyError ? "body-error" : undefined}
          className={inputClass}
        />
        {bodyError && (
          <p id="body-error" className="text-sm text-red-700 dark:text-red-400">
            {bodyError}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton pendingText={pendingLabel}>{submitLabel}</SubmitButton>
        <Link href={cancelHref} className="text-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Cancel
        </Link>
      </div>
    </form>
  );
}
