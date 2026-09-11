import AsyncStorage from '@react-native-async-storage/async-storage';

import { VisitorStatus } from '@/core/constants';
import { useVisitorsStore } from './visitorsStore';

describe('visitorsStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useVisitorsStore.setState({
      data: [],
      status: 'idle',
      error: null,
      actionStatus: 'idle',
      actionError: null,
      verifiedVisitor: null,
    });
  });

  it('fetch loads visitors and sets success status', async () => {
    await useVisitorsStore.getState().actions.fetch();
    const state = useVisitorsStore.getState();
    expect(state.status).toBe('success');
    expect(state.data.length).toBeGreaterThan(0);
  });

  it('create adds a new visitor and returns it with a pass code', async () => {
    await useVisitorsStore.getState().actions.fetch();
    const countBefore = useVisitorsStore.getState().data.length;

    const created = await useVisitorsStore.getState().actions.create({
      name: 'New Visitor',
      phone: '+91 90000 00000',
      purpose: 'Delivery',
      visitDate: '2026-09-20',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    expect(created).not.toBeNull();
    expect(created?.passCode).toMatch(/^\d{6}$/);
    expect(useVisitorsStore.getState().data.length).toBe(countBefore + 1);
  });

  it('verifyPassCode sets verifiedVisitor on success', async () => {
    const created = await useVisitorsStore.getState().actions.create({
      name: 'Verify Me',
      phone: '+91 90000 00001',
      purpose: 'Meeting',
      visitDate: '2026-09-21',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    const ok = await useVisitorsStore.getState().actions.verifyPassCode(created!.passCode);
    expect(ok).toBe(true);
    expect(useVisitorsStore.getState().verifiedVisitor?.id).toBe(created!.id);
  });

  it('verifyPassCode records an error for an unknown code', async () => {
    const ok = await useVisitorsStore.getState().actions.verifyPassCode('000000');
    expect(ok).toBe(false);
    expect(useVisitorsStore.getState().actionError).toBe('No visitor pass found with that code.');
  });

  it('checkIn then checkOut updates the visitor status in the list', async () => {
    const created = await useVisitorsStore.getState().actions.create({
      name: 'Flow Visitor',
      phone: '+91 90000 00002',
      purpose: 'Delivery',
      visitDate: '2026-09-22',
      residentId: 'user_resident_001',
      residentName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    await useVisitorsStore.getState().actions.checkIn(created!.id);
    let updated = useVisitorsStore.getState().data.find((v) => v.id === created!.id);
    expect(updated?.status).toBe(VisitorStatus.CHECKED_IN);

    await useVisitorsStore.getState().actions.checkOut(created!.id);
    updated = useVisitorsStore.getState().data.find((v) => v.id === created!.id);
    expect(updated?.status).toBe(VisitorStatus.CHECKED_OUT);
  });

  it('clearVerified resets the verified visitor and action error', async () => {
    await useVisitorsStore.getState().actions.verifyPassCode('000000');
    useVisitorsStore.getState().actions.clearVerified();
    expect(useVisitorsStore.getState().verifiedVisitor).toBeNull();
    expect(useVisitorsStore.getState().actionError).toBeNull();
  });
});
