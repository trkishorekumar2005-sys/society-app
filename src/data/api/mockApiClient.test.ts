import { NetworkError } from '@/core/errors';
import { configureMockApi, mockApiCall, resetMockApiConfig } from './mockApiClient';

describe('mockApiClient', () => {
  afterEach(() => {
    resetMockApiConfig();
  });

  it('is disabled by default in the test environment and resolves immediately', async () => {
    const result = await mockApiCall(() => 'value');
    expect(result).toBe('value');
  });

  it('simulates latency and failures once explicitly enabled', async () => {
    configureMockApi({ enabled: true, minLatencyMs: 0, maxLatencyMs: 0, failureRate: 1 });
    await expect(mockApiCall(() => 'value')).rejects.toThrow(NetworkError);
  });

  it('resolves work when enabled with a zero failure rate', async () => {
    configureMockApi({ enabled: true, minLatencyMs: 0, maxLatencyMs: 0, failureRate: 0 });
    const result = await mockApiCall(() => 42);
    expect(result).toBe(42);
  });
});
