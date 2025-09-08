import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEntity } from '@spacetraders/models-agents';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepo: Repository<AgentEntity>
  ) {}

  @Transactional()
  async listAgentsByAccountTokenHash(accountToken: string): Promise<AgentEntity[]> {
    const accountTokenHash = Buffer.from(String(accountToken)).toString('base64');
    return this.agentRepo.find({ where: { accountTokenHash } });
  }
}


