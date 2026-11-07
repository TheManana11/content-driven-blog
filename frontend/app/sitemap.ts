import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// Lists every post page so search engines can find them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: `${SITE_URL}/` },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.id}`,
      lastModified: post.updatedAt,
    })),
  ];
}
