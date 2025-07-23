const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "test.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error("Error opening database:", err.message);
  }
  console.log("Connected to the SQLite database.");
});

db.all(
  `SELECT name FROM sqlite_master WHERE type='table';`,
  [],
  (err, tables) => {
    if (err) {
      console.error("Error fetching tables:", err.message);
      db.close();
      return;
    }

    const tableNames = tables.map((t) => t.name);

    if (tableNames.length === 0) {
      console.log("No tables found.");
      db.close();
      return;
    }

    let count = 0;

    tableNames.forEach((table) => {
      db.all(`SELECT * FROM ${table};`, [], (err, rows) => {
        if (err) {
          console.error(
            `Error fetching data from table ${table}:`,
            err.message
          );
        } else {
          console.log(`\n--- ${table} (${rows.length} rows) ---`);
          console.table(rows);
        }

        count++;
        if (count === tableNames.length) {
          db.close();
        }
      });
    });
  }
);
