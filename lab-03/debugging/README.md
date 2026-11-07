# Lab 03 Debugging Exercises: Analysis & Solutions

In this exercise, we diagnose and fix four common backend development errors commonly encountered when developing RESTful APIs with Node.js, Express, and SQLite.

---

### Bug 1: Port Conflict (`EADDRINUSE`)

#### 1. Symptom & Error Log
```text
node:events:497
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1898:16)
    at listenInCluster (node:net:1946:12)
    at Server.listen (node:net:2034:7)
    at ...
Emitted 'error' event on Server instance at:
    at emitErrorNT (node:net:1925:8)
```

#### 2. Root Cause
Another instance of Node.js or a different background service is already bound to port `3000`. When `app.listen(3000)` executes, the operating system rejects the socket binding because two processes cannot bind to the exact same TCP port simultaneously.

#### 3. How to Fix
1. **Configurable Port via Environment Variables**:
   Use `process.env.PORT` to dynamically allocate available ports:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```
2. **Graceful Error Handling**:
   Catch the `EADDRINUSE` error on the HTTP server instance:
   ```javascript
   const server = app.listen(PORT, () => {
     console.log(`Server Running at http://localhost:${PORT}/`);
   });
   server.on("error", (error) => {
     if (error.code === "EADDRINUSE") {
       console.error(`Port ${PORT} is already in use. Please terminate the process or change the port.`);
     }
   });
   ```
3. **Kill Conflicting Process**:
   In PowerShell on Windows:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
   ```

---

### Bug 2: Wrong Import Path (`MODULE_NOT_FOUND` / Incorrect DB Path)

#### 1. Symptom & Error Log
```text
node:internal/modules/cjs/loader:1252
  throw err;
  ^

Error: Cannot find module '../goodreads.db'
Require stack:
- C:\...\lab-03\server.js
```
or SQLite failing to locate the database file when executed from a different working directory:
```text
Database Error: SQLITE_CANTOPEN: unable to open database file
```

#### 2. Root Cause
- Attempting to `require()` an SQLite database file directly instead of using the SQLite driver.
- Using relative paths like `./goodreads.db` instead of `path.join(__dirname, "goodreads.db")`. When Node.js is executed from a parent or different directory, relative paths resolve against `process.cwd()` rather than the directory where `server.js` resides.

#### 3. How to Fix
1. Ensure SQLite driver and wrapper are imported correctly:
   ```javascript
   const { open } = require("sqlite");
   const sqlite3 = require("sqlite3");
   const path = require("path");
   ```
2. Construct the database file path reliably using Node's `__dirname`:
   ```javascript
   const dbPath = path.join(__dirname, "goodreads.db");
   ```

---

### Bug 3: Table-Name Typo (`SQLITE_ERROR: no such table`)

#### 1. Symptom & Error Log
```text
Database Error: SQLITE_ERROR: no such table: books
    at Database.all (C:\...\node_modules\sqlite3\...)
```

#### 2. Root Cause
The SQL query targeted `books` (plural), but the database schema created in `goodreads.db` named the table `book` (singular).

#### 3. How to Fix
Verify the database schema using SQLite CLI:
```bash
sqlite3 goodreads.db ".tables"
# Output: book
```
Update all queries in `server.js` to match the exact schema table name `book`:
```javascript
// BEFORE (Buggy):
const query = `SELECT * FROM books WHERE title LIKE ?;`;

// AFTER (Fixed):
const query = `SELECT * FROM book WHERE title LIKE ?;`;
```

---

### Bug 4: Missing `await` on Asynchronous Database Calls

#### 1. Symptom & Unintended Behavior
When invoking `GET /books/`:
```json
{}
```
The response returns an empty object `{}` with HTTP 200, or sends `Promise { <pending> }` to `response.send()`, or fails silently because the database call is asynchronous.

#### 2. Root Cause
Calling `db.all(query)` or `db.get(query)` without the `await` keyword returns an unresolved `Promise` object immediately:
```javascript
// BEFORE (Buggy):
app.get("/books/", async (request, response) => {
  const booksArray = db.all(getBooksQuery); // Missing await! Returns Promise { <pending> }
  response.status(200).send(booksArray);     // Sends {} because Promises serialize to {} in JSON
});
```

#### 3. How to Fix
Add the `await` keyword before `db.all()` and `db.get()`:
```javascript
// AFTER (Fixed):
app.get("/books/", async (request, response) => {
  const booksArray = await db.all(getBooksQuery, queryParams);
  response.status(200).send(booksArray);
});
```
