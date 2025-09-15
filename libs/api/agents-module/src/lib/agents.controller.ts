import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { RegisterAgentInput } from './register-agent';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  async list() {
    return this.agentsService.listAllAgents();
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

  // Ship Actions
  @Post(':id/ships/:shipSymbol/orbit')
  async orbit(
    @Param('id') id: string,
    @Param('shipSymbol') shipSymbol: string,
  ) {
    return this.agentsService.orbitShip(id, shipSymbol);
  }

  @Post(':id/ships/:shipSymbol/dock')
  async dock(
    @Param('id') id: string,
    @Param('shipSymbol') shipSymbol: string,
  ) {
    return this.agentsService.dockShip(id, shipSymbol);
  }

  @Post(':id/ships/:shipSymbol/refuel')
  async refuel(
    @Param('id') id: string,
    @Param('shipSymbol') shipSymbol: string,
  ) {
    return this.agentsService.refuelShip(id, shipSymbol);
  }
}


