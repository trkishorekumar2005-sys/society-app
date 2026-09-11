/** App-wide enums and static reference data shared across features. */

export const Role = {
  RESIDENT: 'RESIDENT',
  ADMIN: 'ADMIN',
  SECURITY: 'SECURITY',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const ComplaintStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
} as const;
export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

export const ComplaintPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type ComplaintPriority = (typeof ComplaintPriority)[keyof typeof ComplaintPriority];

export const ComplaintCategory = {
  MAINTENANCE: 'MAINTENANCE',
  SECURITY: 'SECURITY',
  NOISE: 'NOISE',
  PARKING: 'PARKING',
  CLEANLINESS: 'CLEANLINESS',
  OTHER: 'OTHER',
} as const;
export type ComplaintCategory = (typeof ComplaintCategory)[keyof typeof ComplaintCategory];

export const AnnouncementCategory = {
  GENERAL: 'GENERAL',
  MAINTENANCE: 'MAINTENANCE',
  EVENT: 'EVENT',
  EMERGENCY: 'EMERGENCY',
  BILLING: 'BILLING',
} as const;
export type AnnouncementCategory = (typeof AnnouncementCategory)[keyof typeof AnnouncementCategory];

export const VisitorStatus = {
  PENDING: 'PENDING',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  EXPIRED: 'EXPIRED',
} as const;
export type VisitorStatus = (typeof VisitorStatus)[keyof typeof VisitorStatus];

export interface DemoAccount {
  email: string;
  password: string;
  role: Role;
  label: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'resident@demo.com', password: '123456', role: Role.RESIDENT, label: 'Resident' },
  { email: 'admin@demo.com', password: '123456', role: Role.ADMIN, label: 'Admin' },
  { email: 'security@demo.com', password: '123456', role: Role.SECURITY, label: 'Security' },
];

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'ec_police', name: 'Police', phone: '100', category: 'Emergency' },
  { id: 'ec_fire', name: 'Fire Brigade', phone: '101', category: 'Emergency' },
  { id: 'ec_ambulance', name: 'Ambulance', phone: '102', category: 'Emergency' },
  { id: 'ec_society_office', name: 'Society Office', phone: '+91 79000 12345', category: 'Society' },
  { id: 'ec_security_gate', name: 'Security Gate', phone: '+91 79000 54321', category: 'Society' },
  { id: 'ec_electrician', name: 'On-call Electrician', phone: '+91 98111 22334', category: 'Maintenance' },
  { id: 'ec_plumber', name: 'On-call Plumber', phone: '+91 98222 33445', category: 'Maintenance' },
];
