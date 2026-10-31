import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/site";

// No lastModified: the API provides no dates and we must not invent them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: `${SITE_URL}/` },
    ...posts.map((post) => ({ url: `${SITE_URL}/posts/${post.id}` })),
  ];
}
