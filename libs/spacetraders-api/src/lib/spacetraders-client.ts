import axios, { AxiosInstance } from 'axios';

export interface SpaceTradersClientOptions {
  baseUrl?: string;
  token: string;
}

export class SpaceTradersClient {
  private readonly http: AxiosInstance;

  constructor(options: SpaceTradersClientOptions) {
    const baseURL = options.baseUrl ?? 'https://api.spacetraders.io/v2';
    this.http = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${options.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getAgent(): Promise<any> {
    const response = await this.http.get('/my/agent');
    return response.data;
  }
}
