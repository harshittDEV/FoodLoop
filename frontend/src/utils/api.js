/**
 * API client for the FoodLoop backend.
 * Base URL is read from the VITE_API_BASE_URL env var.
 * Defaults to http://localhost:8080/api for local development.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

export function getAuthToken() {
  return authToken;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...options.headers };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new Error('Network error — please check if the backend server is running.');
  }

  let body = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    body = await res.json();
  }

  if (!res.ok) {
    // If token expired or rejected, clear it and dispatch event
    if (res.status === 401 && authToken) {
      clearAuthToken();
      localStorage.removeItem('foodloop_token');
      window.dispatchEvent(new Event('foodloop:session-expired'));
    }
    const message = body?.error || body?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

// ── Auth API ──────────────────────────────────────

export async function apiSignUp({ name, email, password, role }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function apiSignIn({ email, password }) {
  return request('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiVerifyEmail(token) {
  return request(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export async function apiResendVerification(email) {
  return request('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function apiGetCurrentUser() {
  return request('/users/me');
}

// ── Food Offers API ───────────────────────────────

export async function apiBrowseOffers({ search, category, donorType, priceType, page = 0, size = 12 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  if (donorType && donorType !== 'all') params.set('donorType', donorType);
  if (priceType && priceType !== 'all') params.set('priceType', priceType);
  params.set('page', String(page));
  params.set('size', String(size));
  return request(`/offers?${params.toString()}`);
}

export async function apiGetOffer(id) {
  return request(`/offers/${id}`);
}

export async function apiCreateOffer(data) {
  return request('/offers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateOffer(id, data) {
  return request(`/offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiCancelOffer(id) {
  return request(`/offers/${id}`, {
    method: 'DELETE',
  });
}

// ── Claims API ────────────────────────────────────

export async function apiCreateClaim({ offerId, notes }) {
  return request('/claims', {
    method: 'POST',
    body: JSON.stringify({ offerId, notes }),
  });
}

export async function apiAcceptClaim(id) {
  return request(`/claims/${id}/accept`, {
    method: 'POST',
  });
}

export async function apiRejectClaim(id) {
  return request(`/claims/${id}/reject`, {
    method: 'POST',
  });
}

export async function apiMarkClaimPickedUp(id) {
  return request(`/claims/${id}/pickup`, {
    method: 'POST',
  });
}

export async function apiCancelClaim(id) {
  return request(`/claims/${id}/cancel`, {
    method: 'POST',
  });
}

export async function apiGetClaimsForOffer(offerId) {
  return request(`/claims/offer/${offerId}`);
}

// ── Dashboard API ─────────────────────────────────

export async function apiGetDonorDashboard() {
  return request('/donor/dashboard');
}

export async function apiGetRecipientDashboard() {
  return request('/recipient/dashboard');
}

// ── Health ────────────────────────────────────────

export async function apiHealthCheck() {
  return request('/health');
}

// ── Contact & Feedback API ────────────────────────

export async function apiSendContactMessage({ name, email, topic, message }) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, topic, message }),
  });
}
