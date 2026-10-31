import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PostList } from "@/components/posts/post-list";
import { StatusNotice } from "@/components/posts/status-notice";
import { getPosts } from "@/lib/data/posts";

export const metadata: Metadata = { title: "All posts" };

export default async function Home(props: PageProps<"/">) {
  const posts = await getPosts();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latest posts</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Browse posts fetched from JSONPlaceholder.
          </p>
        </div>
        <Link
          href="/posts/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          New post
        </Link>
      </div>
      <Suspense fallback={null}>
        <StatusNotice searchParams={props.searchParams} />
      </Suspense>
      <PostList posts={posts} />
    </div>
  );
}
