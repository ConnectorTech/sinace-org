import mysql from "mysql2/promise";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const migrationFileName = "0002_smiling_supernaut.sql";
const migrationCreatedAt = 1775847245113;

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const migrationPath = path.resolve("./drizzle", migrationFileName);
const content = await fs.readFile(migrationPath);
const hash = crypto.createHash("sha256").update(content).digest("hex");

const [existingRows] = await connection.query(
  "SELECT id, hash, created_at FROM __drizzle_migrations WHERE hash = ?",
  [hash]
);

if (existingRows.length > 0) {
  console.log(`MIGRATION_ALREADY_RECORDED ${hash}`);
  await connection.end();
  process.exit(0);
}

await connection.query(
  "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
  [hash, migrationCreatedAt]
);

console.log(`MIGRATION_RECORDED ${hash}`);
await connection.end();
