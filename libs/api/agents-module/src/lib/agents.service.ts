import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './agent.entity';
import { Transactional } from 'typeorm-transactional';
import { registerAgent, RegisterAgentInput, RegisterAgentResponseData } from './register-agent';
import { createHash } from 'crypto';
import axios from 'axios';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>
  ) {}

  @Transactional()
  async registerAgent(input: RegisterAgentInput): Promise<RegisterAgentResponseData> {
    const { symbol, faction, email, baseUrl } = input;
    const data = await registerAgent({ symbol, faction, email, baseUrl });
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const tokenValue = (data as any)?.data?.token ?? (data as any)?.token ?? null;
    let saved: Agent | null = null;
    if (accountToken) {
      const tokenEncoded = tokenValue ? Buffer.from(String(tokenValue)).toString('base64') : null;
      const accountTokenHash = createHash('sha256').update(String(accountToken)).digest('hex');
      const entity = this.agentRepo.create({ symbol, faction, email: email ?? null, tokenEncoded, accountTokenHash });
      saved = await this.agentRepo.save(entity);
    }
    return { ...(data as any), id: saved?.id, agent: saved } as RegisterAgentResponseData;
  }

  @Transactional()
  async listAgentsByAccountTokenHash(accountToken: string): Promise<Agent[]> {
    const accountTokenHash = createHash('sha256').update(String(accountToken)).digest('hex');
    return this.agentRepo.find({ where: { accountTokenHash } });
  }

  async findById(id: string): Promise<Agent | null> {
    return this.agentRepo.findOne({ where: { id } });
  }

  async fetchAgentSummary(id: string): Promise<any> {
    const agent = await this.findById(id);
    if (!agent) return { error: 'Not found' };
    // If we have a stored token, use it; else fall back to account token
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const token = agent.tokenEncoded ? Buffer.from(agent.tokenEncoded, 'base64').toString('utf-8') : accountToken;
    if (!token) return { agent, error: 'No token available to fetch summary' };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } as const;
    const baseURL = process.env['SPACE_TRADERS_API_BASE_URL'] || 'https://api.spacetraders.io/v2';
    const client = axios.create({ baseURL, headers });
    const [myAgentRes, myContractsRes] = await Promise.all([
      client.get('/my/agent'),
      client.get('/my/contracts'),
    ]);
    return { agent, myAgent: myAgentRes.data, myContracts: myContractsRes.data };
  }

  async fetchAgentShips(id: string): Promise<any> {
    const agent = await this.findById(id);
    if (!agent) return { error: 'Not found' };
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const token = agent.tokenEncoded ? Buffer.from(agent.tokenEncoded, 'base64').toString('utf-8') : accountToken;
    if (!token) return { agent, error: 'No token available to fetch ships' };
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } as const;
    const baseURL = process.env['SPACE_TRADERS_API_BASE_URL'] || 'https://api.spacetraders.io/v2';
    const client = axios.create({ baseURL, headers });
    const shipsRes = await client.get('/my/ships');
    const ships = shipsRes?.data?.data ?? [];
    return { ships };
  }

  private async createAuthedClientForAgent(id: string) {
    const agent = await this.findById(id);
    if (!agent) throw new Error('Not found');
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    const token = agent.tokenEncoded ? Buffer.from(agent.tokenEncoded, 'base64').toString('utf-8') : accountToken;
    if (!token) throw new Error('No token available');
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } as const;
    const baseURL = process.env['SPACE_TRADERS_API_BASE_URL'] || 'https://api.spacetraders.io/v2';
    return axios.create({ baseURL, headers });
  }

  async orbitShip(id: string, shipSymbol: string): Promise<any> {
    const client = await this.createAuthedClientForAgent(id);
    const res = await client.post(`/my/ships/${shipSymbol}/orbit`, {});
    return res.data;
  }

  async dockShip(id: string, shipSymbol: string): Promise<any> {
    const client = await this.createAuthedClientForAgent(id);
    const res = await client.post(`/my/ships/${shipSymbol}/dock`, {});
    return res.data;
  }

  async refuelShip(id: string, shipSymbol: string): Promise<any> {
    const client = await this.createAuthedClientForAgent(id);
    const res = await client.post(`/my/ships/${shipSymbol}/refuel`, {});
    return res.data;
  }
}


