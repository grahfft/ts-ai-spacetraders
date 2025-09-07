import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CreateAgentService } from './create-agent.service';

@Controller('agents')
export class CreateAgentController {
  constructor(private readonly createAgentService: CreateAgentService) {}

  @Post('register')
  async register(
    @Body() body: { symbol: string; faction: string; email?: string }
  ) {
    try {
      const { symbol, faction, email } = body;
      const result = await this.createAgentService.registerAgent({ symbol, faction, email });
      return result;
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const payload = err?.response?.data ?? {
        message: err?.message ?? 'Internal server error',
      };
      throw new HttpException(payload, status);
    }
  }
}
