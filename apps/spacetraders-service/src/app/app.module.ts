import { Module } from '@nestjs/common';
// Removed default AppController/AppService; this service composes feature modules only
import { CreateAgentModule } from '@spacetraders/api-create-agent';

@Module({
  imports: [CreateAgentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
