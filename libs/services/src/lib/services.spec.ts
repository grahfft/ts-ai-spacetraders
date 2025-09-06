import axios from 'axios';
import { registerAgentServer } from './services';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('registerAgentServer', () => {
  it('posts to /register with headers and returns data', async () => {
    (mockedAxios.create as any).mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: { data: { token: 't' } } }),
    });

    const data = await registerAgentServer({ symbol: 'ABC', faction: 'COSMIC' });
    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: expect.any(String), headers: expect.any(Object) })
    );
    expect(data).toEqual({ data: { token: 't' } });
  });
});
