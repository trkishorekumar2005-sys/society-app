import AsyncStorage from '@react-native-async-storage/async-storage';

import { authRepository } from './authRepository';

describe('authRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('logs in a seeded demo account and persists the session', async () => {
    const user = await authRepository.login({ email: 'resident@demo.com', password: '123456' });
    expect(user.role).toBe('RESIDENT');
    expect(user).not.toHaveProperty('password');

    const restored = await authRepository.restoreSession();
    expect(restored?.email).toBe('resident@demo.com');
  });

  it('rejects an incorrect password', async () => {
    await expect(authRepository.login({ email: 'resident@demo.com', password: 'wrong' })).rejects.toThrow(
      'Invalid email or password.',
    );
  });

  it('rejects an unknown email', async () => {
    await expect(authRepository.login({ email: 'nobody@demo.com', password: '123456' })).rejects.toThrow(
      'Invalid email or password.',
    );
  });

  it('registers a new resident and persists the session', async () => {
    const user = await authRepository.register({
      name: 'New Resident',
      email: 'new.resident@demo.com',
      phone: '+91 90000 00000',
      flatNumber: 'C-101',
      password: 'secret1',
    });
    expect(user.role).toBe('RESIDENT');

    const loggedIn = await authRepository.login({ email: 'new.resident@demo.com', password: 'secret1' });
    expect(loggedIn.name).toBe('New Resident');
  });

  it('rejects registration with an email that is already taken', async () => {
    await expect(
      authRepository.register({
        name: 'Duplicate',
        email: 'admin@demo.com',
        phone: '+91 90000 00001',
        flatNumber: 'C-102',
        password: 'secret1',
      }),
    ).rejects.toThrow('An account with this email already exists.');
  });

  it('clears the session on logout', async () => {
    await authRepository.login({ email: 'resident@demo.com', password: '123456' });
    await authRepository.logout();
    const restored = await authRepository.restoreSession();
    expect(restored).toBeNull();
  });

  it('returns null when no session has been persisted', async () => {
    const restored = await authRepository.restoreSession();
    expect(restored).toBeNull();
  });
});
