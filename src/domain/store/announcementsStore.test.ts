import { useAnnouncementsStore } from './announcementsStore';
import { AnnouncementCategory } from '@/core/constants';

describe('announcementsStore', () => {
  beforeEach(() => {
    useAnnouncementsStore.setState({
      data: [],
      filtered: [],
      status: 'idle',
      error: null,
      selectedCategory: null,
    });
  });

  it('starts idle with no data', () => {
    const state = useAnnouncementsStore.getState();
    expect(state.status).toBe('idle');
    expect(state.data).toEqual([]);
  });

  it('fetch loads announcements and sets success status', async () => {
    await useAnnouncementsStore.getState().actions.fetch();
    const state = useAnnouncementsStore.getState();
    expect(state.status).toBe('success');
    expect(state.data.length).toBeGreaterThan(0);
  });

  it('filterByCategory updates filtered list and selected category', async () => {
    await useAnnouncementsStore.getState().actions.fetch();
    useAnnouncementsStore.getState().actions.filterByCategory(AnnouncementCategory.MAINTENANCE);
    const state = useAnnouncementsStore.getState();
    expect(state.selectedCategory).toBe(AnnouncementCategory.MAINTENANCE);
    expect(state.filtered.every((a) => a.category === AnnouncementCategory.MAINTENANCE)).toBe(true);
  });

  it('filterByCategory with null shows all announcements', async () => {
    await useAnnouncementsStore.getState().actions.fetch();
    useAnnouncementsStore.getState().actions.filterByCategory(AnnouncementCategory.MAINTENANCE);
    useAnnouncementsStore.getState().actions.filterByCategory(null);
    const state = useAnnouncementsStore.getState();
    expect(state.selectedCategory).toBeNull();
    expect(state.filtered.length).toBe(state.data.length);
  });

  it('retry re-fetches announcements after error', async () => {
    useAnnouncementsStore.setState({ status: 'error', error: 'Test error' });
    await useAnnouncementsStore.getState().actions.retry();
    const state = useAnnouncementsStore.getState();
    expect(state.status).toBe('success');
    expect(state.error).toBeNull();
  });
});
