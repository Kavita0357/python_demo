import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  leaveService,
  leaveTypeService,
  roleService,
} from "../services/leaveService";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const [leaves, setLeaves] = useState([]);
  const [types, setTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("");
  const [newType, setNewType] = useState({
    name: "",
    description: "",
    total_days: 0,
  });
  const { user } = useAuth();
  const isAdmin =
    (user?.role?.name || user?.role_name || "").toLowerCase() === "admin";
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [l, t, r] = await Promise.all([
        leaveService.list(),
        leaveTypeService.list(),
        roleService.list(),
      ]);
      setLeaves(l || []);
      setTypes(t || []);
      setRoles(r || []);
    } catch (e) {
      setError(
        e.response?.data?.detail || e.message || "Unable to load admin data",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () => (filter ? leaves.filter((x) => x.status === filter) : leaves),
    [leaves, filter],
  );
  const pending = leaves.filter((x) => x.status === "pending").length;
  const approved = leaves.filter((x) => x.status === "approved").length;
  const rejected = leaves.filter((x) => x.status === "rejected").length;
  const act = async (fn, id) => {
    setBusy(id);
    setError("");
    try {
      await fn(id);
      await load();
    } catch (e) {
      setError(e.response?.data?.detail || e.message || "Action failed");
    } finally {
      setBusy(null);
    }
  };
  const createType = async (e) => {
    e.preventDefault();
    setBusy("type");
    try {
      await leaveTypeService.create({
        ...newType,
        total_days: Number(newType.total_days),
      });
      setNewType({ name: "", description: "", total_days: 0 });
      await load();
    } catch (e) {
      setError(
        e.response?.data?.detail || e.message || "Could not create leave type",
      );
    } finally {
      setBusy(null);
    }
  };
  if (loading) return <div className="page-loader">Loading admin panel…</div>;
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Admin panel</h1>
          <p>Manage leave requests, leave types and roles.</p>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="admin-tabs">
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          className={tab === "requests" ? "active" : ""}
          onClick={() => setTab("requests")}
        >
          Leave requests
        </button>
        <button
          className={tab === "types" ? "active" : ""}
          onClick={() => setTab("types")}
        >
          Leave types
        </button>
        <button
          className={tab === "roles" ? "active" : ""}
          onClick={() => setTab("roles")}
        >
          Roles
        </button>
      </div>
      {tab === "overview" && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>Total requests</span>
              <strong>{leaves.length}</strong>
              <small>All employees</small>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{pending}</strong>
              <small>Need review</small>
            </div>
            <div className="stat-card">
              <span>Approved</span>
              <strong>{approved}</strong>
              <small>Approved requests</small>
            </div>
            <div className="stat-card">
              <span>Rejected</span>
              <strong>{rejected}</strong>
              <small>Rejected requests</small>
            </div>
          </div>
          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Pending approvals</h2>
                  <p>Requests waiting for an admin decision.</p>
                </div>
                <button
                  className="ghost-btn"
                  onClick={() => setTab("requests")}
                >
                  View all
                </button>
              </div>
              {leaves
                .filter((x) => x.status === "pending")
                .slice(0, 6)
                .map((x) => (
                  <div className="activity-row" key={x.id}>
                    <div>
                      <strong>Leave #{x.id}</strong>
                      <span>
                        {x.start_date} → {x.end_date} · {x.total_days} day(s)
                      </span>
                    </div>
                    <div>
                      <Link className="table-link" to={`/leaves/${x.id}`}>
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              {!pending && <div className="empty">No pending requests.</div>}
            </section>
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>System setup</h2>
                  <p>Current configuration.</p>
                </div>
              </div>
              <div className="balance-row">
                <div className="row-between">
                  <span>Leave types</span>
                  <strong>{types.length}</strong>
                </div>
              </div>
              <div className="balance-row">
                <div className="row-between">
                  <span>Roles</span>
                  <strong>{roles.length}</strong>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
      {tab === "requests" && (
        <section className="panel table-panel">
          <div className="panel-head admin-panel-head">
            <div>
              <h2>All leave requests</h2>
              <p>Review and approve or reject employee requests.</p>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((x) => (
                  <tr key={x.id}>
                    <td>#{x.id}</td>
                    <td>
                      {x.start_date}
                      <small>to {x.end_date}</small>
                    </td>
                    <td>{x.total_days}</td>
                    <td>
                      <span className={`badge badge-${x.status}`}>
                        {x.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link className="ghost-btn" to={`/leaves/${x.id}`}>
                          View
                        </Link>
                        {isAdmin && (
                          <>
                            {x.status === "pending" && (
                              <>
                                <button
                                  className="primary-btn"
                                  disabled={busy === x.id}
                                  onClick={() =>
                                    act(leaveService.approve, x.id)
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="danger-btn"
                                  disabled={busy === x.id}
                                  onClick={() => {
                                    const reason =
                                      window.prompt("Rejection reason");
                                    if (reason)
                                      act(
                                        (id) => leaveService.reject(id, reason),
                                        x.id,
                                      );
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && <div className="empty">No requests found.</div>}
          </div>
        </section>
      )}
      {tab === "types" && (
        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Leave types</h2>
                <p>Manage available leave categories.</p>
              </div>
            </div>
            {types.map((t) => (
              <div className="activity-row" key={t.id}>
                <div>
                  <strong>{t.name}</strong>
                  <span>
                    {t.total_days} days · {t.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  className="ghost-btn"
                  onClick={async () => {
                    try {
                      await leaveTypeService.update(t.id, {
                        is_active: !t.is_active,
                      });
                      await load();
                    } catch (e) {
                      setError(e.response?.data?.detail || e.message);
                    }
                  }}
                >
                  {t.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Add leave type</h2>
                <p>Create a new category.</p>
              </div>
            </div>
            <form onSubmit={createType} className="form-panel">
              <label>
                Name
                <input
                  required
                  value={newType.name}
                  onChange={(e) =>
                    setNewType({ ...newType, name: e.target.value })
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  rows="3"
                  value={newType.description}
                  onChange={(e) =>
                    setNewType({ ...newType, description: e.target.value })
                  }
                />
              </label>
              <label>
                Total days
                <input
                  type="number"
                  min="0"
                  required
                  value={newType.total_days}
                  onChange={(e) =>
                    setNewType({ ...newType, total_days: e.target.value })
                  }
                />
              </label>
              <button className="primary-btn" disabled={busy === "type"}>
                {busy === "type" ? "Saving…" : "Create leave type"}
              </button>
            </form>
          </section>
        </div>
      )}
      {tab === "roles" && (
        <section className="panel table-panel">
          <div className="panel-head">
            <div>
              <h2>Roles</h2>
              <p>Roles currently configured in the API.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>
                      <strong>{r.name}</strong>
                    </td>
                    <td>{r.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
