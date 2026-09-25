import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import AuthCard from "./AuthCard";
import FormFooter from "./FormFooter";
import { authService } from "../../services/authService";
import { validateForgotPassword } from "../../utils/validation";

export default function ForgotPasswordForm() {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    setForm({ email: e.target.value });
    setErrors({});
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForgotPassword(form);
    setErrors(validationErrors);
    setError("");
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      await authService.forgotPassword(form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send the reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {sent ? (
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h3>Check your inbox</h3>
          <p>
            If an account exists for <strong>{form.email}</strong>, you’ll
            receive a password reset link shortly.
          </p>
          <Link className="button button-link" to="/login">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {error && <div className="alert">{error}</div>}
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update}
            error={errors.email}
            autoComplete="email"
          />
          <Button type="submit" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}
      {!sent && (
        <FormFooter
          text="Remember your password?"
          linkText="Sign in"
          to="/login"
        />
      )}
    </AuthCard>
  );
}
