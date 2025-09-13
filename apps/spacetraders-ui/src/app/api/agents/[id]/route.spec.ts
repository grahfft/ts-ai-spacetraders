describe('GET /api/agents/[id] (BDD)', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_SERVICE_URL: 'http://svc/api' } as any;
    global.fetch = jest.fn();
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Given backend returns JSON, Then proxy returns JSON', async () => {
    const { GET } = await import('./route');
    (global.fetch as any).mockResolvedValueOnce({ ok: true, headers: new Map([['content-type','application/json']]), json: async () => ({ id: 'a1' }) });
    const res = await GET({} as any, { params: Promise.resolve({ id: 'a1' }) } as any);
    expect(res.status).toBe(200);
  });
});


