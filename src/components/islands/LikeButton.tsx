import { useLike } from "../../hooks/useLike";

interface Props {
  postId: string;
}

export default function LikeButton({ postId }: Props) {
  const { likes, isLiked, isLoading, toggleLike } = useLike(postId);

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        isLiked ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
}
