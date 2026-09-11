import type { Role } from '@/core/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  flatNumber: string;
  createdAt: string;
}
