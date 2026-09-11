import { NetworkError } from '@/core/errors';

export interface MockApiConfig {
  minLatencyMs: number;
  maxLatencyMs: number;
  failureRate: number;
  enabled: boolean;
}

const defaultConfig: MockApiConfig = {
  minLatencyMs: 400,
  maxLatencyMs: 900,
  failureRate: 0.1,
  enabled: process.env.NODE_ENV !== 'test',
};

let config: MockApiConfig = { ...defaultConfig };

/** Overrides latency/failure-rate behavior; used to tune demos or disable failures in tests. */
export function configureMockApi(overrides: Partial<MockApiConfig>): void {
  config = { ...config, ...overrides };
}

/** Restores the default latency/failure-rate configuration. */
export function resetMockApiConfig(): void {
  config = { ...defaultConfig };
}

function randomLatency(): number {
  const { minLatencyMs, maxLatencyMs } = config;
  return minLatencyMs + Math.random() * (maxLatencyMs - minLatencyMs);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a repository operation to simulate a real network call: adds latency and randomly
 * throws a NetworkError at the configured failure rate. Disabled in the test environment.
 */
export async function mockApiCall<T>(work: () => T | Promise<T>): Promise<T> {
  if (!config.enabled) {
    return work();
  }
  await wait(randomLatency());
  if (Math.random() < config.failureRate) {
    throw new NetworkError();
  }
  return work();
}

export const mockApiClient = {
  call: mockApiCall,
  configure: configureMockApi,
  reset: resetMockApiConfig,
};
