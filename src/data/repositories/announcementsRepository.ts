import { mockApiClient } from '@/data/api/mockApiClient';
import { readCollection } from '@/data/storage/localCollection';
import announcementsSeed from '@/data/mock/announcements.json';
import { AnnouncementCategory } from '@/core/constants';
import type { Announcement } from '@/domain/models';

/** Fetches all announcements, sorted by pinned status (pinned first) then by date descending. */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  return mockApiClient.call(async () => {
    const items = await readCollection('society_app:announcements', announcementsSeed as Announcement[]);
    return items.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });
}

/** Filters announcements by category, preserving the pinned-first sort order. */
export function filterByCategory(announcements: Announcement[], category: AnnouncementCategory): Announcement[] {
  return announcements.filter((a) => a.category === category);
}
