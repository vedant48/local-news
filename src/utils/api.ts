import type { Author, BlogPost } from "../types/blog";

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "http://walrus-app-ygv8l.ondigitalocean.app";

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`[API] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`[API] Error ${response.status}: ${url}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Handle different API response structures
    if (result && typeof result === "object") {
      if (result.data) return result.data;
      if (result.post) return result.post;
      if (result.blog) return result.blog;
    }

    return result;
  } catch (error) {
    console.error(`[API] Fetch error for ${url}:`, error);
    throw error;
  }
}

export const blogAPI = {
  getAll: async (page = 1, limit = 20, category?: string): Promise<BlogPost[]> => {
    try {
      let url = `/blogs?page=${page}&limit=${limit}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const result = await fetchAPI<BlogPost[] | { data: BlogPost[] }>(url);

      // Handle different response formats
      if (Array.isArray(result)) {
        return result;
      } else if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<BlogPost | null> => {
    try {
      if (!id) throw new Error("Post ID is required");
      const post = await fetchAPI<BlogPost>(`/blogs/${id}`);
      return post || null;
    } catch (error) {
      console.error(`Error fetching post by id ${id}:`, error);
      return null;
    }
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      if (!slug || slug === "null") {
        throw new Error("Valid slug is required");
      }

      // Try fetching by slug directly
      try {
        const post = await fetchAPI<BlogPost>(`/blogs/slug/${slug}`);
        if (post) {
          console.log(`Post found for slug ${slug} using direct fetch.`);
          return post;
        }

        console.log(`No post found for slug ${slug} using direct fetch, trying alternative method.`);
      } catch (error) {
        console.log(`Direct slug fetch failed, trying alternative method for: ${slug}`);
      }

      // Alternative: Try to get all posts and filter by slug
      const allPosts = await blogAPI.getAll(1, 100);
      const foundPost = allPosts.find((post) => post.slug === slug);

      if (foundPost) return foundPost;

      console.error(`No post found for slug: ${slug}`);
      return null;
    } catch (error) {
      console.error(`Error fetching post by slug ${slug}:`, error);
      return null;
    }
  },

  getByCategory: async (category: string, page = 1): Promise<BlogPost[]> => {
    try {
      const url = `/blogs?category=${encodeURIComponent(category)}&page=${page}`;
      const result = await fetchAPI<BlogPost[]>(url);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Error fetching category ${category}:`, error);
      return [];
    }
  },

  getByTag: async (tag: string, page = 1): Promise<BlogPost[]> => {
    try {
      const url = `/blogs/tag/${encodeURIComponent(tag)}?page=${page}`;
      const result = await fetchAPI<BlogPost[]>(url);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Error fetching tag ${tag}:`, error);
      return [];
    }
  },

  search: async (query: string): Promise<BlogPost[]> => {
    try {
      const url = `/blogs/search?q=${encodeURIComponent(query)}`;
      const result = await fetchAPI<BlogPost[]>(url);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      return [];
    }
  },

  getRelated: async (id: string, category: string): Promise<BlogPost[]> => {
    try {
      const url = `/blogs/${id}/related?category=${encodeURIComponent(category)}`;
      const result = await fetchAPI<BlogPost[]>(url);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Error fetching related posts for ${id}:`, error);
      return [];
    }
  },
};

export const authorAPI = {
  getById: async (id: string): Promise<Author | null> => {
    try {
      if (!id) throw new Error("Author ID is required");

      const author = await fetchAPI<Author>(`/authors/${id}`);
      return author || null;
    } catch (error) {
      console.error(`Error fetching author ${id}:`, error);
      return null;
    }
  },
};
