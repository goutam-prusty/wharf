import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * A single, module-level connection pool shared across the app.
 *
 * Next.js can invoke server code many times within the same process (route
 * handlers, server actions, RSC renders); creating a new `postgres()` client
 * per call would exhaust connection limits almost immediately. We memoize
 * the client on `globalThis` in development to survive HMR reloads.
 */
declare global {
  var __wharfPostgresClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__wharfPostgresClient ??
  postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === 'production' ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (env.NODE_ENV !== 'production') {
  globalThis.__wharfPostgresClient = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;
