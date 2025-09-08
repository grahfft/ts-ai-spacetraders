import { handleCreateAgent } from './handler';
import * as api from '@spacetraders/api-agents/register';

jest.mock('@spacetraders/api-agents/register');

describe('handleCreateAgent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 when missing required fields', async () => {
    const res = await handleCreateAgent({ symbol: '', faction: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'symbol and faction are required' });
  });

  it('returns 200 and data when register succeeds', async () => {
    (api.registerAgent as jest.Mock).mockResolvedValue({ ok: true });
    const res = await handleCreateAgent({ symbol: 'A', faction: 'B' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('returns 500 and error body on failure', async () => {
    (api.registerAgent as jest.Mock).mockRejectedValue({ response: { data: { error: 'x' } } });
    const res = await handleCreateAgent({ symbol: 'A', faction: 'B' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'x' });
  });
});
