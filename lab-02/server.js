const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get("/", (request, response) => {
  response.send("Book Store API is running.");
});

app.get(["/books/", "/books"], async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id ASC;
    `;
    const booksArray = await db.all(getBooksQuery);
    response.json(booksArray);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get(["/books/:bookId/", "/books/:bookId"], async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    response.json(book);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


app.post(["/books/", "/books"], async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);

    response.status(201).json({
      message: "Book Successfully Added",
      bookId: dbResponse.lastID,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.put(["/books/:bookId/", "/books/:bookId"], async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title || existingBook.title,
      author || existingBook.author,
      price !== undefined ? price : existingBook.price,
      pages !== undefined ? pages : existingBook.pages,
      bookId,
    ]);

    response.json({ message: "Book Details Updated Successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.delete(["/books/:bookId/", "/books/:bookId"], async (request, response) => {
  try {
    const { bookId } = request.params;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);

    response.json({ message: "Book Deleted Successfully" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = app;

