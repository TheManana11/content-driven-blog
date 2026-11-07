import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/posts/post-list";
import { StatusNotice } from "@/components/posts/status-notice";
import { getPosts } from "@/lib/api";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` skips the layout's "%s | Content-Driven Blog" title template.
  title: { absolute: `All posts | ${SITE_NAME}` },
  description: "Browse all posts from the Content-Driven Blog.",
  alternates: { canonical: "/" },
};

// searchParams holds the URL query, e.g. { status: "created" } for /?status=created.
// In this version of Next.js it is a Promise, so we await it.
type HomePageProps = {
  searchParams: Promise<{ status?: string }>;
};

// Server Component: runs on the server, fetches posts from NestJS, returns HTML.
export default async function HomePage({ searchParams }: HomePageProps) {
  const { status } = await searchParams;
  const posts = await getPosts();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latest posts</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Read, write and edit posts.
          </p>
        </div>
        <Link
          href="/posts/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          New post
        </Link>
      </div>
      <StatusNotice status={status} />
      <PostList posts={posts} />
    </div>
  );
}
