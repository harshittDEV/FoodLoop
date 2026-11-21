import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function Input({
  label, type = 'text', error, hint, className = '', id, ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';

  return (
    <div className={classNames('space-y-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-green-deep">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={classNames(
            'input-field',
            isPassword && 'pr-12',
            error && 'border-danger focus:border-danger focus:ring-danger/30'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-green-primary transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger flex items-center gap-1" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-warm-gray">{hint}</p>
      )}
    </div>
  );
}
