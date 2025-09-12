import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '@spacetraders/api-agents';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
    @Inject('SPACETRADERS_HTTP') private readonly http: ReturnType<typeof axios.create>
  ) {}

  async acceptContract(agentId: string, contractId: string): Promise<any> {
    const agent = await this.agentRepo.findOne({ where: { id: agentId } });
    if (!agent) return { error: 'Not found' };
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const token = agent.tokenEncoded ? Buffer.from(agent.tokenEncoded, 'base64').toString('utf-8') : accountToken;
    if (!token) return { agent, error: 'No token available to accept contract' };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } as const;
    const res = await this.http.post(`/my/contracts/${contractId}/accept`, {}, { headers });
    return res.data ?? { ok: res.status >= 200 && res.status < 300 };
  }
}


