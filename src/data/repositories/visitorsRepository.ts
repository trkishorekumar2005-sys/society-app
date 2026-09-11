import { mockApiClient } from '@/data/api/mockApiClient';
import { readCollection, writeCollection } from '@/data/storage/localCollection';
import visitorsSeed from '@/data/mock/visitors.json';
import { StorageKey, VisitorStatus } from '@/core/constants';
import { NotFoundError, ValidationError } from '@/core/errors';
import { generateId, generatePassCode } from '@/core/utils/id';
import type { Visitor } from '@/domain/models';

export interface CreateVisitorInput {
  name: string;
  phone: string;
  purpose: string;
  visitDate: string;
  residentId: string;
  residentName: string;
  flatNumber: string;
}

async function getStoredVisitors(): Promise<Visitor[]> {
  return readCollection<Visitor>(StorageKey.VISITORS, visitorsSeed as Visitor[]);
}

async function saveVisitor(updated: Visitor): Promise<Visitor> {
  const items = await getStoredVisitors();
  const index = items.findIndex((candidate) => candidate.id === updated.id);
  if (index === -1) {
    throw new NotFoundError('This visitor pass could not be found.');
  }
  const nextItems = [...items];
  nextItems[index] = updated;
  await writeCollection(StorageKey.VISITORS, nextItems);
  return updated;
}

/** Fetches all visitor passes, sorted by most recently created first. */
export async function fetchVisitors(): Promise<Visitor[]> {
  return mockApiClient.call(async () => {
    const items = await getStoredVisitors();
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

/** Pre-approves a visitor, generating a unique 6-digit pass code. */
export async function createVisitor(input: CreateVisitorInput): Promise<Visitor> {
  return mockApiClient.call(async () => {
    const items = await getStoredVisitors();
    let passCode = generatePassCode();
    while (items.some((candidate) => candidate.passCode === passCode)) {
      passCode = generatePassCode();
    }

    const now = new Date().toISOString();
    const visitor: Visitor = {
      id: generateId('vis'),
      name: input.name,
      phone: input.phone,
      purpose: input.purpose,
      visitDate: input.visitDate,
      passCode,
      status: VisitorStatus.PENDING,
      residentId: input.residentId,
      residentName: input.residentName,
      flatNumber: input.flatNumber,
      createdAt: now,
    };
    await writeCollection(StorageKey.VISITORS, [...items, visitor]);
    return visitor;
  });
}

/** Looks up a visitor pass by its 6-digit code, for security to verify at the gate. */
export async function findVisitorByPassCode(passCode: string): Promise<Visitor> {
  return mockApiClient.call(async () => {
    const items = await getStoredVisitors();
    const match = items.find((candidate) => candidate.passCode === passCode.trim());
    if (!match) {
      throw new NotFoundError('No visitor pass found with that code.');
    }
    return match;
  });
}

/** Checks in a PENDING visitor, recording the check-in time. */
export async function checkInVisitor(id: string): Promise<Visitor> {
  return mockApiClient.call(async () => {
    const items = await getStoredVisitors();
    const visitor = items.find((candidate) => candidate.id === id);
    if (!visitor) {
      throw new NotFoundError('This visitor pass could not be found.');
    }
    if (visitor.status !== VisitorStatus.PENDING) {
      throw new ValidationError('This visitor has already been checked in.');
    }
    return saveVisitor({ ...visitor, status: VisitorStatus.CHECKED_IN, checkInTime: new Date().toISOString() });
  });
}

/** Checks out a CHECKED_IN visitor, recording the check-out time. */
export async function checkOutVisitor(id: string): Promise<Visitor> {
  return mockApiClient.call(async () => {
    const items = await getStoredVisitors();
    const visitor = items.find((candidate) => candidate.id === id);
    if (!visitor) {
      throw new NotFoundError('This visitor pass could not be found.');
    }
    if (visitor.status !== VisitorStatus.CHECKED_IN) {
      throw new ValidationError('This visitor is not currently checked in.');
    }
    return saveVisitor({ ...visitor, status: VisitorStatus.CHECKED_OUT, checkOutTime: new Date().toISOString() });
  });
}
