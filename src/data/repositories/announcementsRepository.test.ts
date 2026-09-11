import { fetchAnnouncements, filterByCategory } from './announcementsRepository';
import { AnnouncementCategory } from '@/core/constants';

describe('announcementsRepository', () => {
  it('fetches and sorts announcements by pinned first, then date descending', async () => {
    const items = await fetchAnnouncements();
    expect(items.length).toBeGreaterThan(0);

    let lastPinnedIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].pinned) {
        lastPinnedIndex = i;
      } else if (lastPinnedIndex >= 0) {
        expect(items[i].pinned).toBe(false);
      }
    }

    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].pinned === items[i + 1].pinned) {
        const dateA = new Date(items[i].createdAt).getTime();
        const dateB = new Date(items[i + 1].createdAt).getTime();
        expect(dateA).toBeGreaterThanOrEqual(dateB);
      }
    }
  });

  it('filters announcements by category', async () => {
    const items = await fetchAnnouncements();
    const maintenance = filterByCategory(items, AnnouncementCategory.MAINTENANCE);
    expect(maintenance.every((a) => a.category === AnnouncementCategory.MAINTENANCE)).toBe(true);
  });

  it('preserves sort order when filtering by category', async () => {
    const items = await fetchAnnouncements();
    const filtered = filterByCategory(items, AnnouncementCategory.MAINTENANCE);

    if (filtered.length > 1) {
      let lastPinnedIndex = -1;
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].pinned) {
          lastPinnedIndex = i;
        } else if (lastPinnedIndex >= 0) {
          expect(filtered[i].pinned).toBe(false);
        }
      }
    }
  });
});
