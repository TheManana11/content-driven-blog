import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusNotice } from "@/components/posts/status-notice";
import { getPost, getPosts } from "@/lib/data/posts";
import { parsePostId } from "@/lib/validation/post";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: String(post.id) }));
}

export default async function PostPage(props: PageProps<"/posts/[id]">) {
  const { id: rawId } = await props.params;
  const id = parsePostId(rawId);
  if (id === null) notFound();

  const post = await getPost(id);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-2xl">
      <Link
        href="/"
        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to all posts
      </Link>

      <Suspense fallback={null}>
        <StatusNotice searchParams={props.searchParams} />
      </Suspense>

      <h1 className="mt-6 text-3xl font-bold leading-tight first-letter:uppercase">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Post #{post.id} · Author #{post.userId}
      </p>

      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
        {post.body}
      </div>

      <div className="mt-8 flex gap-3" data-slot="post-actions">
        <Link
          href={`/posts/${post.id}/edit`}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Edit
        </Link>
      </div>
    </article>
  );
}
