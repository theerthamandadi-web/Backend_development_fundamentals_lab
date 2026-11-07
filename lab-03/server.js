const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

const dbPath = path.join(__dirname, "goodreads.db");
let db = null;

app.use(express.json());

// Allowed columns for SQL ORDER BY clause to avoid SQL injection
const ALLOWED_ORDER_BY = ["id", "title", "author", "price", "pages"];

// GET /books/ - Retrieve books with search, sort, pagination, and price-range filters
app.get("/books/", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = 10,
      offset = 0,
      min_price,
      max_price,
    } = request.query;

    // Validate and sanitize order_by column
    const orderByColumn = ALLOWED_ORDER_BY.includes(order_by.toLowerCase())
      ? order_by.toLowerCase()
      : "id";

    // Validate and sanitize order direction
    const orderDirection =
      order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Validate and sanitize pagination parameters
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

    // Build query with parameterised placeholders
    let getBooksQuery = `
      SELECT
        *
      FROM
        book
      WHERE
        title LIKE ?
    `;

    const queryParams = [`%${search_q}%`];

    // Price-range filter: min_price and/or max_price
    if (min_price !== undefined && max_price !== undefined) {
      getBooksQuery += ` AND price BETWEEN ? AND ?`;
      queryParams.push(Number(min_price), Number(max_price));
    } else if (min_price !== undefined) {
      getBooksQuery += ` AND price >= ?`;
      queryParams.push(Number(min_price));
    } else if (max_price !== undefined) {
      getBooksQuery += ` AND price <= ?`;
      queryParams.push(Number(max_price));
    }

    getBooksQuery += `
      ORDER BY
        ${orderByColumn} ${orderDirection}
      LIMIT ? OFFSET ?;
    `;

    queryParams.push(parsedLimit, parsedOffset);

    const booksArray = await db.all(getBooksQuery, queryParams);
    response.status(200).send(booksArray);
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// GET /books/:bookId/ - Retrieve a single book by ID
app.get("/books/:bookId/", async (request, response) => {
  try {
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
      response.status(404).send({ message: "Book Not Found" });
    } else {
      response.status(200).send(book);
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// POST /books/ - Add a new book with body validation
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validation 1: Title is required and non-empty
    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).send({
        message: "Invalid Request: title is required and must be a non-empty string",
      });
    }

    // Validation 2: Author is required and non-empty
    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).send({
        message: "Invalid Request: author is required and must be a non-empty string",
      });
    }

    // Validation 3: Price is required and must be numeric
    if (price === undefined || price === null || price === "") {
      return response.status(400).send({
        message: "Invalid Request: price is required",
      });
    }

    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return response.status(400).send({
        message: "Invalid Request: price must be a valid positive number",
      });
    }

    // Validation 4: Pages if provided must be numeric
    const parsedPages = pages !== undefined ? Number(pages) : 0;
    if (isNaN(parsedPages) || parsedPages < 0) {
      return response.status(400).send({
        message: "Invalid Request: pages must be a valid numeric value",
      });
    }

    const addBookQuery = `
      INSERT INTO
        book (title, author, price, pages)
      VALUES
        (?, ?, ?, ?);
    `;

    const dbResponse = await db.run(addBookQuery, [
      title.trim(),
      author.trim(),
      price,
      parsedPages,
    ]);

    response.status(201).send({
      message: "Book Added Successfully",
      bookId: dbResponse.lastID,
    });
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// PUT /books/:bookId/ - Update an existing book with validation
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    // Validation 1: Title is required and non-empty
    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).send({
        message: "Invalid Request: title is required and must be a non-empty string",
      });
    }

    // Validation 2: Author is required and non-empty
    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).send({
        message: "Invalid Request: author is required and must be a non-empty string",
      });
    }

    // Validation 3: Price is required and must be numeric
    if (price === undefined || price === null || price === "") {
      return response.status(400).send({
        message: "Invalid Request: price is required",
      });
    }

    if (typeof price !== "number" || isNaN(price) || price < 0) {
      return response.status(400).send({
        message: "Invalid Request: price must be a valid positive number",
      });
    }

    const parsedPages = pages !== undefined ? Number(pages) : 0;
    if (isNaN(parsedPages) || parsedPages < 0) {
      return response.status(400).send({
        message: "Invalid Request: pages must be a valid numeric value",
      });
    }

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
      title.trim(),
      author.trim(),
      price,
      parsedPages,
      bookId,
    ]);

    if (dbResponse.changes === 0) {
      response.status(404).send({ message: "Book Not Found" });
    } else {
      response.status(200).send({ message: "Book Updated Successfully" });
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// DELETE /books/:bookId/ - Delete a book by ID
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    const deleteBookQuery = `
      DELETE FROM
        book
      WHERE
        id = ?;
    `;

    const dbResponse = await db.run(deleteBookQuery, [bookId]);

    if (dbResponse.changes === 0) {
      response.status(404).send({ message: "Book Not Found" });
    } else {
      response.status(200).send({ message: "Book Deleted Successfully" });
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Catch-all route handler for unmatched routes
app.use((request, response) => {
  response.status(404).send({ message: "Route Not Found" });
});

// Initialize SQLite Database and start Express Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database Connected Successfully");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

module.exports = app;
