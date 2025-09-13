// TDD: test for Next API proxy route (not yet implemented)
describe('GET /api/agents/[id]/ships (BDD)', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_SERVICE_URL: 'http://svc/api' };
    global.fetch = jest.fn();
    type AnyObj = Record<string, unknown>;
    if (!(global as unknown as AnyObj).Request) {
      (global as unknown as AnyObj).Request = function RequestStub() { return undefined as unknown as Request; } as unknown as typeof Request;
    }
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Given backend returns JSON, Then proxy returns JSON', async () => {
    const { GET } = await import('./route');
    (global.fetch as any).mockResolvedValueOnce({ ok: true, headers: new Map([['content-type','application/json']]), json: async () => ({ ships: [] }) });
    const res = await GET({} as any, { params: Promise.resolve({ id: 'a1' }) } as any);
    expect(res.status).toBe(200);
  });
});


