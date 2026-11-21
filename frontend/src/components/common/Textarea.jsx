import { classNames } from '../../utils/helpers';

export default function Textarea({ label, error, hint, className = '', id, rows = 4, ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={classNames('space-y-1.5', className)}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-green-deep">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={classNames(
          'input-field resize-y',
          error && 'border-danger focus:border-danger focus:ring-danger/30'
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger" role="alert"><span aria-hidden="true">⚠</span> {error}</p>}
      {hint && !error && <p className="text-sm text-warm-gray">{hint}</p>}
    </div>
  );
}
