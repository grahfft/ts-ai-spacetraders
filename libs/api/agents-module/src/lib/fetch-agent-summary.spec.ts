import { AgentsService } from './agents.service';
import { Repository } from 'typeorm';
import axios from 'axios';

jest.mock('axios');

function repoMock(agent: any) {
  return {
    findOne: jest.fn().mockResolvedValue(agent),
  } as unknown as Repository<any>;
}

describe('AgentsService.fetchAgentSummary (BDD)', () => {
  const prev = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
  beforeEach(() => {
    process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = 'ACCOUNT_TOKEN';
  });
  afterAll(() => {
    if (prev) process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = prev;
    else delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
  });

  it('Given agent has stored token, When fetching, Then calls /my/agent and /my/contracts with bearer and returns data', async () => {
    const http = {
      get: jest.fn()
        .mockResolvedValueOnce({ data: { data: { symbol: 'A' } } })
        .mockResolvedValueOnce({ data: { data: [{ id: 'c1' }] } }),
    };
    (axios.create as any) = jest.fn().mockReturnValue(http);
    const repo = repoMock({ id: 'a1', tokenEncoded: Buffer.from('TKN').toString('base64') });
    const svc = new AgentsService(repo as any);
    const res = await svc.fetchAgentSummary('a1');
    expect(http.get).toHaveBeenNthCalledWith(1, '/my/agent');
    expect(http.get).toHaveBeenNthCalledWith(2, '/my/contracts');
    expect(res).toHaveProperty('myAgent');
    expect(res).toHaveProperty('myContracts');
  });

  it('Given agent has no stored token, When fetching, Then falls back to server token', async () => {
    const http = { get: jest.fn().mockResolvedValue({ data: { data: {} } }) };
    (axios.create as any) = jest.fn().mockReturnValue(http);
    const repo = repoMock({ id: 'a1', tokenEncoded: null });
    const svc = new AgentsService(repo as any);
    await svc.fetchAgentSummary('a1');
    expect(axios.create).toHaveBeenCalled();
  });

  it('Given no tokens available, When fetching, Then returns error', async () => {
    delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const http = { get: jest.fn() };
    (axios.create as any) = jest.fn().mockReturnValue(http);
    const repo = repoMock({ id: 'a1', tokenEncoded: null });
    const svc = new AgentsService(repo as any);
    const res = await svc.fetchAgentSummary('a1');
    expect(res).toHaveProperty('error');
  });
});


