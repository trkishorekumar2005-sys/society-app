import type { AnnouncementCategory } from '@/core/constants';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  pinned: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}
