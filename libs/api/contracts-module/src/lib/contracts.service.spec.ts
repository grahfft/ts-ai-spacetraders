import { ContractsService } from './contracts.service';
import { Repository } from 'typeorm';
import { Agent } from '@spacetraders/api-agents';

describe('ContractsService', () => {
  it('posts accept with bearer and returns ok when no body', async () => {
    const agentRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'a1', tokenEncoded: Buffer.from('tkn').toString('base64') } as Partial<Agent>),
    } as unknown as Repository<Agent>;
    const http = { post: jest.fn().mockResolvedValue({ status: 204, data: undefined }) } as any;
    const svc = new ContractsService(agentRepo, http);
    const res = await svc.acceptContract('a1', 'c1');
    expect(http.post).toHaveBeenCalledWith('/my/contracts/c1/accept', {}, expect.objectContaining({ headers: expect.any(Object) }));
    expect(res).toEqual({ ok: true });
  });
});


