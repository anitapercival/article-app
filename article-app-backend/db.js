const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "test.db"), (err) => {
  if (err) console.error("Failed to connect to DB:", err);
  else console.log("Connected to SQLite database");
});

module.exports = db;
