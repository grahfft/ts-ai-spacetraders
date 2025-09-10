import { AgentsService as CreateAgentService } from './agents.service';
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

describe('CreateAgentService', () => {
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

  it('saves agent with encoded token and accountTokenHash', async () => {
    const repo = repoMock();
    const svc = new CreateAgentService(repo as any);
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
});
