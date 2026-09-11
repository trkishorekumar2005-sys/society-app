import AsyncStorage from '@react-native-async-storage/async-storage';

import { ComplaintPriority, ComplaintStatus } from '@/core/constants';
import { useComplaintsStore } from './complaintsStore';

describe('complaintsStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useComplaintsStore.setState({
      data: [],
      status: 'idle',
      error: null,
      actionStatus: 'idle',
      actionError: null,
    });
  });

  it('starts idle with no data', () => {
    const state = useComplaintsStore.getState();
    expect(state.status).toBe('idle');
    expect(state.data).toEqual([]);
  });

  it('fetch loads complaints and sets success status', async () => {
    await useComplaintsStore.getState().actions.fetch();
    const state = useComplaintsStore.getState();
    expect(state.status).toBe('success');
    expect(state.data.length).toBeGreaterThan(0);
  });

  it('create adds a new complaint to the front of the list', async () => {
    await useComplaintsStore.getState().actions.fetch();
    const countBefore = useComplaintsStore.getState().data.length;

    const ok = await useComplaintsStore.getState().actions.create({
      title: 'Water leakage',
      category: 'MAINTENANCE',
      description: 'Leaking tap in the common area.',
      priority: ComplaintPriority.MEDIUM,
      raisedBy: 'user_resident_001',
      raisedByName: 'Rohan Mehta',
      flatNumber: 'A-204',
    });

    expect(ok).toBe(true);
    const state = useComplaintsStore.getState();
    expect(state.data.length).toBe(countBefore + 1);
    expect(state.data[0].title).toBe('Water leakage');
    expect(state.actionStatus).toBe('success');
  });

  it('updateStatus advances an existing complaint in place', async () => {
    await useComplaintsStore.getState().actions.fetch();
    const target = useComplaintsStore.getState().data.find((c) => c.status === ComplaintStatus.OPEN);
    expect(target).toBeDefined();

    const ok = await useComplaintsStore.getState().actions.updateStatus(target!.id, ComplaintStatus.IN_PROGRESS);
    expect(ok).toBe(true);

    const updated = useComplaintsStore.getState().data.find((c) => c.id === target!.id);
    expect(updated?.status).toBe(ComplaintStatus.IN_PROGRESS);
  });

  it('updateStatus records an error for an unknown complaint', async () => {
    const ok = await useComplaintsStore.getState().actions.updateStatus('nonexistent_id', ComplaintStatus.RESOLVED);
    expect(ok).toBe(false);
    expect(useComplaintsStore.getState().actionStatus).toBe('error');
    expect(useComplaintsStore.getState().actionError).toBe('This complaint could not be found.');
  });

  it('clearActionError resets the action error field', async () => {
    await useComplaintsStore.getState().actions.updateStatus('nonexistent_id', ComplaintStatus.RESOLVED);
    useComplaintsStore.getState().actions.clearActionError();
    expect(useComplaintsStore.getState().actionError).toBeNull();
  });
});
