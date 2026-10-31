import Link from "next/link";
import { notFound } from "next/navigation";
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
        {/* Edit and Delete actions are added in feature/edit-post and feature/delete-post */}
      </div>
    </article>
  );
}
