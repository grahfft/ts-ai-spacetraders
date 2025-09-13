import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { RegisterAgentInput } from './register-agent';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async list() {
    const token = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    if (!token) return [];
    return this.agentsService.listAgentsByAccountTokenHash(token);
  }

  @Post()
  async create(
    @Body() body: RegisterAgentInput
  ) {
    return this.agentsService.registerAgent(body);
  }

  @Post('register')
  async createRegister(@Body() body: RegisterAgentInput) {
    return this.agentsService.registerAgent(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentsService.findById(id);
  }

  @Get(':id/summary')
  async summary(@Param('id') id: string) {
    return this.agentsService.fetchAgentSummary(id);
  }

  @Get(':id/ships')
  async ships(@Param('id') id: string) {
    return this.agentsService.fetchAgentShips(id);
  }
}


