import AsyncStorage from '@react-native-async-storage/async-storage';

import { VisitorStatus } from '@/core/constants';
import {
  checkInVisitor,
  checkOutVisitor,
  createVisitor,
  fetchVisitors,
  findVisitorByPassCode,
} from './visitorsRepository';

describe('visitorsRepository', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('fetches seeded visitors sorted by most recently created first', async () => {
    const items = await fetchVisitors();
    expect(items.length).toBeGreaterThan(0);
    for (let i = 0; i < items.length - 1; i++) {
      expect(new Date(items[i].createdAt).getTime()).toBeGreaterThanOrEqual(new Date(items[i + 1].createdAt).getTime());
    }
  });

  it('creates a visitor with PENDING status and a unique 6-digit pass code', async () => {
    const visitor = await createVisitor({
      name: 'Test Visitor',
      phone: '+91 90000 00000',
      purpose: 'Delivery',
      visitDate: '2026-09-15',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    expect(visitor.status).toBe(VisitorStatus.PENDING);
    expect(visitor.passCode).toMatch(/^\d{6}$/);

    const items = await fetchVisitors();
    expect(items.some((item) => item.id === visitor.id)).toBe(true);
  });

  it('finds a visitor by pass code', async () => {
    const visitor = await createVisitor({
      name: 'Findable Visitor',
      phone: '+91 90000 00001',
      purpose: 'Meeting',
      visitDate: '2026-09-16',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    const found = await findVisitorByPassCode(visitor.passCode);
    expect(found.id).toBe(visitor.id);
  });

  it('rejects an unknown pass code', async () => {
    await expect(findVisitorByPassCode('000000')).rejects.toThrow('No visitor pass found with that code.');
  });

  it('checks a visitor in and then out', async () => {
    const visitor = await createVisitor({
      name: 'Flow Visitor',
      phone: '+91 90000 00002',
      purpose: 'Delivery',
      visitDate: '2026-09-17',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    const checkedIn = await checkInVisitor(visitor.id);
    expect(checkedIn.status).toBe(VisitorStatus.CHECKED_IN);
    expect(checkedIn.checkInTime).toBeDefined();

    const checkedOut = await checkOutVisitor(visitor.id);
    expect(checkedOut.status).toBe(VisitorStatus.CHECKED_OUT);
    expect(checkedOut.checkOutTime).toBeDefined();
  });

  it('rejects checking in a visitor that is not PENDING', async () => {
    const visitor = await createVisitor({
      name: 'Double Checkin',
      phone: '+91 90000 00003',
      purpose: 'Delivery',
      visitDate: '2026-09-18',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });
    await checkInVisitor(visitor.id);
    await expect(checkInVisitor(visitor.id)).rejects.toThrow('This visitor has already been checked in.');
  });

  it('rejects checking out a visitor that is not CHECKED_IN', async () => {
    const visitor = await createVisitor({
      name: 'No Checkin Yet',
      phone: '+91 90000 00004',
      purpose: 'Delivery',
      visitDate: '2026-09-19',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });
    await expect(checkOutVisitor(visitor.id)).rejects.toThrow('This visitor is not currently checked in.');
  });
});
