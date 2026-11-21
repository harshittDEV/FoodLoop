import Badge from './Badge';
import { CLAIM_STATUS_LABELS } from '../../utils/constants';

const statusVariants = {
  available: 'green',
  pending: 'warning',
  claimed: 'info',
  reserved: 'warning',
  accepted: 'green',
  rejected: 'gray',
  picked_up: 'terracotta',
  expired: 'gray',
  cancelled: 'gray',
};

export default function StatusBadge({ status }) {
  return (
    <Badge variant={statusVariants[status] || 'gray'}>
      {CLAIM_STATUS_LABELS[status] || status}
    </Badge>
  );
}
