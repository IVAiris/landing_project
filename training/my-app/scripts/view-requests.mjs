import path from "node:path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "data", "app.db");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (error) => {
  if (error) {
    console.error(`Не удалось открыть базу данных: ${dbPath}`);
    console.error(error.message);
    process.exit(1);
  }
});

db.all(
  "SELECT id, name, email, description, created_at FROM requests ORDER BY id ASC",
  [],
  (error, rows) => {
    if (error) {
      console.error("Не удалось прочитать заявки:", error.message);
      db.close();
      process.exit(1);
    }

    if (rows.length === 0) {
      console.log("Заявок пока нет.");
    } else {
      for (const row of rows) {
        console.log(
          `#${row.id} | ${row.name} | ${row.email} | ${row.description} | ${row.created_at}`
        );
      }
    }

    db.close();
  }
);
