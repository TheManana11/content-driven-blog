import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/posts/post-form";
import { updatePostAction } from "@/lib/actions";
import { getPostById } from "@/lib/api";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return {
    title: `Edit: ${post.title}`,
    robots: { index: false, follow: true },
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href={`/posts/${post.id}`}
        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to post
      </Link>

      <h1 className="mt-6 text-3xl font-bold leading-tight">Edit post</h1>

      <div className="mt-8">
        {/* .bind(null, post.id) makes a copy of updatePostAction with the id
            already filled in as its first argument. */}
        <PostForm
          action={updatePostAction.bind(null, post.id)}
          defaultValues={{ title: post.title, body: post.body }}
          submitLabel="Save changes"
          pendingLabel="Saving…"
          cancelHref={`/posts/${post.id}`}
        />
      </div>
    </div>
  );
}
