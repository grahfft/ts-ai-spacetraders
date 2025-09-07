import axios from 'axios';

export interface RegisterAgentInput {
  symbol: string;
  faction: string;
  email?: string;
  baseUrl?: string;
}

export interface RegisterAgentResponseData {
  token?: string;
  data?: { token?: string };
  [key: string]: unknown;
}

export async function registerAgent(
  input: RegisterAgentInput
): Promise<RegisterAgentResponseData> {
  const { symbol, faction, email, baseUrl } = input;
  const accountToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];
  if (!accountToken) {
    throw new Error(
      'Missing SPACE_TRADERS_ACCOUNT_TOKEN. Add it to .env.local and restart the server.'
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accountToken}`,
  };

  const http = axios.create({
    baseURL: baseUrl ?? 'https://api.spacetraders.io/v2',
    headers,
  });
  const { data } = await http.post('/register', { symbol, faction, email });
  return data as RegisterAgentResponseData;
}


