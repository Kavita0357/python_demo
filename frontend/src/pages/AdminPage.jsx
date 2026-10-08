import React, { useEffect, useState } from "react";
import { roleService } from "../services/leaveService";

export default function AdminPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const editingBuiltInRole = roles.some(
    (role) => role.id === editingRoleId && ["admin", "editor", "viewer"].includes(role.name.toLowerCase()),
  );

  const loadRoles = async () => {
    setLoading(true);
    setError("");
    try {
      setRoles((await roleService.list()) || []);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const saveRole = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
      };
      if (editingRoleId) {
        await roleService.update(editingRoleId, payload);
      } else {
        await roleService.create(payload);
      }
      setForm({ name: "", description: "" });
      setNotice(editingRoleId ? "Role updated." : "Role created.");
      setEditingRoleId(null);
      setShowRoleModal(false);
      await loadRoles();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to create role.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (role) => {
    if (!window.confirm(`Delete the role “${role.name}”?`)) return;
    setBusy(role.id);
    setError("");
    setNotice("");
    try {
      await roleService.delete(role.id);
      if (editingRoleId === role.id) {
        setEditingRoleId(null);
        setForm({ name: "", description: "" });
        setShowRoleModal(false);
      }
      setNotice("Role deleted.");
      await loadRoles();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to delete role.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Roles</h1>
          <p>View, create, and edit configured roles.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {notice && <div className="alert">{notice}</div>}

      <div className="dashboard">
        <section className="panel table-panel">
          <div className="panel-head">
            <div>
              <h2>Configured roles</h2>
                <p>{roles.length} role{roles.length === 1 ? "" : "s"}</p>
              </div>
              <button
                className="primary-btn"
                type="button"
                onClick={() => {
                  setEditingRoleId(null);
                  setForm({ name: "", description: "" });
                  setError("");
                  setNotice("");
                  setShowRoleModal(true);
                }}
              >
                + Create role
              </button>
          </div>
          {loading ? (
            <div className="empty">Loading roles…</div>
          ) : roles.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Description</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td><strong>{role.name}</strong></td>
                      <td>{role.description || "—"}</td>
                      <td>
                        <button
                          className="ghost-btn"
                          type="button"
                          onClick={() => {
                            setEditingRoleId(role.id);
                            setForm({ name: role.name, description: role.description || "" });
                            setNotice("");
                            setError("");
                            setShowRoleModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="danger-btn"
                          type="button"
                          disabled={busy === role.id || ["admin", "editor", "viewer"].includes(role.name.toLowerCase())}
                          onClick={() => deleteRole(role)}
                        >
                          {busy === role.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">No roles configured yet.</div>
          )}
        </section>

      </div>
      {showRoleModal && (
        <div className="module-modal-overlay" onMouseDown={() => !saving && setShowRoleModal(false)}>
          <div className="module-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="module-modal-header">
              <div className="module-modal-title">
                <div className="module-modal-icon">♙</div>
                <div>
                  <p>ROLE MANAGEMENT</p>
                  <h2>{editingRoleId ? "Edit role" : "Create role"}</h2>
                </div>
              </div>
              <button type="button" className="module-modal-close" onClick={() => setShowRoleModal(false)} disabled={saving} aria-label="Close">×</button>
            </div>
            <form className="module-modal-form" onSubmit={saveRole}>
              {error && <div className="alert">{error}</div>}
              <div className="module-modal-fields">
                <label className="form-field">
                  <span>Name</span>
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={editingBuiltInRole}
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Role name"
                  />
                  {editingBuiltInRole && <small>Built-in role names are fixed so permissions remain active.</small>}
                </label>
                <label className="form-field">
                  <span>Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="What this role can do"
                    rows={4}
                  />
                </label>
              </div>
              <div className="module-modal-footer">
                <button className="ghost-btn" type="button" onClick={() => setShowRoleModal(false)} disabled={saving}>Cancel</button>
                <button className="primary-btn" type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingRoleId ? "Save changes" : "Create role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
