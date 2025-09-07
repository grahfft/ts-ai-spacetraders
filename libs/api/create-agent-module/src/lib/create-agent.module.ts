import { Module } from '@nestjs/common';
import { CreateAgentController } from './create-agent.controller';

@Module({
  imports: [],
  controllers: [CreateAgentController],
})
export class CreateAgentModule {}
