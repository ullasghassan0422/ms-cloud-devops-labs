import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, API_URL } from './api';

describe('api.health', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the health status when the request succeeds', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await expect(api.health()).resolves.toEqual({ status: 'ok' });
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/health`);
  });

  it('throws an error when the health request fails', async () => {
    fetchMock.mockResolvedValue(
      new Response('service unavailable', {
        status: 503,
        statusText: 'Service Unavailable'
      })
    );

    await expect(api.health()).rejects.toThrow(
      '503 Service Unavailable: service unavailable'
    );
  });
});
