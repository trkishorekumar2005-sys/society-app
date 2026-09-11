import { create } from 'zustand';

import { fetchAnnouncements, filterByCategory } from '@/data/repositories/announcementsRepository';
import { AnnouncementCategory } from '@/core/constants';
import { toErrorMessage } from '@/core/errors';
import type { Announcement } from '@/domain/models';
import type { AsyncStatus } from './authStore';

interface AnnouncementsState {
  data: Announcement[];
  filtered: Announcement[];
  status: AsyncStatus;
  error: string | null;
  selectedCategory: AnnouncementCategory | null;
  actions: {
    fetch: () => Promise<void>;
    filterByCategory: (category: AnnouncementCategory | null) => void;
    retry: () => Promise<void>;
  };
}

export const useAnnouncementsStore = create<AnnouncementsState>((set, get) => ({
  data: [],
  filtered: [],
  status: 'idle',
  error: null,
  selectedCategory: null,

  actions: {
    async fetch() {
      set({ status: 'loading', error: null });
      try {
        const items = await fetchAnnouncements();
        set({ data: items, filtered: items, status: 'success' });
      } catch (error) {
        set({ status: 'error', error: toErrorMessage(error) });
      }
    },

    filterByCategory(category) {
      const { data } = get();
      const filtered = category ? filterByCategory(data, category) : data;
      set({ selectedCategory: category, filtered });
    },

    async retry() {
      await get().actions.fetch();
    },
  },
}));

export const useAnnouncementsData = () => useAnnouncementsStore((state) => state.filtered);
export const useAnnouncementsStatus = () => useAnnouncementsStore((state) => state.status);
export const useAnnouncementsError = () => useAnnouncementsStore((state) => state.error);
export const useAnnouncementsCategory = () => useAnnouncementsStore((state) => state.selectedCategory);
export const useAnnouncementsActions = () => useAnnouncementsStore((state) => state.actions);
