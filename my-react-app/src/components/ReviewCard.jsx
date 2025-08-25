import StarRating from "./StarRating";

export default function ReviewCard({ review, onDelete }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm position-relative">
        {onDelete && (
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-2"
            aria-label="Delete review"
            onClick={() => onDelete(review.id)}
            title="Delete"
          />
        )}
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-light border fw-bold"
              style={{ width: 48, height: 48 }}
            >
              {review.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="fw-semibold">{review.name}</div>
              <div className="small text-muted">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <StarRating value={review.rating} readOnly size="1.1rem" />
          <p className="mt-2 mb-0 flex-grow-1 ">{review.text}</p>
        </div>
      </div>
    </div>
  );
}
