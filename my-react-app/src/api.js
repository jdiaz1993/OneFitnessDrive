const API_BASE = process.env.REACT_APP_API_BASE || '/api';

export const getToken = () => localStorage.getItem("reviews:jwt") || "";
export const setToken = (t) => (t ? localStorage.setItem("reviews:jwt", t) : localStorage.removeItem("reviews:jwt"));

const CID_KEY = "reviews:cid";
export const getCid = () => localStorage.getItem(CID_KEY) || "";
export const setCid = (v) => (v ? localStorage.setItem(CID_KEY, v) : localStorage.removeItem(CID_KEY));

async function handle(res) {
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

export async function loginWithCode(code) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, client_id: getCid() }), // send existing or blank
  });
  const data = await handle(res);
  setToken(data.token);
  if (data.client_id) setCid(data.client_id);           // save new cid if issued
  return data.token;
}

export async function fetchReviews() {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/reviews`, { headers });
  return handle(res);
}

export async function postReview(payload) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteReview(id) {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handle(res);
}
