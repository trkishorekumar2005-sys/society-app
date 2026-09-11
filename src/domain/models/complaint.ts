import type { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/core/constants';

export interface ComplaintStatusEvent {
  status: ComplaintStatus;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  raisedBy: string;
  raisedByName: string;
  flatNumber: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: ComplaintStatusEvent[];
}
