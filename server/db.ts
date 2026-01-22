import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Fix SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
  // For local environments, explicitly parsing the password helps avoid driver parsing issues.
  password: (() => {
    // 1. Try to use standard URL parser first
    try {
      if (process.env.DATABASE_URL) {
        const url = new URL(process.env.DATABASE_URL);
        if (url.password) return decodeURIComponent(url.password);
      }
    } catch (e) {}

    // 2. Fallback to manual regex extraction for complex local strings
    const match = process.env.DATABASE_URL?.match(/:([^:@]+)@/);
    if (match) return decodeURIComponent(match[1]);
    
    // 3. Last resort: default local password from user's .env
    return '12345';
  })(),
  ssl: false,
});

export const db = drizzle(pool, { schema });
