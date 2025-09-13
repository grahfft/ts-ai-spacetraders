import { AgentsService } from './agents.service';
import { Repository } from 'typeorm';
import axios from 'axios';
import { createHash } from 'crypto';

jest.mock('axios');
jest.mock('typeorm-transactional', () => ({
  Transactional: () => (_t: any, _k: any, d: any) => d,
  initializeTransactionalContext: jest.fn(),
  addTransactionalDataSources: jest.fn(),
}));

function repoMock() {
  return {
    create: jest.fn((x) => x),
    save: jest.fn(async (x) => x),
  } as unknown as Repository<any>;
}

describe('AgentsService.registerAgent (BDD)', () => {
  const prev = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
  beforeEach(() => {
    process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = 'ACCOUNT_TOKEN';
    (axios.create as any) = jest.fn().mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: { data: { token: 'AGENT_TOKEN' } } }),
    });
  });
  afterAll(() => {
    if (prev) process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = prev;
    else delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
  });

  it('Given server token is set, When registering, Then it saves agent with encoded token and sha256 hash', async () => {
    const repo = repoMock();
    const svc = new AgentsService(repo as any);
    await svc.registerAgent({ symbol: 'S', faction: 'F' });
    expect((repo as any).create).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'S',
        tokenEncoded: Buffer.from('AGENT_TOKEN').toString('base64'),
        accountTokenHash: createHash('sha256').update('ACCOUNT_TOKEN').digest('hex'),
      })
    );
    expect((repo as any).save).toHaveBeenCalled();
  });

  it('Given server token is missing, When registering, Then it throws a helpful error', async () => {
    delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const repo = repoMock();
    const svc = new AgentsService(repo as any);
    await expect(svc.registerAgent({ symbol: 'S', faction: 'F' })).rejects.toThrow(
      /Missing SPACE_TRADERS_ACCOUNT_TOKEN/i
    );
    expect((repo as any).save).not.toHaveBeenCalled();
  });
});
