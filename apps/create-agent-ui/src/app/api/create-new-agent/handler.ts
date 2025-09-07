import { registerAgent } from '@spacetraders/core-spacetraders/register';

export interface CreateAgentBody {
  symbol?: string;
  faction?: string;
  email?: string;
}

export async function handleCreateAgent(body: CreateAgentBody) {
  const { symbol, faction, email } = body ?? {};
  if (!symbol || !faction) {
    return { status: 400, body: { error: 'symbol and faction are required' } };
  }
  try {
    const data = await registerAgent({ symbol, faction, email });
    return { status: 200, body: data };
  } catch (error: any) {
    const message = error?.response?.data ?? {
      error: error?.message ?? 'Unknown error',
    };
    return { status: 500, body: message };
  }
}


