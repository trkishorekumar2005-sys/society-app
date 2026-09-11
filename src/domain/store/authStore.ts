import { create } from 'zustand';

import { authRepository } from '@/data/repositories/authRepository';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '@/data/repositories/authRepository';
import { toErrorMessage } from '@/core/errors';
import type { User } from '@/domain/models';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface AuthActions {
  /** Reads the persisted session once at app startup; drives the route guard until it resolves. */
  restoreSession: () => Promise<void>;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  updateProfile: (input: UpdateProfileInput) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthState {
  data: User | null;
  status: AsyncStatus;
  error: string | null;
  hasHydrated: boolean;
  actions: AuthActions;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  data: null,
  status: 'idle',
  error: null,
  hasHydrated: false,
  actions: {
    async restoreSession() {
      try {
        const user = await authRepository.restoreSession();
        set({ data: user, hasHydrated: true });
      } catch {
        set({ data: null, hasHydrated: true });
      }
    },

    async login(input) {
      set({ status: 'loading', error: null });
      try {
        const user = await authRepository.login(input);
        set({ data: user, status: 'success' });
        return true;
      } catch (error) {
        set({ status: 'error', error: toErrorMessage(error) });
        return false;
      }
    },

    async register(input) {
      set({ status: 'loading', error: null });
      try {
        const user = await authRepository.register(input);
        set({ data: user, status: 'success' });
        return true;
      } catch (error) {
        set({ status: 'error', error: toErrorMessage(error) });
        return false;
      }
    },

    async updateProfile(input) {
      const currentUser = get().data;
      if (!currentUser) return false;

      set({ status: 'loading', error: null });
      try {
        const user = await authRepository.updateProfile(currentUser.id, input);
        set({ data: user, status: 'success' });
        return true;
      } catch (error) {
        set({ status: 'error', error: toErrorMessage(error) });
        return false;
      }
    },

    async logout() {
      await authRepository.logout();
      set({ data: null, status: 'idle', error: null });
    },

    clearError() {
      set({ error: null });
    },
  },
}));

export const useAuthUser = () => useAuthStore((state) => state.data);
export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthHasHydrated = () => useAuthStore((state) => state.hasHydrated);
export const useAuthActions = () => useAuthStore((state) => state.actions);
