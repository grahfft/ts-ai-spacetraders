import { Test, TestingModule } from '@nestjs/testing';
import { CreateAgentController } from './create-agent.controller';
import { CreateAgentService } from './create-agent.service';

describe('CreateAgentController', () => {
  let controller: CreateAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAgentController],
      providers: [
        {
          provide: CreateAgentService,
          useValue: { registerAgent: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CreateAgentController>(CreateAgentController);
    (module.get(CreateAgentService) as any).registerAgent.mockResolvedValue({ data: { token: 'abc' } });
  });

  it('registers agent and returns data', async () => {
    const res = await controller.register({ symbol: 'X', faction: 'COSMIC' });
    expect(res).toEqual({ data: { token: 'abc' } });
    
  });

  it('bubbles HTTP error with payload/status', async () => {
    const module = await Test.createTestingModule({
      controllers: [CreateAgentController],
      providers: [
        {
          provide: CreateAgentService,
          useValue: {
            registerAgent: jest.fn().mockRejectedValue({
              response: { status: 409, data: { error: { code: 4111 } } },
            }),
          },
        },
      ],
    }).compile();
    controller = module.get<CreateAgentController>(CreateAgentController);
    await expect(controller.register({ symbol: 'X', faction: 'COSMIC' })).rejects.toMatchObject({
      response: { statusCode: 409, message: { error: { code: 4111 } } },
    });
  });
});


