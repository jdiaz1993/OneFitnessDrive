import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "1.25rem",
}) {
  const [hover, setHover] = useState(0);
  const current = hover || value;

  return (
    <div className="d-inline-flex gap-1 align-items-center text-warning">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="btn p-0 border-0 bg-transparent"
          style={{
            lineHeight: 1,
            fontSize: size,
            cursor: readOnly ? "default" : "pointer",
            color: "inherit",
          }}
          aria-label={`${n} star`}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          disabled={readOnly}
        >
          {current >= n ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
