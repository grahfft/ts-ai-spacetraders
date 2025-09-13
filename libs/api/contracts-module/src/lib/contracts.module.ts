import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Agent } from '@spacetraders/api-agents';
import axios from 'axios';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [ContractsController],
  providers: [
    ContractsService,
    {
      provide: 'SPACETRADERS_HTTP',
      useFactory: () => {
        const baseURL = process.env['SPACE_TRADERS_API_BASE_URL'] || 'https://api.spacetraders.io/v2';
        return axios.create({ baseURL });
      },
    },
  ],
  exports: [ContractsService],
})
export class ContractsModule {}


