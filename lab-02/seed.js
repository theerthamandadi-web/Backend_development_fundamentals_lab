const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "books.db");

const initialBooks = [
  ["Atomic Habits", "James Clear", 499, 320],
  ["The Alchemist", "Paulo Coelho", 299, 208],
  ["Wings of Fire", "A.P.J. Abdul Kalam", 350, 180],
  ["Deep Work", "Cal Newport", 450, 304],
  ["Rich Dad Poor Dad", "Robert Kiyosaki", 399, 336],
  ["Ikigai", "Hector Garcia", 320, 208],
  ["Think and Grow Rich", "Napoleon Hill", 250, 238],
  ["The Power of Habit", "Charles Duhigg", 420, 371],
  ["Zero to One", "Peter Thiel", 400, 224],
  ["Clean Code", "Robert C. Martin", 850, 464],
];

const seedDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const isReset = process.argv.includes("--reset");

    if (isReset) {
      await db.exec(`DROP TABLE IF EXISTS book;`);
      console.log("Existing 'book' table dropped due to --reset flag.");
    }

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    const countRow = await db.get(`SELECT COUNT(*) AS count FROM book;`);
    if (countRow && countRow.count > 0 && !isReset) {
      console.log(`Database already has ${countRow.count} records. Seeding skipped.`);
      console.log("Tip: Run 'node seed.js --reset' if you want to wipe and re-seed.");
      await db.close();
      return;
    }

    const insertQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;

    for (const book of initialBooks) {
      await db.run(insertQuery, book);
    }

    console.log("Successfully seeded 10 initial book records into 'books.db'.");
    await db.close();
  } catch (error) {
    console.error(`Seed Database Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
