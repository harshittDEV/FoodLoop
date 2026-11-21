import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';
import { ROLE_LABELS } from '../utils/constants';
import { mockUsers } from '../data/mockData';

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors = {};
    if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await signIn(form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setSubmitError(result.error);
    }
  };

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-2xl font-bold text-green-deep mb-2">Welcome back</h1>
          <p className="text-warm-gray mb-6">Sign in to your FoodLoop account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} error={errors.email} placeholder="you@example.com" autoComplete="email" />
            <Input label="Password" type="password" value={form.password} onChange={e => updateField('password', e.target.value)} error={errors.password} autoComplete="current-password" />
            {submitError && (
              <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm" role="alert">{submitError}</div>
            )}
            <Button type="submit" isLoading={isLoading} className="w-full">Sign In</Button>
          </form>
          <p className="text-sm text-warm-gray text-center mt-6">
            Don't have an account? <Link to="/signup" className="text-green-primary font-semibold hover:text-green-deep">Sign up</Link>
          </p>
        </div>

        <div className="mt-6 card !bg-green-pale/30 !border-green-muted/30">
          <p className="text-sm font-semibold text-green-deep mb-3">Quick fill</p>
          <p className="text-xs text-warm-gray mb-3">Click to pre-fill an email (requires account to be registered first):</p>
          <div className="space-y-2">
            {mockUsers.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => { setForm({ email: u.email, password: 'demo1234' }); }}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/60 hover:bg-white text-sm transition-colors"
              >
                <span className="font-medium text-green-deep">{u.name}</span>
                <span className="text-warm-gray ml-2">· {ROLE_LABELS[u.role]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
