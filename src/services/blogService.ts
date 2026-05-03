import { blogAPI, authorAPI } from "../utils/api";
import type { BlogPost, Author } from "../types/blog";

export interface EnrichedBlogPost extends BlogPost {
  author?: Author | null;
}

export class BlogService {
  static async getPostWithAuthor(slug: string): Promise<EnrichedBlogPost | null> {
    try {
      // Validate slug
      if (!slug || slug === "null" || slug === "undefined") {
        console.error("[BlogService] Invalid slug provided:", slug);
        return null;
      }

      console.log(`[BlogService] Fetching post for slug: ${slug}`);

      // Fetch the post
      const post = await blogAPI.getBySlug(slug);

      // Check if post exists
      if (!post) {
        console.error(`[BlogService] No post found for slug: ${slug}`);
        return null;
      }

      console.log(`[BlogService] Post found: ${post.title}`);

      // Fetch author if post has authorId
      let author = null;
      if (post.authorId) {
        try {
          author = await authorAPI.getById(post.authorId);
          console.log(`[BlogService] Author fetched: ${author?.name || "Unknown"}`);
        } catch (authorError) {
          console.warn(`[BlogService] Could not fetch author for ${post.authorId}:`, authorError);
          // Don't fail the whole request if author fetch fails
        }
      }

      return { ...post, author };
    } catch (error) {
      console.error(`[BlogService] Error fetching post for slug ${slug}:`, error);
      return null;
    }
  }

  static async getLatestPosts(limit = 10): Promise<BlogPost[]> {
    try {
      const posts = await blogAPI.getAll(1, limit);
      return Array.isArray(posts) ? posts : [];
    } catch (error) {
      console.error("[BlogService] Error fetching latest posts:", error);
      return [];
    }
  }

  static async getPostsByCategory(category: string, page = 1): Promise<BlogPost[]> {
    try {
      if (!category) {
        console.error("[BlogService] Invalid category provided");
        return [];
      }

      const posts = await blogAPI.getByCategory(category, page);
      return Array.isArray(posts) ? posts : [];
    } catch (error) {
      console.error(`[BlogService] Error fetching posts for category ${category}:`, error);
      return [];
    }
  }

  static async getPostsByTag(tag: string, page = 1): Promise<BlogPost[]> {
    try {
      if (!tag) {
        console.error("[BlogService] Invalid tag provided");
        return [];
      }

      const posts = await blogAPI.getByTag(tag, page);
      return Array.isArray(posts) ? posts : [];
    } catch (error) {
      console.error(`[BlogService] Error fetching posts for tag ${tag}:`, error);
      return [];
    }
  }

  static extractVideoId(url: string): string | null {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  static getYouTubeThumbnail(videoUrl: string, quality: "default" | "maxres" = "maxres"): string {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) return "";

    return quality === "maxres"
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
}
