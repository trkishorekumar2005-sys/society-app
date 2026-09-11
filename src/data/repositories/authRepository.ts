import AsyncStorage from '@react-native-async-storage/async-storage';

import { mockApiClient } from '@/data/api/mockApiClient';
import { readCollection, writeCollection } from '@/data/storage/localCollection';
import usersSeed from '@/data/mock/users.json';
import { Role, StorageKey } from '@/core/constants';
import { UnauthorizedError, ValidationError } from '@/core/errors';
import { generateId } from '@/core/utils/id';
import type { User } from '@/domain/models';

interface StoredUser extends User {
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
  phone: string;
  flatNumber: string;
}

function toPublicUser(storedUser: StoredUser): User {
  const { password: _password, ...user } = storedUser;
  return user;
}

async function getStoredUsers(): Promise<StoredUser[]> {
  return readCollection<StoredUser>(StorageKey.USERS, usersSeed as StoredUser[]);
}

/** Handles credential checks, registration, and session persistence for demo auth. */
export const authRepository = {
  async login({ email, password }: LoginInput): Promise<User> {
    return mockApiClient.call(async () => {
      const users = await getStoredUsers();
      const match = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      if (!match || match.password !== password) {
        throw new UnauthorizedError('Invalid email or password.');
      }
      const user = toPublicUser(match);
      await AsyncStorage.setItem(StorageKey.SESSION, JSON.stringify(user));
      return user;
    });
  },

  async register(input: RegisterInput): Promise<User> {
    return mockApiClient.call(async () => {
      const users = await getStoredUsers();
      const emailTaken = users.some((candidate) => candidate.email.toLowerCase() === input.email.toLowerCase());
      if (emailTaken) {
        throw new ValidationError('An account with this email already exists.', 'email');
      }

      const newUser: StoredUser = {
        id: generateId('user'),
        name: input.name,
        email: input.email,
        phone: input.phone,
        flatNumber: input.flatNumber,
        role: Role.RESIDENT,
        password: input.password,
        createdAt: new Date().toISOString(),
      };
      await writeCollection(StorageKey.USERS, [...users, newUser]);

      const user = toPublicUser(newUser);
      await AsyncStorage.setItem(StorageKey.SESSION, JSON.stringify(user));
      return user;
    });
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    return mockApiClient.call(async () => {
      const users = await getStoredUsers();
      const index = users.findIndex((candidate) => candidate.id === userId);
      if (index === -1) {
        throw new UnauthorizedError('Your session is no longer valid. Please log in again.');
      }

      const updated: StoredUser = {
        ...users[index],
        name: input.name,
        phone: input.phone,
        flatNumber: input.flatNumber,
      };
      const nextUsers = [...users];
      nextUsers[index] = updated;
      await writeCollection(StorageKey.USERS, nextUsers);

      const user = toPublicUser(updated);
      await AsyncStorage.setItem(StorageKey.SESSION, JSON.stringify(user));
      return user;
    });
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(StorageKey.SESSION);
  },

  /** Reads the persisted session directly from storage, bypassing mock latency/failure. */
  async restoreSession(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(StorageKey.SESSION);
    return raw ? (JSON.parse(raw) as User) : null;
  },
};
