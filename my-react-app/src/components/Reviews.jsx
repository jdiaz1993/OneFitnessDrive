import { useEffect, useMemo, useState } from "react";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import {
  fetchReviews,
  postReview,
  loginWithCode,
  getToken,
  deleteReview,
} from "../api";

export default function Reviews() {
  // Normalize dates so either created_at or createdAt works in the UI
  const normalize = (r) => ({
    ...r,
    createdAt: r.created_at ?? r.createdAt ?? r.createdAT,
    created_at: r.created_at ?? r.createdAt ?? r.createdAT,
  });

  // form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");               // ← NEW: Age
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  // data
  const [reviews, setReviews] = useState([]);

  // auth + ui
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load reviews
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchReviews();
        setReviews((Array.isArray(data) ? data : []).map(normalize));
      } catch (e) {
        setError(e.message || "Could not load reviews");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // stats
  const { avg, count } = useMemo(() => {
    const c = reviews.length;
    const sum = reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0);
    return { avg: c ? (sum / c).toFixed(1) : "0.0", count: c };
  }, [reviews]);

  const verifyCode = async () => {
    try {
      await loginWithCode(code.trim());
      setAuthed(true);
      setError("");
      setCode("");
      // refresh so can_delete reflects your role/token
      const data = await fetchReviews();
      setReviews((Array.isArray(data) ? data : []).map(normalize));
    } catch (e) {
      setError(e.message || "Invalid code");
    }
  };

  const submit = async () => {
    const text = comment.trim();
    const person = name.trim(); // ← REQUIRED: no "Anonymous" fallback
    if (!text) return;

    if (!authed) {
      setError("Posting is restricted. Enter the access code to unlock.");
      return;
    }
    if (!person) {
      setError("Please enter your name to post a review.");
      return;
    }
    if (website) {
      setComment(""); // honeypot triggered
      return;
    }

    try {
      const payload = {
        name: person,
        rating: Number(rating),
        text,
        // Only send age if valid; backend can ignore if not supported
        ...(age !== "" && Number.isFinite(Number(age)) ? { age: Number(age) } : {}),
      };

      const row = await postReview(payload);
      setReviews((prev) => [normalize(row), ...prev]);
      setName("");
      setAge("");                 // ← reset age
      setRating(5);
      setComment("");
      setError("");
    } catch (e) {
      setError(e.message || "Could not post right now.");
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
  };

  // delete handler
  const onDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  // helper for disabling submit (name and comment required; rating already set)
  const canSubmit = authed && name.trim() && comment.trim();

  return (
    <div>
      {/* Header / Stats */}
      <div className="text-center my-4">
        <h2 className="mb-2 text-white">What My Clients Say</h2>
        <div className="d-inline-flex align-items-center gap-2">
          <StarRating value={Number(avg)} readOnly />
          <span className="fw-semibold text-white">{avg}</span>
          <span className="text-white">({count} review{count === 1 ? "" : "s"})</span>
        </div>
      </div>

      {/* Access Code Section */}
      {!authed && (
        <div className="container-md my-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="mb-2">Posting Locked</h5>
              <p className="text-muted mb-3">
                Only trusted clients can post reviews. Enter the access code.
              </p>
              <div className="input-group input-group-lg">
                <input
                  type="password"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  placeholder="Enter access code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                />
                <button className="btn btn-primary" type="button" onClick={verifyCode}>
                  Unlock
                </button>
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <div className="d-flex justify-content-between flex-wrap mt-3">
                <small className="text-muted">Your browser will remember this device.</small>
                <small className="text-muted">
                  Don’t have a code? <a href="/contact">Contact me</a>.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review form */}
      <div className="container-fluid px-0 my-4">
        <div className="card w-100 rounded-0 border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-dark">Add your review</h5>
            {authed ? (
              <>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      className={`form-control ${!name.trim() && error ? "is-invalid" : ""}`}
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      required
                    />
                  </div>

                  {/* NEW: Age field (optional). Make it required by adding `required` and disabling submit accordingly */}
                  <div className="col-md-6">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g., 28"
                      min={10}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      inputMode="numeric"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label d-block">Rating</label>
                    <div className="d-flex align-items-center gap-2">
                      <StarRating value={rating} onChange={setRating} />
                      <small className="text-muted">{rating}/5</small>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Review <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Share your experience…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={onKeyDown}
                      required
                    />
                  </div>

                  {/* Honeypot hidden input */}
                  <div style={{ position: "absolute", left: "-9999px" }}>
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={submit}
                      disabled={!canSubmit}
                      title={!authed ? "Unlock posting first" : (!name.trim() ? "Name is required" : (!comment.trim() ? "Review is required" : ""))}
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setName("");
                        setAge("");
                        setRating(5);
                        setComment("");
                        setError("");
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {error && <div className="text-danger mt-3">{error}</div>}
              </>
            ) : (
              <div className="text-muted">Enter the access code above to enable the form.</div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="container-fluid my-5">
        {loading ? (
          <div className="text-center text-white py-4">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-white py-4">No reviews yet. Be the first!</div>
        ) : (
          <div className="row g-3">
            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onDelete={authed && r.can_delete ? onDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
