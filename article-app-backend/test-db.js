const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'test.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// List all tables in the DB
db.all(`SELECT name FROM sqlite_master WHERE type='table';`, [], (err, tables) => {
  if (err) {
    console.error('Error fetching tables:', err.message);
  } else {
    console.log('Tables found in database:');
    tables.forEach(table => console.log(table.name));
  }
  db.close();
});
