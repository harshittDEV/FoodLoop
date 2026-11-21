import { classNames } from '../../utils/helpers';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'text-green-primary hover:text-green-deep hover:bg-green-pale/50 px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-muted focus:ring-offset-2',
  danger: 'bg-danger text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: '',
  lg: 'text-lg px-8 py-4',
};

export default function Button({
  children, variant = 'primary', size = 'md', className = '',
  isLoading = false, disabled = false, ...props
}) {
  return (
    <button
      className={classNames(variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </span>
      ) : children}
    </button>
  );
}
