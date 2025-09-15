import 'ts-node/register';
import 'tsconfig-paths/register';
import { ds } from './datasource';

async function main() {
  try {
    await ds.initialize();
    await ds.runMigrations();
    // eslint-disable-next-line no-console
    console.log('Migrations executed');
  } finally {
    await ds.destroy();
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
