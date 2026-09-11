import { ComplaintCategory, ComplaintPriority, ComplaintStatus, VisitorStatus } from '@/core/constants';
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

const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: 'Open',
  [ComplaintStatus.IN_PROGRESS]: 'In Progress',
  [ComplaintStatus.RESOLVED]: 'Resolved',
};

export function getComplaintStatusLabel(status: ComplaintStatus): string {
  return COMPLAINT_STATUS_LABELS[status] ?? status;
}

/** Returns the next status in the OPEN -> IN_PROGRESS -> RESOLVED flow, or null once resolved. */
export function getNextComplaintStatus(status: ComplaintStatus): ComplaintStatus | null {
  switch (status) {
    case ComplaintStatus.OPEN:
      return ComplaintStatus.IN_PROGRESS;
    case ComplaintStatus.IN_PROGRESS:
      return ComplaintStatus.RESOLVED;
    default:
      return null;
  }
}

const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  [ComplaintCategory.MAINTENANCE]: 'Maintenance',
  [ComplaintCategory.SECURITY]: 'Security',
  [ComplaintCategory.NOISE]: 'Noise',
  [ComplaintCategory.PARKING]: 'Parking',
  [ComplaintCategory.CLEANLINESS]: 'Cleanliness',
  [ComplaintCategory.OTHER]: 'Other',
};

export function getComplaintCategoryLabel(category: ComplaintCategory): string {
  return COMPLAINT_CATEGORY_LABELS[category] ?? category;
}

const COMPLAINT_PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  [ComplaintPriority.LOW]: 'Low',
  [ComplaintPriority.MEDIUM]: 'Medium',
  [ComplaintPriority.HIGH]: 'High',
};

export function getComplaintPriorityLabel(priority: ComplaintPriority): string {
  return COMPLAINT_PRIORITY_LABELS[priority] ?? priority;
}

export function getComplaintPriorityTone(priority: ComplaintPriority): StatusTone {
  switch (priority) {
    case ComplaintPriority.HIGH:
      return 'danger';
    case ComplaintPriority.MEDIUM:
      return 'warning';
    case ComplaintPriority.LOW:
      return 'neutral';
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
