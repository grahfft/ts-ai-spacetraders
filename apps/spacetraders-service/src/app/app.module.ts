import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsController } from './agents.controller';

@Module({
  imports: [],
  controllers: [AppController, AgentsController],
  providers: [AppService],
})
export class AppModule {}
