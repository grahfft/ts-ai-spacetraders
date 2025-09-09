import { Test } from '@nestjs/testing';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

describe('AgentsController', () => {
  it('returns [] when header and env token missing', async () => {
    const original = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: { listAgentsByAccountTokenHash: jest.fn() } }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list(undefined as any);
    expect(res).toEqual([]);
    if (original) process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = original;
  });

  it('returns service results when header provided', async () => {
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{
        provide: AgentsService,
        useValue: { listAgentsByAccountTokenHash: jest.fn().mockResolvedValue([{ symbol: 'A' }]) },
      }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list('token');
    expect(res).toEqual([{ symbol: 'A' }]);
  });

  it('falls back to env token when header missing', async () => {
    const original = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = 'env-token';
    const mock = { listAgentsByAccountTokenHash: jest.fn().mockResolvedValue([{ symbol: 'B' }]) };
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: mock }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list(undefined as any);
    expect(mock.listAgentsByAccountTokenHash).toHaveBeenCalledWith('env-token');
    expect(res).toEqual([{ symbol: 'B' }]);
    if (original) process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = original; else delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
  });
});
