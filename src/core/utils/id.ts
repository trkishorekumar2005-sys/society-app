/** Generates short, prefix-tagged ids for mock records created at runtime (e.g. new complaints). */
export function generateId(prefix = 'id'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${timestamp}${random}`;
}

/** Generates a random 6-digit visitor pass code as a zero-padded string. */
export function generatePassCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
