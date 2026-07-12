import { config } from 'dotenv';

config({ path: '.env.local' });

async function main() {
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');
  const { default: postgres } = await import('postgres');
  const { drizzle } = await import('drizzle-orm/postgres-js');
  const { env } = await import('@/lib/env');

  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations complete.');

  await client.end();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
