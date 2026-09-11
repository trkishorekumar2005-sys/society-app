import { create } from 'zustand';

import {
  checkInVisitor,
  checkOutVisitor,
  createVisitor,
  fetchVisitors,
  findVisitorByPassCode,
} from '@/data/repositories/visitorsRepository';
import type { CreateVisitorInput } from '@/data/repositories/visitorsRepository';
import { toErrorMessage } from '@/core/errors';
import type { Visitor } from '@/domain/models';
import type { AsyncStatus } from './authStore';

interface VisitorsActions {
  fetch: () => Promise<void>;
  retry: () => Promise<void>;
  /** Returns the created visitor pass (with its generated code) on success, or null on failure. */
  create: (input: CreateVisitorInput) => Promise<Visitor | null>;
  verifyPassCode: (passCode: string) => Promise<boolean>;
  checkIn: (id: string) => Promise<boolean>;
  checkOut: (id: string) => Promise<boolean>;
  clearVerified: () => void;
  clearActionError: () => void;
}

interface VisitorsState {
  data: Visitor[];
  status: AsyncStatus;
  error: string | null;
  /** Tracks pre-approve / verify / check-in / check-out mutations, separately from the list fetch. */
  actionStatus: AsyncStatus;
  actionError: string | null;
  verifiedVisitor: Visitor | null;
  actions: VisitorsActions;
}

function replaceVisitor(items: Visitor[], updated: Visitor): Visitor[] {
  return items.map((candidate) => (candidate.id === updated.id ? updated : candidate));
}

export const useVisitorsStore = create<VisitorsState>((set, get) => ({
  data: [],
  status: 'idle',
  error: null,
  actionStatus: 'idle',
  actionError: null,
  verifiedVisitor: null,

  actions: {
    async fetch() {
      set({ status: 'loading', error: null });
      try {
        const items = await fetchVisitors();
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
        const visitor = await createVisitor(input);
        set((state) => ({ data: [visitor, ...state.data], actionStatus: 'success' }));
        return visitor;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return null;
      }
    },

    async verifyPassCode(passCode) {
      set({ actionStatus: 'loading', actionError: null, verifiedVisitor: null });
      try {
        const visitor = await findVisitorByPassCode(passCode);
        set({ actionStatus: 'success', verifiedVisitor: visitor });
        return true;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return false;
      }
    },

    async checkIn(id) {
      set({ actionStatus: 'loading', actionError: null });
      try {
        const updated = await checkInVisitor(id);
        set((state) => ({
          data: replaceVisitor(state.data, updated),
          verifiedVisitor: state.verifiedVisitor?.id === id ? updated : state.verifiedVisitor,
          actionStatus: 'success',
        }));
        return true;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return false;
      }
    },

    async checkOut(id) {
      set({ actionStatus: 'loading', actionError: null });
      try {
        const updated = await checkOutVisitor(id);
        set((state) => ({
          data: replaceVisitor(state.data, updated),
          verifiedVisitor: state.verifiedVisitor?.id === id ? updated : state.verifiedVisitor,
          actionStatus: 'success',
        }));
        return true;
      } catch (error) {
        set({ actionStatus: 'error', actionError: toErrorMessage(error) });
        return false;
      }
    },

    clearVerified() {
      set({ verifiedVisitor: null, actionError: null });
    },

    clearActionError() {
      set({ actionError: null });
    },
  },
}));

export const useVisitorsData = () => useVisitorsStore((state) => state.data);
export const useVisitorsStatus = () => useVisitorsStore((state) => state.status);
export const useVisitorsError = () => useVisitorsStore((state) => state.error);
export const useVisitorsActionStatus = () => useVisitorsStore((state) => state.actionStatus);
export const useVisitorsActionError = () => useVisitorsStore((state) => state.actionError);
export const useVerifiedVisitor = () => useVisitorsStore((state) => state.verifiedVisitor);
export const useVisitorsActions = () => useVisitorsStore((state) => state.actions);
