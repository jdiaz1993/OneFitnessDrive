import React, { useState } from "react";

/* ====== CONFIGURE THESE ====== */
const WEB3FORMS_ACCESS_KEY = "b4630c88-65e2-4b07-954c-c7867ab1cb97"; // from web3forms.com
const INSTAGRAM_HANDLE = "dannygatica30";            // your IG handle
const EMAIL_USER = "hello";                           // e.g., "hello"
const EMAIL_DOMAIN = "onedrivefitness.com";          // e.g., "onedrivefitness.com"
/* ============================= */

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const email = `${EMAIL_USER}@${EMAIL_DOMAIN}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: "" })); // clear per-field error on change
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email.";
    if (form.message.trim().length < 10)
      err.message = "Message must be at least 10 characters.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!validate()) return;

    try {
      setSending(true);

      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_ACCESS_KEY);
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("message", form.message);
      fd.append("from_name", "One Drive Fitness Website");
      fd.append("subject", "New contact form message");
      fd.append("replyto", form.email);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", msg: "Thanks! Your message has been sent." });
        setForm(initialForm);
      } else {
        setStatus({ type: "error", msg: data.message || "Submission failed." });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again in a moment." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-4"  style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",  }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm bg-light bg-opacity-100 rounded-3">
            <div className="card-body p-4">
              <h2 className="h4 mb-3 text-center">Contact Us</h2>

              {status.type === "success" && (
                <div className="alert alert-success" role="alert">
                  {status.msg}
                </div>
              )}
              {status.type === "error" && (
                <div className="alert alert-danger" role="alert">
                  {status.msg}
                </div>
              )}

              <form noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    disabled={sending}
                    placeholder="Your full name"
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    disabled={sending}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    disabled={sending}
                    placeholder="How can I help?"
                    required
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                  {sending ? (
                    <>
                      Sending…
                      <span className="spinner-border spinner-border-sm ms-2" aria-hidden="true"></span>
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
             

              {/* Secondary contact options */}
              <div className="text-center mt-4">
                <p className="text-muted mb-2">Prefer DM or email?</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {/* Email button with icon */}
                  <a
                    href={`mailto:${email}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="currentColor" aria-hidden="true" className="me-2"
                    >
                      <path d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5zm2.4 0h15.2L12 11.2 4.4 5zm15.2 2.1-7.5 5.6a1.8 1.8 0 0 1-2.2 0L4.4 7.1V19a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6V7.1z"/>
                    </svg>
                    Email Me
                  </a>

                  {/* Instagram button with icon */}
                  <a
                    href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="currentColor" aria-hidden="true" className="me-2"
                    >
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                    </svg>
                    Instagram DM
                  </a>
                </div>
                <small className="d-block text-muted mt-2">Replies within 24 hours</small>
              </div>
            </div>
          </div>

          <div className="my-3" />
        </div>
      </div>
    </div>
  );
}
