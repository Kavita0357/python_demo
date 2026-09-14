import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import AuthCard from './AuthCard';
import FormFooter from './FormFooter';
import { useAuth } from '../../context/AuthContext';
import { validateLogin } from '../../utils/validation';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const update = (key) => (e) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    setError('');
    if (Object.keys(validationErrors).length) return;
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please check your credentials.');
    }
  };

  return <AuthCard>
    <form onSubmit={submit} noValidate>
      {error && <div className="alert">{error}</div>}
      <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
      <div className="field-group">
        <Input label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={update('password')} error={errors.password} autoComplete="current-password" />
        <Link className="field-link" to="/forgot-password">Forgot password?</Link>
      </div>
      <Button type="submit" loading={loading}>Sign in</Button>
    </form>
    <FormFooter text="Don’t have an account?" linkText="Create one" to="/register" />
  </AuthCard>;
}
