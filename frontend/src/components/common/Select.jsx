import { classNames } from '../../utils/helpers';

export default function Select({ label, options, error, className = '', id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={classNames('space-y-1.5', className)}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-green-deep">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={classNames(
          'input-field appearance-none cursor-pointer',
          error && 'border-danger focus:border-danger focus:ring-danger/30'
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-danger" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
