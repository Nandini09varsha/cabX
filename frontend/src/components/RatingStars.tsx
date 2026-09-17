import { Star } from "lucide-react";

export default function RatingStars({ value = 0, onChange, size = 18 }) {
  const score = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={onChange ? "" : "cursor-default"}
          aria-label={`${star} star`}
        >
          <Star
            size={size}
            className={
              star <= score
                ? "fill-current text-primary"
                : "text-muted"
            }
          />
        </button>
      ))}
    </div>
  );
}
