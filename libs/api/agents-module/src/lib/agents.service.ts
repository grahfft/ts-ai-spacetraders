import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEntity } from './agent.entity';
import { Transactional } from 'typeorm-transactional';
import { registerAgent, RegisterAgentInput, RegisterAgentResponseData } from './register-agent';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepo: Repository<AgentEntity>
  ) {}

  @Transactional()
  async registerAgent(input: RegisterAgentInput): Promise<RegisterAgentResponseData> {
    const { symbol, faction, email, baseUrl } = input;
    const data = await registerAgent({ symbol, faction, email, baseUrl });
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const tokenValue = (data as any)?.data?.token ?? (data as any)?.token ?? null;
    if (tokenValue && accountToken) {
      const tokenEncoded = Buffer.from(String(tokenValue)).toString('base64');
      const accountTokenHash = Buffer.from(String(accountToken)).toString('base64');
      const entity = this.agentRepo.create({ symbol, faction, email: email ?? null, tokenEncoded, accountTokenHash });
      await this.agentRepo.save(entity);
    }
    return data as RegisterAgentResponseData;
  }

  @Transactional()
  async listAgentsByAccountTokenHash(accountToken: string): Promise<AgentEntity[]> {
    const accountTokenHash = Buffer.from(String(accountToken)).toString('base64');
    return this.agentRepo.find({ where: { accountTokenHash } });
  }
}


