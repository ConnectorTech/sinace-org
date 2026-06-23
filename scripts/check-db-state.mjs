import mysql from "mysql2/promise";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [tables] = await connection.query(`
  SELECT table_name AS tableName
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
  ORDER BY table_name
`);

const targetTables = [
  "governmentContracts",
  "institutionSpecialties",
  "patientQueueEntries",
  "professionalProfiles",
  "surgicalTeamMembers",
  "surgicalTeams",
  "institutions",
  "specialties",
  "partners",
  "__drizzle_migrations",
];

for (const tableName of targetTables) {
  const exists = tables.some(table => table.tableName === tableName);
  console.log(`TABLE ${tableName}: ${exists ? "exists" : "missing"}`);

  if (!exists) continue;

  const [columns] = await connection.query(
    `SELECT column_name AS columnName, column_type AS columnType
       FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ?
      ORDER BY ordinal_position`,
    [tableName]
  );
  console.log(columns.map(column => `${column.columnName}:${column.columnType}`).join(", "));
}

const [createRows] = await connection.query("SHOW CREATE TABLE __drizzle_migrations");
console.log("CREATE_TABLE __drizzle_migrations:");
console.log(createRows[0]["Create Table"]);

const [rows] = await connection.query("SELECT * FROM __drizzle_migrations ORDER BY created_at");
console.log("DB_MIGRATIONS:");
console.log(JSON.stringify(rows, null, 2));

const drizzleDir = path.resolve("./drizzle");
const fileNames = (await fs.readdir(drizzleDir))
  .filter(name => name.endsWith(".sql"))
  .sort();

const localMigrations = [];
for (const fileName of fileNames) {
  const content = await fs.readFile(path.join(drizzleDir, fileName));
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  localMigrations.push({ fileName, hash });
}

console.log("LOCAL_MIGRATIONS:");
console.log(JSON.stringify(localMigrations, null, 2));

await connection.end();
