import Link from "next/link";
import type { Post } from "@/types/post";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="h-full">
      <Link
        href={`/posts/${post.id}`}
        className="flex h-full flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      >
        <h2 className="text-lg font-semibold leading-snug first-letter:uppercase">
          {post.title}
        </h2>
        {/* Newlines in the body collapse to spaces in HTML; line-clamp truncates visually. */}
        <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
          {post.body}
        </p>
      </Link>
    </article>
  );
}
