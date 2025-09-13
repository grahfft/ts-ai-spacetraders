import { ContractsController } from './contracts.controller';

describe('ContractsController', () => {
  it('delegates to service.acceptContract', async () => {
    const svc = { acceptContract: jest.fn().mockResolvedValue({ ok: true }) } as any;
    const ctrl = new ContractsController(svc);
    const res = await ctrl.accept('agent-1', 'contract-1');
    expect(svc.acceptContract).toHaveBeenCalledWith('agent-1', 'contract-1');
    expect(res).toEqual({ ok: true });
  });
});


