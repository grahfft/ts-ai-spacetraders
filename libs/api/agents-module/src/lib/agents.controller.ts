import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { RegisterAgentInput } from './register-agent';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async list(@Headers('x-account-token') accountToken?: string) {
    if (!accountToken) return [];
    return this.agentsService.listAgentsByAccountTokenHash(accountToken);
  }

  @Post()
  async create(
    @Body() body: RegisterAgentInput
  ) {
    return this.agentsService.registerAgent(body);
  }
}


