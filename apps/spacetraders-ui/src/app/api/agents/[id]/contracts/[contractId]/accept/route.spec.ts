import { POST } from './route';

describe('Accept route (BDD)', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_SERVICE_URL: 'http://svc/api' };
    global.fetch = jest.fn();
    // Fix TS lib mismatch for RequestInit in test env
    type AnyObj = Record<string, unknown>;
    if (!(global as unknown as AnyObj).Request) {
      (global as unknown as AnyObj).Request = function RequestStub() { return undefined as unknown as Request; } as unknown as typeof Request;
    }
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Given backend returns JSON, Then proxy returns that JSON', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ ok: true }),
    });
    const res = await POST({} as any, { params: Promise.resolve({ id: 'a1', contractId: 'c1' }) } as any);
    expect(res.status).toBe(200);
  });

  it('Given backend returns 204 with no body, Then proxy returns ok: true', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 204,
      headers: new Map([['content-type', 'text/plain']]),
      text: async () => '',
    });
    const res = await POST({} as any, { params: Promise.resolve({ id: 'a1', contractId: 'c1' }) } as any);
    expect(res.status).toBe(200);
  });
});


