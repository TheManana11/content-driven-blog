import type { Metadata } from "next";
import { PostForm } from "@/components/posts/post-form";
import { createPostAction } from "@/lib/actions";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: true },
};

export default function CreatePostPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Create a new post</h1>
      <PostForm
        action={createPostAction}
        submitLabel="Create post"
        pendingLabel="Creating…"
        cancelHref="/"
      />
    </div>
  );
}
