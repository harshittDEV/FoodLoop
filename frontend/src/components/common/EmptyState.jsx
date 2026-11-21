export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      {Icon && (
        <div className="mx-auto w-16 h-16 rounded-full bg-green-pale flex items-center justify-center mb-4">
          <Icon size={28} className="text-green-primary" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-green-deep mb-2">{title}</h3>
      {description && <p className="text-warm-gray max-w-sm mx-auto mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
