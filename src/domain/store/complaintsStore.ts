import { create } from 'zustand';

import { createComplaint, fetchComplaints, updateComplaintStatus } from '@/data/repositories/complaintsRepository';
import type { CreateComplaintInput } from '@/data/repositories/complaintsRepository';
import type { ComplaintStatus } from '@/core/constants';
import { toErrorMessage } from '@/core/errors';
import type { Complaint } from '@/domain/models';
import type { AsyncStatus } from './authStore';

interface ComplaintsActions {
  fetch: () => Promise<void>;
  retry: () => Promise<void>;
  create: (input: CreateComplaintInput) => Promise<boolean>;
  updateStatus: (id: string, nextStatus: ComplaintStatus) => Promise<boolean>;
  clearActionError: () => void;
}

interface ComplaintsState {
  data: Complaint[];
  status: AsyncStatus;
  error: string | null;
  /** Tracks the raise-complaint / status-update mutations, separately from the list's fetch status. */
  actionStatus: AsyncStatus;
  actionError: string | null;
  actions: ComplaintsActions;
}

export const useComplaintsStore = create<ComplaintsState>((set, get) => ({
  data: [],
  status: 'idle',
  error: null,
  actionStatus: 'idle',
  actionError: null,

  actions: {
    async fetch() {
      set({ status: 'loading', error: null });
      try {
        const items = await fetchComplaints();
        set({ data: items, status: 'success' });
      } catch (error) {
        set({ status: 'error', error: toErrorMessage(error) });
      }
    },

    async retry() {
      await get().actions.fetch();
    },

    async create(input) {
      set({ actionStatus: 'loading', actionError: null });
      try {
        const complaint = await createComplaint(input);
        set((state) => ({ data: [complaint, ...state.data], actionStatus: 'success' }));
        return true;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return false;
      }
    },

    async updateStatus(id, nextStatus) {
      set({ actionStatus: 'loading', actionError: null });
      try {
        const updated = await updateComplaintStatus(id, nextStatus);
        set((state) => ({
          data: state.data.map((candidate) => (candidate.id === updated.id ? updated : candidate)),
          actionStatus: 'success',
        }));
        return true;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return false;
      }
    },

    clearActionError() {
      set({ actionError: null });
    },
  },
}));

export const useComplaintsData = () => useComplaintsStore((state) => state.data);
export const useComplaintsStatus = () => useComplaintsStore((state) => state.status);
export const useComplaintsError = () => useComplaintsStore((state) => state.error);
export const useComplaintsActionStatus = () => useComplaintsStore((state) => state.actionStatus);
export const useComplaintsActionError = () => useComplaintsStore((state) => state.actionError);
export const useComplaintsActions = () => useComplaintsStore((state) => state.actions);
