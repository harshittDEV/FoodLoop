import { classNames } from '../../utils/helpers';

const variants = {
  green: 'badge-green',
  terracotta: 'badge-terracotta',
  gray: 'badge-gray',
  info: 'badge bg-info/10 text-info',
  danger: 'badge bg-danger/10 text-danger',
  warning: 'badge bg-warning/20 text-yellow-800',
};

export default function Badge({ children, variant = 'green', className = '' }) {
  return (
    <span className={classNames(variants[variant], className)}>
      {children}
    </span>
  );
}
