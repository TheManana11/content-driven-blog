import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeletePostButton } from "@/components/posts/delete-post-button";
import { StatusNotice } from "@/components/posts/status-notice";
import { getPostById } from "@/lib/api";

// params holds the dynamic part of the URL: /posts/5 -> { id: "5" }.
type PostPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

// Builds the <title> and description for this post's page.
// Next.js remembers identical fetch calls during one request, so calling
// getPostById here and again in the page only reaches NestJS once.
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const description = post.body.slice(0, 155);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.id}` },
    openGraph: { type: "article", title: post.title, description },
  };
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  const { id } = await params;
  const { status } = await searchParams;

  const post = await getPostById(id);
  if (!post) notFound(); // shows app/not-found.tsx

  const publishedOn = new Date(post.createdAt).toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  return (
    <article className="mx-auto w-full max-w-2xl">
      <Link
        href="/"
        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to all posts
      </Link>

      <div className="mt-6">
        <StatusNotice status={status} />
      </div>

      <h1 className="text-3xl font-bold leading-tight first-letter:uppercase">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Post #{post.id} · {publishedOn}
      </p>

      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
        {post.body}
      </div>

      <div className="mt-8 flex items-start gap-3">
        <Link
          href={`/posts/${post.id}/edit`}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Edit
        </Link>
        <DeletePostButton postId={post.id} />
      </div>
    </article>
  );
}
