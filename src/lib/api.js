/**
 * api.js — client-side API helpers
 *
 * Requests use Vite env configuration in production and keep
 * relative /api/* paths in local development through the proxy.
 */

import { getApiUrl } from "@/lib/config.js";

async function parseResponse(response) {
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error(
      "The server returned an unexpected response. Please try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        payload?.message ||
        `Request failed (${response.status}).`,
    );
  }

  return payload;
}

/** Fetch approved tributes for the public wall */
export async function fetchPublicSubmissions() {
  const response = await fetch(getApiUrl("/api/submissions/public"));
  return parseResponse(response);
}

/** Submit a new tribute/photo contribution */
export async function submitContribution(formData) {
  const response = await fetch(getApiUrl("/api/submissions"), {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type header — browser sets it with the correct
    // multipart boundary when body is FormData.
  });
  return parseResponse(response);
}

/** Fetch all submissions for admin review (requires admin key) */
export async function fetchAdminSubmissions(adminKey, status = "all") {
  if (!adminKey) throw new Error("Admin key is required.");

  const response = await fetch(
    getApiUrl(`/api/admin/submissions?status=${encodeURIComponent(status)}`),
    {
      headers: { "x-admin-key": adminKey },
    },
  );
  return parseResponse(response);
}

/** Update a submission's approval status */
export async function updateAdminSubmissionStatus(id, status, adminKey) {
  if (!adminKey) throw new Error("Admin key is required.");
  if (!id) throw new Error("Submission ID is required.");

  const response = await fetch(
    getApiUrl(`/api/admin/submissions/${encodeURIComponent(id)}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ status }),
    },
  );
  return parseResponse(response);
}
