import { Controller, Param, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('agents')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post(':id/contracts/:contractId/accept')
  async accept(
    @Param('id') id: string,
    @Param('contractId') contractId: string
  ) {
    return this.contractsService.acceptContract(id, contractId);
  }
}


