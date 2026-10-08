import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dossierService } from "../services/dossierService";
import { useAuth } from "../context/AuthContext";

const statusClass = (status) =>
  `status-pill status-${String(status || "")
    .toLowerCase()
    .replace("_", "-")}`;

const getStatusLabel = (status) => {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "NOT_STARTED":
      return "Not Started";

    default:
      return status || "Unknown";
  }
};

const getModuleStatusLabel = (status) => {
  switch (status) {
    case "NOT_STARTED":
      return "Not Started";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    default:
      return status || "Unknown";
  }
};

export default function DossierDetailsPage() {
  const { id } = useParams();
  const dossierId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = (user?.role?.name || user?.role_name || "viewer").toLowerCase();
  const canEdit = role === "admin" || role === "editor";
  const isAdmin = role === "admin";

  const [dossier, setDossier] = useState(null);
  const [modules, setModules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingModule, setSavingModule] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showDossierForm, setShowDossierForm] = useState(false);
  const [savingDossier, setSavingDossier] = useState(false);
  const [deletingDossier, setDeletingDossier] = useState(false);
  const [dossierForm, setDossierForm] = useState({ name: "", description: "" });
  const [editingModule, setEditingModule] = useState(null);

  const [moduleForm, setModuleForm] = useState({
    module_number: "",
    module_name: "",
    description: "",
  });

  const completedCount = useMemo(
    () => modules.filter((module) => module.status === "COMPLETED").length,
    [modules],
  );

  const inProgressCount = useMemo(
    () => modules.filter((module) => module.status === "IN_PROGRESS").length,
    [modules],
  );

  const notStartedCount = useMemo(
    () => modules.filter((module) => module.status === "NOT_STARTED").length,
    [modules],
  );

  const progress = useMemo(() => {
    if (!modules.length) {
      return 0;
    }

    return Math.round((completedCount / modules.length) * 100);
  }, [modules, completedCount]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const [dossierData, modulesData] = await Promise.all([
        dossierService.get(dossierId),
        dossierService.listModules(dossierId),
      ]);

      setDossier(dossierData);
      setModules(modulesData || []);
    } catch (err) {
      console.error("Unable to load dossier:", err);

      setError(err?.response?.data?.detail || "Unable to load dossier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isFinite(dossierId)) {
      load();
    }
  }, [dossierId]);

  const resetModuleForm = () => {
    setModuleForm({
      module_number: "",
      module_name: "",
      description: "",
    });

    setEditingModule(null);
    setShowModuleForm(false);
  };

  const openEdit = (module) => {
    setEditingModule(module);

    setModuleForm({
      module_number: module.module_number || "",
      module_name: module.module_name || "",
      description: module.description || "",
    });

    setShowModuleForm(true);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const saveModule = async (event) => {
    event.preventDefault();

    if (!moduleForm.module_number.trim() || !moduleForm.module_name.trim()) {
      setError("Module number and module name are required.");
      return;
    }

    try {
      setSavingModule(true);
      setError("");

      const payload = {
        module_number: moduleForm.module_number.trim(),
        module_name: moduleForm.module_name.trim(),
        description: moduleForm.description.trim() || null,
      };

      if (editingModule) {
        await dossierService.updateModule(dossierId, editingModule.id, payload);
      } else {
        await dossierService.createModule(dossierId, payload);
      }

      resetModuleForm();

      await load();
    } catch (err) {
      console.error("Unable to save module:", err);

      const detail = err?.response?.data?.detail;

      setError(typeof detail === "string" ? detail : "Unable to save module.");
    } finally {
      setSavingModule(false);
    }
  };

  const changeDossierStatus = async (status) => {
    try {
      setUpdatingStatus(true);
      setError("");

      const updated = await dossierService.updateStatus(dossierId, status);

      setDossier(updated);
    } catch (err) {
      console.error("Unable to update dossier status:", err);

      setError(
        err?.response?.data?.detail || "Unable to update dossier status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const changeModuleStatus = async (module, status) => {
    try {
      setError("");

      await dossierService.updateModuleStatus(dossierId, module.id, status);

      await load();
    } catch (err) {
      console.error("Unable to update module status:", err);

      setError(
        err?.response?.data?.detail || "Unable to update module status.",
      );
    }
  };

  const saveDossier = async (event) => {
    event.preventDefault();
    try {
      setSavingDossier(true);
      setError("");
      const updated = await dossierService.update(dossierId, {
        name: dossierForm.name.trim(),
        description: dossierForm.description.trim() || null,
      });
      setDossier(updated);
      setShowDossierForm(false);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to update dossier.");
    } finally {
      setSavingDossier(false);
    }
  };

  const deleteDossier = async () => {
    if (!window.confirm(`Delete “${dossier.name}” and all its CTD modules? This cannot be undone.`)) return;
    try {
      setDeletingDossier(true);
      setError("");
      await dossierService.delete(dossierId);
      navigate("/dossiers");
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to delete dossier.");
      setDeletingDossier(false);
    }
  };

  if (loading) {
    return (
      <div className="page dossier-details-page">
        <div className="dossier-loading-page">
          <div className="dossier-loading-icon">📄</div>
          <strong>Loading dossier...</strong>
          <span>Preparing your regulatory dossier workspace.</span>
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="page dossier-details-page">
        <div className="dossier-not-found">
          <div className="dossier-not-found-icon">!</div>

          <h2>Dossier not found</h2>

          <p>{error || "The requested dossier could not be found."}</p>

          <button className="ghost-btn" onClick={() => navigate("/dossiers")}>
            ← Back to dossiers
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page dossier-details-page">
        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <div className="dossier-breadcrumb">
          <Link to="/dossiers">Dossiers</Link>

          <span>›</span>

          <span>{dossier.name}</span>
        </div>

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="dossier-hero">
          <div className="dossier-hero-left">
            <div className="dossier-large-icon">📄</div>

            <div>
              <p className="eyebrow">STRUCTURED DOSSIER BUILDER</p>

              <h1>{dossier.name}</h1>

              <p className="dossier-hero-description">
                {dossier.description ||
                  "No description provided for this regulatory dossier."}
              </p>

              <div className="dossier-meta">
                <span>Dossier #{dossier.id}</span>

                {dossier.created_at && (
                  <>
                    <i />
                    <span>
                      Created{" "}
                      {new Date(dossier.created_at).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="dossier-hero-right">
            <span className={statusClass(dossier.status)}>
              {getStatusLabel(dossier.status)}
            </span>
            {canEdit && <button className="ghost-btn" onClick={() => {
              setDossierForm({ name: dossier.name || "", description: dossier.description || "" });
              setShowDossierForm(true);
            }}>Edit dossier</button>}
            {isAdmin && <button className="danger-btn" onClick={deleteDossier} disabled={deletingDossier}>
              {deletingDossier ? "Deleting…" : "Delete dossier"}
            </button>}
          </div>
        </div>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && <div className="alert dossier-alert">{error}</div>}

        {/* =========================================
            OVERVIEW CARDS
        ========================================= */}

        <div className="dossier-overview-grid">
          <div className="dossier-overview-card">
            <div className="overview-card-icon purple">✓</div>

            <div>
              <span>Overall progress</span>

              <strong>{progress}%</strong>

              <small>
                {completedCount} of {modules.length} modules completed
              </small>
            </div>
          </div>

          <div className="dossier-overview-card">
            <div className="overview-card-icon blue">◫</div>

            <div>
              <span>Total CTD modules</span>

              <strong>{modules.length}</strong>

              <small>Structured modules in this dossier</small>
            </div>
          </div>

          <div className="dossier-overview-card">
            <div className="overview-card-icon orange">◷</div>

            <div>
              <span>In progress</span>

              <strong>{inProgressCount}</strong>

              <small>Modules currently being worked on</small>
            </div>
          </div>

          <div className="dossier-overview-card">
            <div className="overview-card-icon green">✓</div>

            <div>
              <span>Completed</span>

              <strong>{completedCount}</strong>

              <small>{notStartedCount} modules not started</small>
            </div>
          </div>
        </div>

        {/* =========================================
            MAIN GRID
        ========================================= */}

        <div className="dossier-workspace-grid">
          {/* LEFT */}
          <div className="dossier-workspace-main">
            {/* Progress */}

            <section className="dossier-panel">
              <div className="dossier-panel-header">
                <div>
                  <p className="dossier-section-label">DOSSIER PROGRESS</p>

                  <h2>CTD completion</h2>

                  <p>Track the completion of each CTD module.</p>
                </div>

                <strong className="progress-percentage">{progress}%</strong>
              </div>

              <div className="dossier-progress-bar">
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="progress-footer">
                <span>{completedCount} completed</span>

                <span>{modules.length - completedCount} remaining</span>
              </div>
            </section>

            {/* Modules */}

            <section className="dossier-panel modules-panel">
              <div className="dossier-panel-header">
                <div>
                  <p className="dossier-section-label">CTD STRUCTURE</p>

                  <h2>CTD modules</h2>

                  <p>
                    Build and manage the technical document structure for this
                    dossier.
                  </p>
                </div>

                {canEdit && <button
                  className="primary-btn"
                  onClick={() => {
                    setEditingModule(null);

                    setModuleForm({
                      module_number: "",
                      module_name: "",
                      description: "",
                    });

                    setShowModuleForm(true);
                  }}
                >
                  + Add module
                </button>}
              </div>

              {/* Module List */}

              {modules.length === 0 ? (
                <div className="modules-empty">
                  <div className="modules-empty-icon">+</div>

                  <h3>No CTD modules yet</h3>

                  <p>
                    Add your first module to start building this regulatory
                    dossier.
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => setShowModuleForm(true)}
                  >
                    + Add first module
                  </button>
                </div>
              ) : (
                <div className="module-list">
                  {modules.map((module, index) => (
                    <article className="module-card" key={module.id}>
                      <div className="module-card-number">
                        <span>{index+1}</span>
                      </div>

                      <div className="module-card-body">
                        <div className="module-card-heading">
                          <div>
                            <span className="module-label">
                              MODULE {module.module_number}
                            </span>

                            <h3>{module.module_name}</h3>
                          </div>

                          <span className={statusClass(module.status)}>
                            {getModuleStatusLabel(module.status)}
                          </span>
                        </div>

                        <p>
                          {module.description || "No description provided."}
                        </p>

                        <div className="module-card-footer">
                          <div className="module-mini-progress">
                            <div>
                              <span>Module progress</span>

                              <strong>
                                {module.status === "COMPLETED"
                                  ? "100%"
                                  : module.status === "IN_PROGRESS"
                                    ? "50%"
                                    : "0%"}
                              </strong>
                            </div>

                            <div className="mini-progress">
                              <i
                                className={
                                  module.status === "COMPLETED"
                                    ? "complete"
                                    : module.status === "IN_PROGRESS"
                                      ? "active"
                                      : ""
                                }
                              />
                            </div>
                          </div>

                          <div className="module-actions">
                            {canEdit && <button
                              className="ghost-btn small-btn"
                              onClick={() => openEdit(module)}
                            >
                              Edit
                            </button>}

                            {canEdit && module.status === "NOT_STARTED" && (
                              <button
                                className="primary-btn small-btn"
                                onClick={() =>
                                  changeModuleStatus(module, "IN_PROGRESS")
                                }
                              >
                                Start module
                              </button>
                            )}

                            {canEdit && module.status === "IN_PROGRESS" && (
                              <button
                                className="primary-btn small-btn"
                                onClick={() =>
                                  changeModuleStatus(module, "COMPLETED")
                                }
                              >
                                Complete module
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT */}
          <aside className="dossier-workspace-sidebar">
            {/* Dossier status */}

            <section className="dossier-side-panel">
              <div className="dossier-side-header">
                <div className="side-icon">◉</div>

                <div>
                  <h3>Dossier status</h3>

                  <p>Lifecycle management</p>
                </div>
              </div>

              <div className="current-status-box">
                <span>Current status</span>

                <strong className={statusClass(dossier.status)}>
                  {getStatusLabel(dossier.status)}
                </strong>
              </div>

              {canEdit && <div className="status-actions">
                <button
                  className="ghost-btn"
                  disabled={updatingStatus || dossier.status !== "DRAFT"}
                  onClick={() => changeDossierStatus("IN_PROGRESS")}
                >
                  Start dossier
                </button>

                <button
                  className="primary-btn"
                  disabled={updatingStatus || dossier.status !== "IN_PROGRESS"}
                  onClick={() => changeDossierStatus("COMPLETED")}
                >
                  Complete dossier
                </button>
              </div>}

              <p className="status-helper">
                A dossier can only be completed after all CTD modules are
                completed.
              </p>
            </section>

            {/* Information */}

            <section className="dossier-side-panel">
              <div className="dossier-side-header">
                <div className="side-icon">i</div>

                <div>
                  <h3>Dossier information</h3>

                  <p>Basic dossier details</p>
                </div>
              </div>

              <div className="info-list">
                <div>
                  <span>Dossier ID</span>
                  <strong>#{dossier.id}</strong>
                </div>

                <div>
                  <span>Modules</span>
                  <strong>{modules.length}</strong>
                </div>

                <div>
                  <span>Completed</span>
                  <strong>{completedCount}</strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>
                    {dossier.created_at
                      ? new Date(dossier.created_at).toLocaleDateString()
                      : "—"}
                  </strong>
                </div>
              </div>
            </section>

            {/* CTD progress */}

            <section className="dossier-side-panel">
              <div className="dossier-side-header">
                <div className="side-icon">✓</div>

                <div>
                  <h3>Completion</h3>

                  <p>Overall CTD progress</p>
                </div>
              </div>

              <div className="side-progress">
                <div className="side-progress-circle">
                  <strong>{progress}%</strong>
                </div>

                <div>
                  <strong>
                    {completedCount} / {modules.length}
                  </strong>

                  <span>modules completed</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
      {showDossierForm && canEdit && (
        <div className="dossier-modal-overlay" onMouseDown={() => setShowDossierForm(false)}>
          <div className="dossier-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="dossier-modal-header">
              <div><p className="dossier-modal-eyebrow">DOSSIER DETAILS</p><h2>Edit dossier</h2></div>
              <button type="button" className="dossier-modal-close" onClick={() => setShowDossierForm(false)}>×</button>
            </div>
            <form className="dossier-modal-form" onSubmit={saveDossier}>
              <label className="form-field"><span>Dossier name</span><input value={dossierForm.name} maxLength={255} required onChange={(event) => setDossierForm({ ...dossierForm, name: event.target.value })} /></label>
              <label className="form-field"><span>Description</span><textarea value={dossierForm.description} maxLength={2000} rows={5} onChange={(event) => setDossierForm({ ...dossierForm, description: event.target.value })} /></label>
              <div className="dossier-modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowDossierForm(false)} disabled={savingDossier}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={savingDossier}>{savingDossier ? "Saving..." : "Save changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================================
    MODULE MODAL
========================================= */}

      {showModuleForm && canEdit && (
        <div
          className="module-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              resetModuleForm();
            }
          }}
        >
          <div className="module-modal">
            {/* Modal Header */}

            <div className="module-modal-header">
              <div className="module-modal-title">
                <div className="module-modal-icon">✎</div>

                <div>
                  <p>{editingModule ? "EDIT CTD MODULE" : "NEW CTD MODULE"}</p>

                  <h2>{editingModule ? "Edit module" : "Add CTD module"}</h2>
                </div>
              </div>

              <button
                type="button"
                className="module-modal-close"
                onClick={resetModuleForm}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}

            <form className="module-modal-form" onSubmit={saveModule}>
              <div className="module-modal-fields">
                <label className="form-field">
                  <span>Module number</span>

                  <input
                    value={moduleForm.module_number}
                    onChange={(event) =>
                      setModuleForm({
                        ...moduleForm,
                        module_number: event.target.value,
                      })
                    }
                    placeholder="3"
                    maxLength={20}
                    autoFocus
                  />
                </label>

                <label className="form-field">
                  <span>Module name</span>

                  <input
                    value={moduleForm.module_name}
                    onChange={(event) =>
                      setModuleForm({
                        ...moduleForm,
                        module_name: event.target.value,
                      })
                    }
                    placeholder="Quality"
                    maxLength={255}
                  />
                </label>
              </div>

              <label className="form-field">
                <span>Description</span>

                <textarea
                  value={moduleForm.description}
                  onChange={(event) =>
                    setModuleForm({
                      ...moduleForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Quality related information"
                  maxLength={2000}
                  rows={5}
                />
              </label>

              {/* Modal Footer */}

              <div className="module-modal-footer">
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={resetModuleForm}
                  disabled={savingModule}
                >
                  Cancel
                </button>

                <button
                  className="primary-btn"
                  type="submit"
                  disabled={savingModule}
                >
                  {savingModule
                    ? "Saving..."
                    : editingModule
                      ? "Update module"
                      : "Add module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
