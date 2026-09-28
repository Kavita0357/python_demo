import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dossierService } from "../services/dossierService";

const statusLabels = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);

    try {
      const data = await dossierService.list();

      // Supports both:
      // [] response
      // { items: [] } response
      // { data: [] } response
      const items = Array.isArray(data)
        ? data
        : data?.items || data?.data || [];

      setDossiers(items);
    } catch (error) {
      console.error("Failed to load dossiers:", error);
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refresh();
    }
  }, [user?.id]);

  const stats = useMemo(
    () => ({
      total: dossiers.length,
      draft: dossiers.filter((x) => x.status === "DRAFT").length,
      inProgress: dossiers.filter((x) => x.status === "IN_PROGRESS").length,
      completed: dossiers.filter((x) => x.status === "COMPLETED").length,
    }),
    [dossiers],
  );

  if (loading) {
    return <div className="page-loader">Loading dashboard…</div>;
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-title">
        <div>
          <p className="eyebrow">Overview</p>

          <h1>
            Good to see you, {user?.first_name || user?.email?.split("@")[0]}.
          </h1>

          <p>
            Manage your regulatory dossiers and CTD submissions from one place.
          </p>
        </div>

        <Link className="primary-btn" to="/dossiers">
          + Create dossier
        </Link>
      </div>

      {/* Dossier Stats */}
      <div className="stats-grid">
        <Stat
          label="Total dossiers"
          value={stats.total}
          meta="All regulatory dossiers"
        />

        <Stat
          label="Draft"
          value={stats.draft}
          meta="Dossiers being prepared"
        />

        <Stat
          label="In Progress"
          value={stats.inProgress}
          meta="Currently being worked on"
        />

        <Stat
          label="Completed"
          value={stats.completed}
          meta="Completed dossiers"
        />
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-grid">
        {/* Status Overview */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Dossier status</h2>
              <p>Current status of your regulatory dossiers.</p>
            </div>

            <Link to="/dossiers">View all</Link>
          </div>

          {dossiers.length ? (
            <div className="dossier-status-list">
              <StatusRow
                label="Draft"
                value={stats.draft}
                total={stats.total}
              />

              <StatusRow
                label="In Progress"
                value={stats.inProgress}
                total={stats.total}
              />

              <StatusRow
                label="Completed"
                value={stats.completed}
                total={stats.total}
              />
            </div>
          ) : (
            <Empty text="No dossiers have been created yet." />
          )}
        </section>

        {/* Recent Dossiers */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent dossiers</h2>
              <p>Your latest regulatory dossiers.</p>
            </div>

            <Link to="/dossiers">View all</Link>
          </div>

          {dossiers.length ? (
            dossiers.slice(0, 5).map((dossier) => (
              <Link
                to={`/dossiers/${dossier.id}`}
                className="activity-row dossier-row"
                key={dossier.id}
              >
                <div>
                  <strong>
                    {dossier.name || dossier.title || `Dossier #${dossier.id}`}
                  </strong>

                  <span>{dossier.description || "Regulatory dossier"}</span>
                </div>

                <NewBadge status={dossier.status} />
              </Link>
            ))
          ) : (
            <Empty text="No dossiers have been created yet." />
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, meta }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{meta}</small>
    </div>
  );
}

function StatusRow({ label, value, total }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="balance-row">
      <div className="row-between">
        <strong>{label}</strong>
        <span>
          {value} dossier{value !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="progress">
        <i style={{ width: `${percentage}%` }} />
      </div>

      <small>{percentage}% of total dossiers</small>
    </div>
  );
}

function NewBadge({ status }) {
  return (
    <span className={`badge badge-${status?.toLowerCase()}`}>
      {statusLabels[status] || status || "Unknown"}
    </span>
  );
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}

/* import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  leaveService,
  leaveTypeService,
  leaveBalanceService,
} from "../services/leaveService";

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [types, setTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [myLeaves, leaveTypes, userBalances] = await Promise.all([
        leaveService.my(),
        leaveTypeService.list(),
        leaveBalanceService.byUser(user.id),
      ]);
      setLeaves(myLeaves);
      setTypes(leaveTypes);
      setBalances(userBalances);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) refresh();
  }, [user?.id]);

  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((x) => x.status === "pending").length,
      approved: leaves.filter((x) => x.status === "approved").length,
      remaining: balances.reduce((sum, x) => sum + (x.remaining_days || 0), 0),
    }),
    [leaves, balances],
  );

  if (loading) return <div className="page-loader">Loading dashboard…</div>;

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>
            Good to see you, {user?.first_name || user?.email?.split("@")[0]}.
          </h1>
          <p>Manage leave requests, balances and approvals from one place.</p>
        </div>
        <Link className="primary-btn" to="/leaves/new">
          + Apply for leave
        </Link>
      </div>

      <div className="stats-grid">
        <Stat
          label="My requests"
          value={stats.total}
          meta="All leave applications"
        />
        <Stat label="Pending" value={stats.pending} meta="Waiting for action" />
        <Stat
          label="Approved"
          value={stats.approved}
          meta="Approved requests"
        />
        <Stat
          label="Available days"
          value={stats.remaining}
          meta={`${types.length} leave types configured`}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Leave balance</h2>
              <p>Your current allocation by leave type.</p>
            </div>
            <Link to="/balances">View all</Link>
          </div>
          {balances.length ? (
            balances.map((b) => {
              const type = types.find((t) => t.id === b.leave_type_id);
              const percent = b.allocated_days
                ? Math.min(
                    100,
                    Math.round((b.used_days / b.allocated_days) * 100),
                  )
                : 0;
              return (
                <div className="balance-row" key={b.id}>
                  <div className="row-between">
                    <strong>{type?.name || `Leave #${b.leave_type_id}`}</strong>
                    <span>{b.remaining_days} days left</span>
                  </div>
                  <div className="progress">
                    <i style={{ width: `${percent}%` }} />
                  </div>
                  <small>
                    {b.used_days} used of {b.allocated_days}
                  </small>
                </div>
              );
            })
          ) : (
            <Empty text="No leave balances are configured for your account." />
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent requests</h2>
              <p>Your latest leave applications.</p>
            </div>
            <Link to="/leaves">View all</Link>
          </div>
          {leaves.slice(0, 5).map((leave) => (
            <div className="activity-row" key={leave.id}>
              <div>
                <strong>
                  {types.find((t) => t.id === leave.leave_type_id)?.name ||
                    "Leave"}
                </strong>
                <span>
                  {formatDate(leave.start_date)} – {formatDate(leave.end_date)}{" "}
                  · {leave.total_days} day{leave.total_days !== 1 ? "s" : ""}
                </span>
              </div>
              <Badge status={leave.status} />
            </div>
          ))}
          {!leaves.length && (
            <Empty text="You have not created a leave request yet." />
          )}
        </section>
      </div>
    </div>
  );
}
function Stat({ label, value, meta }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{meta}</small>
    </div>
  );
}
   */
export function Badge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabels[status] || status}
    </span>
  );
}
export function formatDate(value) {
  return value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}
/* function Empty({ text }) {
  return <div className="empty">{text}</div>;
} */