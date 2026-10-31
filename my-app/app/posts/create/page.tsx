import type { Metadata } from "next";
import { PostForm } from "@/components/posts/post-form";
import { createPostAction } from "../_actions/create-post";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: true },
};

export default function CreatePostPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-2 text-2xl font-semibold">Create a new post</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        JSONPlaceholder simulates saving: the request succeeds but nothing is
        actually stored.
      </p>
      <PostForm
        action={createPostAction}
        submitLabel="Create post"
        pendingLabel="Creating…"
        cancelHref="/"
      />
    </div>
  );
}
