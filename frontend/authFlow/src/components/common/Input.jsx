import React from 'react';
export default function Input({ label, error, ...props }) {
  return <label className="field">
    <span>{label}</span>
    <input {...props} aria-invalid={error ? 'true' : 'false'} aria-describedby={error ? `${label.replace(/\s+/g, '-').toLowerCase()}-error` : undefined} />
    {error && <small id={`${label.replace(/\s+/g, '-').toLowerCase()}-error`} className="error">{error}</small>}
  </label>;
}
