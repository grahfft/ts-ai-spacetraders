import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from '../index';
import { Agent } from './agent.entity';
import axios from 'axios';

/*
  test-only file; excluded from library build via tsconfig.lib.json
  eslint-disable-next-line @typescript-eslint/ban-ts-comment
  @ts-nocheck
*/
jest.mock('axios');

describe('Agents e2e (Register → Summary)', () => {
  let app: INestApplication;
  const OLD_ENV = process.env;

  beforeAll(async () => {
    process.env = { ...OLD_ENV, SPACE_TRADERS_ACCOUNT_TOKEN: 'ACCOUNT_TOKEN' };

    (axios.create as any) = jest.fn().mockReturnValue({
      post: jest.fn(async (path: string) => {
        if (path.includes('register')) {
          return { data: { data: { token: 'AGENT_TOKEN' } } };
        }
        return { data: {} };
      }),
      get: jest.fn(async (path: string) => {
        if (path === '/my/agent') {
          return { data: { data: { symbol: 'E2E', credits: 0, headquarters: 'X' } } };
        }
        if (path === '/my/contracts') {
          return { data: { data: [] } };
        }
        return { data: {} };
      }),
    });

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Agent],
          synchronize: true,
        }),
        AgentsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    process.env = OLD_ENV;
  });

  it('registers an agent then fetches summary', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/agents/register')
      .send({ symbol: 'E2E', faction: 'COSMIC' });
    expect([200, 201]).toContain(createRes.status);
    const id = createRes.body?.id ?? createRes.body?.agent?.id;
    expect(id).toBeTruthy();

    const summaryRes = await request(app.getHttpServer()).get(`/agents/${id}/summary`).send();
    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body).toHaveProperty('myAgent');
    expect(summaryRes.body).toHaveProperty('myContracts');
  });
});


