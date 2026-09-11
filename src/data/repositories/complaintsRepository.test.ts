import AsyncStorage from '@react-native-async-storage/async-storage';

import { ComplaintPriority, ComplaintStatus } from '@/core/constants';
import { createComplaint, fetchComplaints, updateComplaintStatus } from './complaintsRepository';

describe('complaintsRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('fetches seeded complaints sorted by most recently created first', async () => {
    const items = await fetchComplaints();
    expect(items.length).toBeGreaterThan(0);
    for (let i = 0; i < items.length - 1; i++) {
      const dateA = new Date(items[i].createdAt).getTime();
      const dateB = new Date(items[i + 1].createdAt).getTime();
      expect(dateA).toBeGreaterThanOrEqual(dateB);
    }
  });

  it('creates a new complaint with OPEN status and a one-entry history', async () => {
    const complaint = await createComplaint({
      title: 'Broken lift',
      category: 'MAINTENANCE',
      description: 'The lift in Block A is not working.',
      priority: ComplaintPriority.HIGH,
      raisedBy: 'user_resident_001',
      raisedByName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    expect(complaint.status).toBe(ComplaintStatus.OPEN);
    expect(complaint.statusHistory).toHaveLength(1);
    expect(complaint.statusHistory[0].status).toBe(ComplaintStatus.OPEN);

    const items = await fetchComplaints();
    expect(items.some((item) => item.id === complaint.id)).toBe(true);
  });

  it('advances a complaint status and appends to its history', async () => {
    const complaint = await createComplaint({
      title: 'Noisy neighbor',
      category: 'NOISE',
      description: 'Loud music every night.',
      priority: ComplaintPriority.LOW,
      raisedBy: 'user_resident_001',
      raisedByName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    const updated = await updateComplaintStatus(complaint.id, ComplaintStatus.IN_PROGRESS, 'Notice issued.');
    expect(updated.status).toBe(ComplaintStatus.IN_PROGRESS);
    expect(updated.statusHistory).toHaveLength(2);
    expect(updated.statusHistory[1].note).toBe('Notice issued.');

    const resolved = await updateComplaintStatus(complaint.id, ComplaintStatus.RESOLVED);
    expect(resolved.status).toBe(ComplaintStatus.RESOLVED);
    expect(resolved.statusHistory).toHaveLength(3);
  });

  it('rejects a status update for a complaint that does not exist', async () => {
    await expect(updateComplaintStatus('nonexistent_id', ComplaintStatus.RESOLVED)).rejects.toThrow(
      'This complaint could not be found.',
    );
  });
});
