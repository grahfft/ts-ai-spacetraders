import { Test } from '@nestjs/testing';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

describe('AgentsController', () => {
  it('returns [] when service returns none', async () => {
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: { listAllAgents: jest.fn().mockResolvedValue([]) } }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list();
    expect(res).toEqual([]);
  });

  it('returns service results', async () => {
    const module = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{
        provide: AgentsService,
        useValue: { listAllAgents: jest.fn().mockResolvedValue([{ symbol: 'A' }]) },
      }],
    }).compile();
    const controller = module.get(AgentsController);
    const res = await controller.list();
    expect(res).toEqual([{ symbol: 'A' }]);
  });
  
});
