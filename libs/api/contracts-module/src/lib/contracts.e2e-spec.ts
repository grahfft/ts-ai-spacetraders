import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsModule } from './contracts.module';
import { Agent } from '@spacetraders/api-agents';

describe('Contracts e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const httpMock = { post: jest.fn().mockResolvedValue({ status: 204, data: undefined }) } as any;
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Agent],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Agent]),
        ContractsModule,
      ],
    })
      .overrideProvider('SPACETRADERS_HTTP')
      .useValue(httpMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // seed one agent
    const repo = moduleRef.get('AgentRepository');
    await repo.save({ id: 'a1', symbol: 'TEST', accountTokenHash: 'hash', tokenEncoded: Buffer.from('tkn').toString('base64') });
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts a contract', async () => {
    const res = await request(app.getHttpServer()).post('/agents/a1/contracts/c1/accept').send({});
    expect(res.status).toBe(201); // Nest default for POST if returns value; but controller returns raw => may be 200
    // Allow 200 as well
    expect([200, 201]).toContain(res.status);
  });
});


