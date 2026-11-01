const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

app.use(express.json());

app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      book
    ORDER BY
      id;
  `;

  const booksArray = await db.all(getBooksQuery);

  response.status(200).send(booksArray);
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const getBookQuery = `
    SELECT
      *
    FROM
      book
    WHERE
      id = ?;
  `;

  const book = await db.get(getBookQuery, [bookId]);

  if (book === undefined) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send(book);
  }
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?);
  `;

  const dbResponse = await db.run(addBookQuery, [
    title,
    author,
    price,
    pages,
  ]);

  response.status(201).send({
    message: "Book Added Successfully",
    bookId: dbResponse.lastID,
  });
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const updateBookQuery = `
    UPDATE
      book
    SET
      title = ?,
      author = ?,
      price = ?,
      pages = ?
    WHERE
      id = ?;
  `;

  const dbResponse = await db.run(updateBookQuery, [
    title,
    author,
    price,
    pages,
    bookId,
  ]);

  if (dbResponse.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send("Book Updated Successfully");
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      id = ?;
  `;

  const dbResponse = await db.run(deleteBookQuery, [bookId]);

  if (dbResponse.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.status(200).send("Book Deleted Successfully");
  }
});

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database Connected Successfully");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server Running at port ${PORT}`);
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();