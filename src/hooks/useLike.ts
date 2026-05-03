import { useState, useEffect } from "react";

export function useLike(postId: string, initialLikes: number = 0) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(`liked_${postId}`);
    if (liked) setIsLiked(true);
  }, [postId]);

  const toggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: !isLiked }),
      });

      if (response.ok) {
        const newLikeCount = isLiked ? likes - 1 : likes + 1;
        setLikes(newLikeCount);
        setIsLiked(!isLiked);

        if (!isLiked) {
          localStorage.setItem(`liked_${postId}`, "true");
        } else {
          localStorage.removeItem(`liked_${postId}`);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { likes, isLiked, isLoading, toggleLike };
}
