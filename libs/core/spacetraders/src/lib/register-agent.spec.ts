import axios from 'axios';
import { registerAgent } from './register-agent';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios> & {
  create: jest.Mock;
};

describe('registerAgent (core)', () => {
  const prevToken = process.env['SPACE_TRADERS_ACCOUNT_TOKEN'];

  beforeEach(() => {
    jest.resetAllMocks();
    process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = 'TEST_TOKEN';
  });

  afterAll(() => {
    if (prevToken) {
      process.env['SPACE_TRADERS_ACCOUNT_TOKEN'] = prevToken;
    } else {
      delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    }
  });

  it('posts to /register with default baseURL and returns data', async () => {
    const post = jest.fn().mockResolvedValue({ data: { data: { token: 't' } } });
    (mockedAxios.create as any).mockReturnValue({ post });

    const res = await registerAgent({ symbol: 'ABC', faction: 'COSMIC' });

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.spacetraders.io/v2',
        headers: expect.objectContaining({
          Authorization: 'Bearer TEST_TOKEN',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(post).toHaveBeenCalledWith('/register', {
      symbol: 'ABC',
      faction: 'COSMIC',
      email: undefined,
    });
    expect(res).toEqual({ data: { token: 't' } });
  });

  it('honors baseUrl override', async () => {
    const post = jest.fn().mockResolvedValue({ data: { ok: true } });
    (mockedAxios.create as any).mockReturnValue({ post });

    await registerAgent({
      symbol: 'XYZ',
      faction: 'VOID',
      baseUrl: 'http://localhost:3001',
    });

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: 'http://localhost:3001' })
    );
  });

  it('throws when SPACE_TRADERS_ACCOUNT_TOKEN is missing', async () => {
    delete (process.env as any)['SPACE_TRADERS_ACCOUNT_TOKEN'];
    await expect(
      registerAgent({ symbol: 'A', faction: 'B' })
    ).rejects.toThrow(/SPACE_TRADERS_ACCOUNT_TOKEN/);
  });
});
