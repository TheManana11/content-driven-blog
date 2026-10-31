import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/posts/post-form";
import { getPost, getPosts } from "@/lib/data/posts";
import { parsePostId } from "@/lib/validation/post";
import { updatePostAction } from "../../_actions/update-post";

export const metadata = { title: "Edit post" };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ id: String(post.id) }));
}

export default async function EditPostPage(
  props: PageProps<"/posts/[id]/edit">,
) {
  const { id: rawId } = await props.params;
  const id = parsePostId(rawId);
  if (id === null) notFound();

  const post = await getPost(id);
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
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        JSONPlaceholder simulates saving: your changes are accepted but not
        persisted.
      </p>

      <div className="mt-8">
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
