import { classNames } from '../../utils/helpers';

export default function TagSelector({ label, options, selected = [], onChange }) {
  const toggle = (tag) => {
    onChange(
      selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
    );
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-semibold text-green-deep">{label}</p>}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={classNames(
              'px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200',
              selected.includes(tag)
                ? 'bg-green-primary text-cream border-green-primary'
                : 'bg-white text-warm-gray border-green-pale hover:border-green-muted'
            )}
            aria-pressed={selected.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
