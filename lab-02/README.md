## Lab 2: SQLite Database and CRUD Routes

## Student information

- Name: Shaik Suheal 
- Registration number: 252U1R9145
- Section: S-26

## Deployment

- Live deployment URL: https://backend-development-fundamentals-lab.onrender.com/

## Project objective

Connect an Express.js server to an SQLite database and implement CRUD (Create, Read, Update, Delete) operations using HTTP routes. The server manages book records by retrieving all books, retrieving a particular book, adding new books, updating existing books, and deleting books.

## Prerequisites

- Node.js and npm installed on your computer. npm is included with Node.js.
- SQLite database and SQLite CLI.
- A web browser.
- Postman for testing API endpoints.
- A terminal such as PowerShell, Command Prompt, or the VS Code integrated terminal.
- Git and a GitHub account for submission.

To check that Node.js and npm are available, run:

```powershell
node --version
npm --version
```

To check SQLite CLI, run:

```powershell
sqlite3 --version
```

## Install and run

Open a terminal in this `lab-02` folder. If your terminal starts in the parent project folder, change to the lab folder first:

```powershell
cd "lab-02"
```

Install the dependencies listed in `package.json` and `package-lock.json`:

```powershell
npm install
```

If dependencies have not been installed yet, use:

```powershell
npm install express sqlite sqlite3
npm install --save-dev nodemon
```

Start the development server:

```powershell
npm run dev
```

The terminal should print the local server address:

```text
Server running on port 3000
```

Keep this terminal open while testing. Press **Ctrl+C** in it when you want to stop the server.

The server runs at:

```text
http://localhost:3000
```

## Database details

- Database name: `books.db`
- Table name: `book`

The book table contains the following columns:

| Column | Data type | Description |
|---|---|---|
| id | INTEGER PRIMARY KEY | Unique book ID |
| title | TEXT | Book title |
| author | TEXT | Author name |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

The database contains 10 sample book records inserted using the SQLite CLI.

To view the database records, run:

```powershell
sqlite3 books.db
```

Then execute:

```sql
SELECT * FROM book;
```

To exit SQLite:

```sql
.exit
```

## Endpoints

| HTTP method | URL path | Description | Expected status |
|---|---|---|---:|
| GET | `/books/` | Returns all books from the database. | 200 |
| GET | `/books/:bookId/` | Returns a particular book using its ID. | 200 |
| POST | `/books/` | Adds a new book to the database. | 201 |
| PUT | `/books/:bookId/` | Updates an existing book using its ID. | 200 |
| DELETE | `/books/:bookId/` | Deletes a book using its ID. | 200 |

If a requested book does not exist, the server returns a 404 response.

Invalid request data returns a 400 response.

## Test using Postman

With the server running, open Postman and test each endpoint.

### 1. GET all books

Method: GET

URL:

`http://localhost:3000/books/`

This endpoint returns all available books from the SQLite database.

### 2. GET a single book

Method: GET

URL:

`http://localhost:3000/books/1/`

This endpoint returns the book with ID 1.

### 3. POST a new book

Method: POST

URL:

`http://localhost:3000/books/`

Select **Body → raw → JSON** and enter:

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "price": 500,
  "pages": 352
}
```

This endpoint inserts a new book into the database.

### 4. PUT update a book

Method: PUT

URL:

`http://localhost:3000/books/1/`

Select **Body → raw → JSON** and enter:

```json
{
  "title": "Atomic Habits Updated",
  "author": "James Clear",
  "price": 475,
  "pages": 320
}
```

This endpoint updates the existing book details.

### 5. DELETE a book

Method: DELETE

URL:

`http://localhost:3000/books/11/`

Use the actual ID of the book you want to delete.

This endpoint removes the selected book from the database.

## Screenshots

### 1. GET All Books
![GET All Books](screenshots/get-all-books.png)

### 2. GET Single Book
![GET Single Book](screenshots/get-single-book.png)

### 3. POST - Add New Book
![POST Book](screenshots/post-book.png)

### 4. PUT - Update Book
![PUT Book](screenshots/put-book.png)

### 5. DELETE - Remove Book
![DELETE Book](screenshots/delete-book.png)
## Implementation details

- Used Express.js to create the backend server.
- Used SQLite to store book information.
- Used the `sqlite` and `sqlite3` packages to connect the database.
- Used an asynchronous `initializeDBAndServer()` function to connect the database before starting the server.
- Used parameterized SQL queries with `?` placeholders to prevent SQL injection.
- Used async/await to handle database operations.
- Implemented five CRUD endpoints.
- Tested the endpoints using Postman.

## Notes: problems faced and solutions

Record the actual issues encountered while completing the lab and how they were resolved.

Examples:

- Problem: SQLite database connection failed.
- Solution: Checked the database file path and verified the SQLite configuration.

- Problem: API returned a 404 response for a book.
- Solution: Checked the book ID and verified that the record existed in the database.

- Problem: Server did not restart automatically after code changes.
- Solution: Used Nodemon to restart the server automatically.

## Conclusion

Successfully connected an Express.js server with an SQLite database and implemented all five CRUD operations. Tested the API endpoints using Postman and verified that the database records could be created, retrieved, updated, and deleted.
