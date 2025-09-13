import { AgentsService } from './agents.service';
import { Repository } from 'typeorm';
import axios from 'axios';

jest.mock('axios');

function repoMock(agent: any) {
  return {
    findOne: jest.fn().mockResolvedValue(agent),
  } as unknown as Repository<any>;
}

describe('AgentsService.fetchAgentShips (BDD)', () => {
  const prev = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
  beforeEach(() => {
    process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = 'ACCOUNT_TOKEN';
  });
  afterAll(() => {
    if (prev) process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = prev;
    else delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
  });

  it('Given agent has a stored token, When fetching ships, Then returns /my/ships data', async () => {
    const http = { get: jest.fn().mockResolvedValue({ data: { data: [{ symbol: 'SHIP-1' }] } }) };
    (axios.create as any) = jest.fn().mockReturnValue(http);
    const repo = repoMock({ id: 'a1', tokenEncoded: Buffer.from('TKN').toString('base64') });
    const svc = new AgentsService(repo as any);
    const res = await svc.fetchAgentShips('a1');
    expect(http.get).toHaveBeenCalledWith('/my/ships');
    expect(res).toEqual({ ships: [{ symbol: 'SHIP-1' }] });
  });

  it('Given no token available, When fetching ships, Then returns an error', async () => {
    delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const http = { get: jest.fn() };
    (axios.create as any) = jest.fn().mockReturnValue(http);
    const repo = repoMock({ id: 'a1', tokenEncoded: null });
    const svc = new AgentsService(repo as any);
    const res = await svc.fetchAgentShips('a1');
    expect(res).toHaveProperty('error');
  });
});


