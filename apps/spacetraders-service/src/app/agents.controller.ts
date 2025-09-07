import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { registerAgentServer } from 'services';

@Controller('agents')
export class AgentsController {
  @Post('register')
  async register(@Body() body: { symbol: string; faction: string; email?: string }) {
    try {
      const { symbol, faction, email } = body;
      const result = await registerAgentServer({ symbol, faction, email });
      return result;
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const payload = err?.response?.data ?? { message: err?.message ?? 'Internal server error' };
      throw new HttpException(payload, status);
    }
  }
}


