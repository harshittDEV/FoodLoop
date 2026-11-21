import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Mail, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../utils/constants';
import { validateEmail, validatePassword, classNames } from '../utils/helpers';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, isLoading, resendVerification } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // '' | 'sending' | 'sent' | 'error'
  const [resendMessage, setResendMessage] = useState('');

  const passwordValidation = validatePassword(form.password);

  const selectRole = (role) => {
    setForm(f => ({ ...f, role }));
    setErrors(e => ({ ...e, role: '' }));
  };

  const goToDetails = () => {
    if (!form.role) {
      setErrors(e => ({ ...e, role: 'Please select a role to continue' }));
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(form.email)) newErrors.email = 'Enter a valid email address';
    if (!passwordValidation.valid) newErrors.password = 'Password does not meet requirements';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await signUp(form);
    if (result.success) {
      setStep(3);
    } else {
      setSubmitError(result.error);
    }
  };

  const handleResend = async () => {
    setResendStatus('sending');
    setResendMessage('');
    const result = await resendVerification(form.email);
    if (result.success) {
      setResendStatus('sent');
      setResendMessage('Verification email resent. Check your inbox.');
    } else {
      setResendStatus('error');
      setResendMessage(result.error || 'Could not resend. Please try again later.');
    }
  };

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={classNames(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step >= s ? 'bg-green-primary text-cream' : 'bg-green-pale text-warm-gray'
              )}>
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && <div className={classNames('w-12 h-0.5', step > s ? 'bg-green-primary' : 'bg-green-pale')} />}
            </div>
          ))}
        </div>

        <div className="card">
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-green-deep mb-2">Join FoodLoop</h1>
              <p className="text-warm-gray mb-6">How would you like to use FoodLoop?</p>
              <div className="space-y-3 mb-6">
                {Object.values(ROLES).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => selectRole(role)}
                    className={classNames(
                      'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                      form.role === role
                        ? 'border-green-primary bg-green-pale/30'
                        : 'border-green-pale hover:border-green-muted'
                    )}
                    aria-pressed={form.role === role}
                  >
                    <p className="font-semibold text-green-deep">{ROLE_LABELS[role]}</p>
                    <p className="text-sm text-warm-gray mt-0.5">{ROLE_DESCRIPTIONS[role]}</p>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-sm text-danger mb-4" role="alert">⚠ {errors.role}</p>
              )}
              <Button onClick={goToDetails} className="w-full flex items-center justify-center gap-2">
                Continue <ArrowRight size={16} />
              </Button>
              <p className="text-sm text-warm-gray text-center mt-6">
                Already have an account? <Link to="/signin" className="text-green-primary font-semibold hover:text-green-deep">Sign in</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-bold text-green-deep mb-2">Create your account</h1>
              <p className="text-warm-gray mb-6">
                Signing up as <span className="font-semibold text-green-primary">{ROLE_LABELS[form.role]}</span>
                <button type="button" onClick={() => setStep(1)} className="text-terracotta ml-2 text-sm hover:underline">Change</button>
              </p>
              <div className="space-y-4">
                <Input label="Full name" value={form.name} onChange={e => updateField('name', e.target.value)} error={errors.name} placeholder="Your name or organization name" autoComplete="name" />
                <Input label="Email address" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} error={errors.email} placeholder="you@example.com" autoComplete="email" />
                <Input label="Password" type="password" value={form.password} onChange={e => updateField('password', e.target.value)} error={errors.password} />
                {form.password && (
                  <div className="space-y-1 text-sm">
                    {Object.entries(passwordValidation.checks).map(([key, ok]) => (
                      <p key={key} className={ok ? 'text-green-primary' : 'text-warm-gray'}>
                        {ok ? '✓' : '○'} {key === 'length' ? 'At least 8 characters' : key === 'uppercase' ? 'One uppercase letter' : key === 'lowercase' ? 'One lowercase letter' : 'One number'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {submitError && (
                <div className="mt-4 p-3 rounded-xl bg-danger/10 text-danger text-sm" role="alert">{submitError}</div>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" type="button" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">Create Account</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-pale flex items-center justify-center mb-4">
                <Mail size={28} className="text-green-primary" />
              </div>
              <h1 className="text-2xl font-bold text-green-deep mb-2">Check your email</h1>
              <p className="text-warm-gray mb-2">
                We've sent a verification link to <strong>{form.email}</strong>
              </p>
              <p className="text-sm text-warm-gray mb-6">
                Click the link in the email to verify your account, then sign in.
              </p>
              <Link to="/signin">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
              <p className="text-sm text-warm-gray mt-4">
                Didn't receive it?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="text-green-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {resendStatus === 'sending' ? 'Sending…' : 'Resend email'}
                </button>
              </p>
              {resendMessage && (
                <p className={`text-sm mt-2 ${resendStatus === 'error' ? 'text-danger' : 'text-green-primary'}`}>
                  {resendMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
