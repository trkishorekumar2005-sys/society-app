import { mockApiClient } from '@/data/api/mockApiClient';
import { readCollection, writeCollection } from '@/data/storage/localCollection';
import complaintsSeed from '@/data/mock/complaints.json';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus, StorageKey } from '@/core/constants';
import { NotFoundError } from '@/core/errors';
import { generateId } from '@/core/utils/id';
import type { Complaint } from '@/domain/models';

export interface CreateComplaintInput {
  title: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  raisedBy: string;
  raisedByName: string;
  flatNumber: string;
}

async function getStoredComplaints(): Promise<Complaint[]> {
  return readCollection<Complaint>(StorageKey.COMPLAINTS, complaintsSeed as Complaint[]);
}

/** Fetches all complaints, sorted by most recently created first. */
export async function fetchComplaints(): Promise<Complaint[]> {
  return mockApiClient.call(async () => {
    const items = await getStoredComplaints();
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}

/** Creates a new complaint with an initial OPEN status and a one-entry status history. */
export async function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  return mockApiClient.call(async () => {
    const items = await getStoredComplaints();
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id: generateId('cmp'),
      title: input.title,
      category: input.category,
      description: input.description,
      priority: input.priority,
      status: ComplaintStatus.OPEN,
      raisedBy: input.raisedBy,
      raisedByName: input.raisedByName,
      flatNumber: input.flatNumber,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: ComplaintStatus.OPEN, timestamp: now }],
    };
    await writeCollection(StorageKey.COMPLAINTS, [...items, complaint]);
    return complaint;
  });
}

/** Advances a complaint's status, appending a new entry to its status history. */
export async function updateComplaintStatus(
  id: string,
  nextStatus: ComplaintStatus,
  note?: string,
): Promise<Complaint> {
  return mockApiClient.call(async () => {
    const items = await getStoredComplaints();
    const index = items.findIndex((candidate) => candidate.id === id);
    if (index === -1) {
      throw new NotFoundError('This complaint could not be found.');
    }

    const now = new Date().toISOString();
    const updated: Complaint = {
      ...items[index],
      status: nextStatus,
      updatedAt: now,
      statusHistory: [...items[index].statusHistory, { status: nextStatus, timestamp: now, note }],
    };
    const nextItems = [...items];
    nextItems[index] = updated;
    await writeCollection(StorageKey.COMPLAINTS, nextItems);
    return updated;
  });
}
