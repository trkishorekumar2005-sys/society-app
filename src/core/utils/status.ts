import { ComplaintStatus, VisitorStatus } from '@/core/constants';
import type { StatusTone } from '@/components/StatusChip';

/** Maps a complaint status to the StatusChip tone used to render it. */
export function getComplaintStatusTone(status: ComplaintStatus): StatusTone {
  switch (status) {
    case ComplaintStatus.OPEN:
      return 'warning';
    case ComplaintStatus.IN_PROGRESS:
      return 'info';
    case ComplaintStatus.RESOLVED:
      return 'success';
    default:
      return 'neutral';
  }
}

/** Maps a visitor status to the StatusChip tone used to render it. */
export function getVisitorStatusTone(status: VisitorStatus): StatusTone {
  switch (status) {
    case VisitorStatus.PENDING:
      return 'warning';
    case VisitorStatus.CHECKED_IN:
      return 'info';
    case VisitorStatus.CHECKED_OUT:
      return 'success';
    case VisitorStatus.EXPIRED:
      return 'danger';
    default:
      return 'neutral';
  }
}
