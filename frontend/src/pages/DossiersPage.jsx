import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dossierService } from "../services/dossierService";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  description: "",
};

const statusClass = (status) => {
  switch (status) {
    case "DRAFT":
      return "dossier-status dossier-status-draft";

    case "IN_PROGRESS":
      return "dossier-status dossier-status-in-progress";

    case "COMPLETED":
      return "dossier-status dossier-status-completed";

    default:
      return "dossier-status";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    default:
      return status || "Unknown";
  }
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString();
};

export default function DossiersPage() {
  const { user } = useAuth();
  const roleName = typeof user?.role === "string"
    ? user.role
    : user?.role?.name || user?.role_name || "";
  const canCreate = ["admin", "editor"].includes(String(roleName).trim().toLowerCase());
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dossierService.list();

      const data = response?.data ?? response;

      const items = Array.isArray(data)
        ? data
        : data?.items || data?.data || [];

      setDossiers(items);
    } catch (err) {
      console.error("Failed to load dossiers:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load dossiers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDossiers();
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Dossier name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await dossierService.create({
        name: form.name.trim(),
        description: form.description.trim(),
      });

      setForm(initialForm);
      setShowForm(false);

      await loadDossiers();
    } catch (err) {
      console.error("Failed to create dossier:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to create dossier."
      );
    } finally {
      setSaving(false);
    }
  };

  const openCreateModal = () => {
    setError("");
    setForm(initialForm);
    setShowForm(true);
  };

  const closeCreateModal = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="page dossiers-page">
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="page-title dossiers-header">
        <div>
          <p className="eyebrow">
            Regulatory Dossier Management
          </p>

          <h1>Dossiers</h1>

          <p className="dossiers-subtitle">
            Create and manage structured regulatory dossiers.
          </p>
        </div>

        {canCreate && <button
          type="button"
          className="primary-btn"
          onClick={openCreateModal}
        >
          + Create dossier
        </button>}
      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && !showForm && (
        <div className="alert">
          {error}
        </div>
      )}

      {/* =========================================
          CREATE DOSSIER MODAL
      ========================================= */}

      {showForm && canCreate && (
        <div
          className="dossier-modal-overlay"
          onMouseDown={closeCreateModal}
        >
          <div
            className="dossier-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div className="dossier-modal-header">
              <div>
                <p className="dossier-modal-eyebrow">
                  CREATE DOSSIER
                </p>

                <h2>Create dossier</h2>

                <p>
                  Start a new structured CTD dossier.
                </p>
              </div>

              <button
                type="button"
                className="dossier-modal-close"
                onClick={closeCreateModal}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <form
              className="dossier-modal-form"
              onSubmit={submit}
            >
              <label className="form-field">
                <span>Dossier name</span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Paracetamol 500mg Dossier"
                  maxLength={255}
                  disabled={saving}
                  autoFocus
                />
              </label>

              <label className="form-field">
                <span>Description</span>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Regulatory dossier description"
                  maxLength={2000}
                  rows={5}
                  disabled={saving}
                />
              </label>

              {error && (
                <div className="alert dossier-modal-alert">
                  {error}
                </div>
              )}

              {/* Modal Actions */}

              <div className="dossier-modal-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={closeCreateModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create dossier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (
        <div className="panel empty-state">
          <div className="dossier-loading">
            Loading dossiers...
          </div>
        </div>
      ) : dossiers.length === 0 ? (
        /* =========================================
            EMPTY STATE
        ========================================= */

        <div className="panel empty-state">
          <strong>No dossiers yet</strong>

          <span>
            Create your first regulatory dossier to get started.
          </span>
        </div>
      ) : (
        /* =========================================
            DOSSIER CARDS
        ========================================= */

        <div className="dossier-grid">
          {dossiers.map((dossier) => (
            <Link
              className="dossier-card"
              to={`/dossiers/${dossier.id}`}
              key={dossier.id}
            >
              {/* Card Top */}

              <div className="dossier-card-top">
                <div className="dossier-icon">
                  📄
                </div>

                <span
                  className={statusClass(dossier.status)}
                >
                  {getStatusLabel(dossier.status)}
                </span>
              </div>

              {/* Card Content */}

              <div className="dossier-card-content">
                <span className="dossier-number">
                  Dossier #{dossier.id}
                </span>

                <h2>
                  {dossier.name || "Untitled dossier"}
                </h2>

                <p>
                  {dossier.description ||
                    "No description provided."}
                </p>
              </div>

              {/* Card Footer */}

              <div className="dossier-card-footer">
                <span>
                  Created {formatDate(dossier.created_at)}
                </span>

                <strong>
                  Open dossier
                  <span>→</span>
                </strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
