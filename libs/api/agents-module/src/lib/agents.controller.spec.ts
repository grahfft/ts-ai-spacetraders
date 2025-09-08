import { Test } from '@nestjs/testing';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

describe('AgentsController', () => {
  it('returns [] when header missing', async () => {
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: { listAgentsByAccountTokenHash: jest.fn() } }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list(undefined as any);
    expect(res).toEqual([]);
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
});
