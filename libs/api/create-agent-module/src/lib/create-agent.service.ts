import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEntity } from '@spacetraders/models-agents';
import { Transactional } from 'typeorm-transactional';

export interface RegisterAgentInput {
  symbol: string;
  faction: string;
  email?: string;
  baseUrl?: string;
}

export interface RegisterAgentResponseData {
  token?: string;
  data?: { token?: string };
  [key: string]: unknown;
}

@Injectable()
export class CreateAgentService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepo: Repository<AgentEntity>
  ) {}

  @Transactional()
  async registerAgent(
    input: RegisterAgentInput
  ): Promise<RegisterAgentResponseData> {
    const { symbol, faction, email, baseUrl } = input;
    const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
    if (!accountToken) {
      throw new Error(
        'Missing SPACE_TRADERS_ACCOUNT_TOKEN. Add it to .env.local and restart the server.'
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accountToken}`,
    };

    const http = axios.create({
      baseURL: baseUrl ?? 'https://api.spacetraders.io/v2',
      headers,
    });
    const { data } = await http.post('/register', { symbol, faction, email });
    const tokenValue = (data as any)?.data?.token ?? (data as any)?.token ?? null;
    if (tokenValue) {
      const tokenEncoded = Buffer.from(String(tokenValue)).toString('base64');
      const accountTokenHash = Buffer.from(String(accountToken)).toString('base64');
      const entity = this.agentRepo.create({
        symbol,
        faction,
        email: email ?? null,
        tokenEncoded,
        accountTokenHash,
      });
      await this.agentRepo.save(entity);
    }
    return data as RegisterAgentResponseData;
  }
}


