import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '@spacetraders/api-agents';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>
  ) {}

  async acceptContract(agentId: string, contractId: string): Promise<any> {
    const agent = await this.agentRepo.findOne({ where: { id: agentId } });
    if (!agent) return { error: 'Not found' };
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const token = agent.tokenEncoded ? Buffer.from(agent.tokenEncoded, 'base64').toString('utf-8') : accountToken;
    if (!token) return { agent, error: 'No token available to accept contract' };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } as const;
    const baseURL = process.env['SPACE_TRADERS_API_BASE_URL'] || 'https://api.spacetraders.io/v2';
    const client = axios.create({ baseURL, headers });
    const res = await client.post(`/my/contracts/${contractId}/accept`, {});
    return res.data ?? { ok: res.status >= 200 && res.status < 300 };
  }
}


