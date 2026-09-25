import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import AuthCard from './AuthCard';
import FormFooter from './FormFooter';
import { authService } from '../../services/authService';
import { validateRegister } from '../../utils/validation';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', terms: false });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (e) => {
    const value = key === 'terms' ? e.target.checked : e.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    setError('');
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      const { terms, ...payload } = form;
      await authService.register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account.');
    } finally { setLoading(false); }
  };

  return <AuthCard>
    <form onSubmit={submit} noValidate>
      {error && <div className="alert">{error}</div>}
      <Input label="Full name" type="text" placeholder="Your name" value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" />
      <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
      <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password} onChange={update('password')} error={errors.password} autoComplete="new-password" />
      <Input label="Confirm password" type="password" placeholder="Re-enter your password" value={form.password_confirmation} onChange={update('password_confirmation')} error={errors.password_confirmation} autoComplete="new-password" />
      <label className="checkbox-row"><input type="checkbox" checked={form.terms} onChange={update('terms')} /> <span>I agree to the Terms and Privacy Policy.</span></label>
      {errors.terms && <small className="error checkbox-error">{errors.terms}</small>}
      <Button type="submit" loading={loading}>Create account</Button>
    </form>
    <FormFooter text="Already have an account?" linkText="Sign in" to="/login" />
  </AuthCard>;
}
