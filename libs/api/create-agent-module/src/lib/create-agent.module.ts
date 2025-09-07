import { Module } from '@nestjs/common';
import { CreateAgentController } from './create-agent.controller';
import { CreateAgentService } from './create-agent.service';

@Module({
  imports: [],
  controllers: [CreateAgentController],
  providers: [CreateAgentService],
})
export class CreateAgentModule {}
