import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Reads a JSON array collection from AsyncStorage, seeding it from mock data on first access.
 * Used by repositories to persist mutations (e.g. a new complaint) on top of the bundled seed data.
 */
export async function readCollection<T>(key: string, seed: readonly T[]): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (raw !== null) {
    return JSON.parse(raw) as T[];
  }
  await AsyncStorage.setItem(key, JSON.stringify(seed));
  return [...seed];
}

export async function writeCollection<T>(key: string, items: readonly T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}
