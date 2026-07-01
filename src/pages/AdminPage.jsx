import { useState } from "react";

import CollectionPage from "@/components/CollectionPage.jsx";
import {
  fetchAdminSubmissions,
  updateAdminSubmissionStatus,
} from "@/lib/api.js";

import "./AdminPage.css";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSubmissions(nextStatus = statusFilter) {
    setLoading(true);
    setFeedback("Loading...");

    try {
      const payload = await fetchAdminSubmissions(adminKey, nextStatus);
      setSubmissions(payload.submissions || []);
      setCounts(payload.counts || { pending: 0, approved: 0, rejected: 0 });
      setFeedback(
        payload.submissions?.length
          ? `${payload.submissions.length} ${nextStatus} submission${payload.submissions.length === 1 ? "" : "s"}`
          : `No ${nextStatus} submissions yet.`,
      );
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id, nextStatus) {
    setLoading(true);
    try {
      await updateAdminSubmissionStatus(id, nextStatus, adminKey);
      await loadSubmissions(statusFilter);
    } catch (error) {
      setFeedback(error.message);
      setLoading(false);
    }
  }

  async function handleReview(event) {
    event.preventDefault();
    await loadSubmissions(statusFilter);
  }

  return (
    <CollectionPage
      eyebrow="Admin"
      title="Review incoming tributes and photos"
      description="Approve or reject submissions before they appear on the public tribute wall. Use your admin key to access this page."
      ctaLabel="View tribute wall"
      ctaTo="/tributes"
    >
      {/* ── Auth + filter form ── */}
      <article className="paper-card admin-card admin-card--wide">
        <form className="admin-form" onSubmit={handleReview}>
          <label>
            <span>Admin key</span>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              required
            />
          </label>
          <label>
            <span>Show</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </label>
          <div className="admin-form__actions">
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Load submissions"}
            </button>
          </div>
        </form>

        {feedback && <p className="admin-form__feedback">{feedback}</p>}

        {/* Counts */}
        <div className="admin-counts">
          <div className="scrap-card admin-count">
            <p className="content-tag">Pending</p>
            <p className="admin-count__value">{counts.pending}</p>
          </div>
          <div className="scrap-card admin-count">
            <p className="content-tag">Approved</p>
            <p className="admin-count__value">{counts.approved}</p>
          </div>
          <div className="scrap-card admin-count">
            <p className="content-tag">Rejected</p>
            <p className="admin-count__value">{counts.rejected}</p>
          </div>
        </div>
      </article>

      {/* ── Submission cards ── */}
      {submissions.map((submission) => (
        <article
          key={submission.id}
          className="paper-card admin-submission-card"
        >
          <div className="admin-submission-card__header">
            <div className="admin-submission-card__meta">
              <p className="content-tag">{submission.category}</p>
              <h3 className="content-title admin-submission-card__name">
                {submission.name}
              </h3>
              <p className="content-meta">
                {submission.relationship || "Guest"}
              </p>
            </div>
            <span
              className={`category-pill category-pill--${submission.status}`}
            >
              {submission.status}
            </span>
          </div>

          <p className="content-body">
            {submission.message || "Photo-only contribution."}
          </p>

          {submission.imageUrl && (
            <img
              className="admin-submission-card__image"
              src={submission.imageUrl}
              alt={`${submission.name} upload`}
            />
          )}

          <div className="admin-submission-card__actions">
            <button
              className="secondary-button admin-btn-approve"
              type="button"
              disabled={loading || submission.status === "approved"}
              onClick={() => handleStatusUpdate(submission.id, "approved")}
            >
              Approve
            </button>
            <button
              className="secondary-button admin-btn-reject"
              type="button"
              disabled={loading || submission.status === "rejected"}
              onClick={() => handleStatusUpdate(submission.id, "rejected")}
            >
              Reject
            </button>
          </div>
        </article>
      ))}
    </CollectionPage>
  );
}
