import { mkdirSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DDL } from "@/db/ddl";
import * as schema from "@/db/schema";

export type AppDatabase = PgliteDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;

export type DatabaseHandle = {
  db: AppDatabase;
  driver: "pglite" | "postgres";
  close: () => Promise<void>;
};

let handle: DatabaseHandle | null = null;

function statements() {
  return DDL.split(";").map((item) => item.trim()).filter(Boolean);
}

export async function getDatabase(): Promise<DatabaseHandle> {
  if (handle) return handle;
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const sql = postgres(url, { max: 4 });
    for (const statement of statements()) await sql.unsafe(statement);
    handle = {
      db: drizzlePostgres(sql, { schema }),
      driver: "postgres",
      close: () => sql.end({ timeout: 5 }),
    };
    return handle;
  }
  const dir = path.resolve(process.cwd(), process.env.PGLITE_DIR || "data/pglite");
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await client.waitReady;
  for (const statement of statements()) await client.exec(statement);
  handle = {
    db: drizzlePglite(client, { schema }),
    driver: "pglite",
    close: () => client.close(),
  };
  return handle;
}
