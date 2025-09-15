import { AgentsService } from './agents.service';
import { Repository } from 'typeorm';
import axios from 'axios';

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

  it('Given server token is set, When registering, Then it saves agent with encoded token', async () => {
    const repo = repoMock();
    const svc = new AgentsService(repo as any);
    await svc.registerAgent({ symbol: 'S', faction: 'F' });
    expect((repo as any).create).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'S',
        tokenEncoded: Buffer.from('AGENT_TOKEN').toString('base64'),
      })
    );
    expect((repo as any).save).toHaveBeenCalled();
  });

  // token being missing is allowed; we now save agent regardless
});
