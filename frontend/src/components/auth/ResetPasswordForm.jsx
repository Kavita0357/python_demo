import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import AuthCard from "./AuthCard";
import { authService } from "../../services/authService";
import { validateResetPassword } from "../../utils/validation";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [form, setForm] = useState({
    token,
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key) => (e) => {
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: "",
    }));

    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validateResetPassword(form);

    setErrors(validationErrors);
    setError("");

    if (Object.keys(validationErrors).length) {
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        token: form.token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setDone(true);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {done ? (
        <div className="success-box">
          <div className="success-icon">✓</div>

          <h3>Password updated</h3>

          <p>
            Your password has been changed successfully.
            Redirecting you to sign in...
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {error && <div className="alert">{error}</div>}

          {!token && (
            <div className="alert">
              Invalid or missing password reset token.
            </div>
          )}

          <Input
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your password"
            value={form.password_confirmation}
            onChange={update("password_confirmation")}
            error={errors.password_confirmation}
            autoComplete="new-password"
          />

          <input
            type="hidden"
            value={form.token}
            readOnly
          />

          {errors.token && (
            <small className="error token-error">
              {errors.token}
            </small>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={!token}
          >
            Update password
          </Button>
        </form>
      )}

      {!done && (
        <p className="auth-footer">
          <Link to="/login">Back to sign in</Link>
        </p>
      )}
    </AuthCard>
  );
}