import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3";
import type { RequestInput } from "@/lib/validation/requestSchema";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbInstance: sqlite3.Database | null = null;

function getDb(): sqlite3.Database {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbPath);
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }
  return dbInstance;
}

export function saveRequest(data: RequestInput): Promise<void> {
  const db = getDb();
  const createdAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO requests (name, email, description, created_at) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.description, createdAt],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}
