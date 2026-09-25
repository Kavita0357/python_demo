import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { leaveService, leaveTypeService } from "../services/leaveService";
import { Badge, formatDate } from "./DashboardPage";
import { useAuth } from "../context/AuthContext";

export default function LeaveDetailPage() {
  const { id } = useParams(),
    [leave, setLeave] = useState(null),
    [type, setType] = useState(null),
    [comments, setComments] = useState([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reason, setReason] = useState(""),
    [comment, setComment] = useState("");
    const { user } = useAuth();
      const isAdmin =
        (user?.role?.name || user?.role_name || "").toLowerCase() === "admin";
  const load = async () => {
    try {
      const [l, ts, c] = await Promise.all([
        leaveService.get(id),
        leaveTypeService.list(),
        leaveService.comments(id),
      ]);
      setLeave(l);
      setType(ts.find((t) => t.id === l.leave_type_id));
      setComments(c);
    } catch (e) {
      setError(e?.response?.data?.detail || "Could not load request.");
    }
  };
  useEffect(() => {
    load();
  }, [id]);
  const action = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || "Action failed.");
    } finally {
      setBusy(false);
    }
  };
  if (!leave) return <div className="page-loader">{error || "Loading…"}</div>;
  return (
    <div className="page narrow-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Request #{leave.id}</p>
          <h1>{type?.name || "Leave request"}</h1>
          <p>
            {formatDate(leave.start_date)} – {formatDate(leave.end_date)} ·{" "}
            {leave.total_days} day{leave.total_days !== 1 ? "s" : ""}
          </p>
        </div>
        <Badge status={leave.status} />
      </div>
      {error && <div className="alert">{error}</div>}
      <section className="panel detail-card">
        <div className="detail-grid">
          <div>
            <span>Employee</span>
            <strong>{`${leave?.user?.first_name} ${leave?.user?.last_name}` || `User #${leave?.user_id}`}</strong>
          </div>
          <div>
            <span>Start date</span>
            <strong>{formatDate(leave.start_date)}</strong>
          </div>
          <div>
            <span>End date</span>
            <strong>{formatDate(leave.end_date)}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{leave.total_days} days</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{formatDate(leave.created_at?.slice(0, 10))}</strong>
          </div>
        </div>
        <div className="detail-section">
          <span>Reason</span>
          <p>{leave.reason || "No reason provided."}</p>
        </div>
        {leave.status === "draft" && (
          <div className="form-actions">
            <button
              className="primary-btn"
              disabled={busy}
              onClick={() => action(() => leaveService.submit(id))}
            >
              Submit request
            </button>
            <button
              className="danger-btn"
              disabled={busy}
              onClick={() => action(() => leaveService.cancel(id))}
            >
              Cancel draft
            </button>
          </div>
        )}
        {isAdmin && (<>
            {leave.status === "pending" && (
            <div className="form-actions">
                <button
                className="danger-btn"
                disabled={busy}
                onClick={() => {
                    const r = window.prompt("Rejection reason");
                    if (r) action(() => leaveService.reject(id, r));
                }}
                >
                Reject
                </button>
                <button
                className="primary-btn"
                disabled={busy}
                onClick={() => action(() => leaveService.approve(id))}
                >
                Approve
                </button>
            </div>
            )}
        </>)}
        {["pending", "approved"].includes(leave.status) && (
          <div className="form-actions">
            <button
              className="ghost-btn"
              disabled={busy}
              onClick={() => action(() => leaveService.cancel(id))}
            >
              Cancel request
            </button>
          </div>
        )}
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Comments</h2>
            <p>Conversation attached to this request.</p>
          </div>
        </div>
        {comments.map((c) => (
          <div className="comment" key={c.id}>
            <strong>{`${c?.user?.first_name} ${c?.user?.last_name}` || `User #${c.user_id}`}</strong>
            <span>{c.comment}</span>
            <small>{formatDate(c.created_at?.slice(0, 10))}</small>
          </div>
        ))}
        {!comments.length && <div className="empty">No comments yet.</div>}
        <form
          className="comment-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            await action(async () => {
              await leaveService.addComment(id, comment);
              setComment("");
            });
          }}
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment…"
          />
          <button className="primary-btn" disabled={busy}>
            Add
          </button>
        </form>
      </section>
      <Link to="/leaves" className="back-link">
        ← Back to requests
      </Link>
    </div>
  );
}
