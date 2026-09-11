import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({ data: null, status: 'idle', error: null, hasHydrated: false });
  });

  it('starts hydrated=false with no user', () => {
    const state = useAuthStore.getState();
    expect(state.hasHydrated).toBe(false);
    expect(state.data).toBeNull();
  });

  it('restoreSession marks hydrated true with no user when nothing is persisted', async () => {
    await useAuthStore.getState().actions.restoreSession();
    const state = useAuthStore.getState();
    expect(state.hasHydrated).toBe(true);
    expect(state.data).toBeNull();
  });

  it('login succeeds for a valid demo account and updates state', async () => {
    const ok = await useAuthStore.getState().actions.login({ email: 'admin@demo.com', password: '123456' });
    expect(ok).toBe(true);

    const state = useAuthStore.getState();
    expect(state.status).toBe('success');
    expect(state.data?.role).toBe('ADMIN');
    expect(state.error).toBeNull();
  });

  it('login fails for invalid credentials and records an error', async () => {
    const ok = await useAuthStore.getState().actions.login({ email: 'admin@demo.com', password: 'wrong' });
    expect(ok).toBe(false);

    const state = useAuthStore.getState();
    expect(state.status).toBe('error');
    expect(state.data).toBeNull();
    expect(state.error).toBe('Invalid email or password.');
  });

  it('logout clears the current user', async () => {
    await useAuthStore.getState().actions.login({ email: 'admin@demo.com', password: '123456' });
    await useAuthStore.getState().actions.logout();

    const state = useAuthStore.getState();
    expect(state.data).toBeNull();
  });

  it('clearError resets the error field', async () => {
    await useAuthStore.getState().actions.login({ email: 'admin@demo.com', password: 'wrong' });
    useAuthStore.getState().actions.clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
