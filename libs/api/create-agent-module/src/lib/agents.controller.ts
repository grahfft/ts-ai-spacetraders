import { Controller, Get, Headers } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async list(@Headers('x-account-token') accountToken?: string) {
    if (!accountToken) return [];
    return this.agentsService.listAgentsByAccountTokenHash(accountToken);
  }
}


