import type { VisitorStatus } from '@/core/constants';

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  visitDate: string;
  passCode: string;
  status: VisitorStatus;
  residentId: string;
  residentName: string;
  flatNumber: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}
