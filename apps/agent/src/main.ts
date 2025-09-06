import 'dotenv/config';
import { SpaceTradersClient } from '@repo/spacetraders-api';

async function main(): Promise<void> {
  const token = process.env.SPACE_TRADERS_API_TOKEN;
  if (!token) {
    console.error('Missing SPACE_TRADERS_API_TOKEN in environment.');
    process.exit(1);
  }

  const client = new SpaceTradersClient({ token });
  try {
    const agent = await client.getAgent();
    console.log('Agent:', agent);
  } catch (error) {
    console.error('Failed to fetch agent:', error);
    process.exit(1);
  }
}

main();
