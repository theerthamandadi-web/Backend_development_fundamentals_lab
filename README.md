# Backend Development Fundamentals - Lab Reports

Comprehensive laboratory experiments, implementations, and documentation for the **Backend Development Fundamentals** course.

---

## Student Information

- **Student Name:** M THEERTHANANDH
- **Registration Number:** 252U1R9091
- **Branch / Section:** CSE - Generative AI (2B 111)
- **Institution:** Aurora
- **Course:** Backend Development Fundamentals (Year II Term II)
- **Faculty:** Joel Prashanth D
- **GitHub Repository:** [Backend_development_fundamentals_lab](https://github.com/theerthamandadi-web/Backend_development_fundamentals_lab)

---

## Lab Directory Index

| Lab | Title | Description | Technologies | Report Link |
| :---: | :--- | :--- | :--- | :---: |
| **Lab 01** | **Node.js and Express Server** | Introduction to backend servers using Node.js built-in `http` module and Express.js routing, status codes, and error handling. | Node.js, Express.js | [View Lab 01](./lab-01/) |
| **Lab 02** | **SQLite Database & CRUD Routes** | Relational database modeling, SQL DDL/DML, and RESTful CRUD API endpoints with parameterized queries using SQLite. | Node.js, Express.js, SQLite, sqlite3 | [View Lab 02](./lab-02/) |
| **Lab 03** | **REST API, Query Parameters, Validation & Debugging** | Advanced RESTful API with search (`search_q`), sorting, pagination (`limit`/`offset`), price-range filters, body validation, and debugging common errors. | Node.js, Express.js, SQLite, sqlite3, Postman | [View Lab 03](./lab-03/) |

---

## Repository Structure

```plaintext
Backend_development_fundamentals_lab/
├── .gitignore
├── README.md
├── lab-01/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── server-http.js         # Built-in Node http server
│   ├── server.js              # Express application server
│   └── screenshots/           # Endpoint response screenshots
├── lab-02/
│   ├── .gitignore
│   ├── server.js              # Express server with RESTful CRUD endpoints
│   ├── goodreads.db           # SQLite database file
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── screenshots/           # API response screenshots
└── lab-03/
    ├── .gitignore
    ├── server.js              # REST API with search, sort, pagination, validation
    ├── goodreads.db           # SQLite database file
    ├── package.json
    ├── postman_collection.json# Postman test collection (17 test cases)
    ├── test_api.js            # Automated regression test runner
    ├── README.md              # Detailed lab report and viva answers
    ├── debugging/
    │   └── README.md          # In-depth analysis of 4 debugging exercises
    └── screenshots/           # 17 visual proof screenshots (Postman & Terminal)
```

---

## General Setup & Installation

Each lab experiment is self-contained within its respective directory. To set up and run any lab:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theerthamandadi-web/Backend_development_fundamentals_lab.git
   cd Backend_development_fundamentals_lab
   ```

2. **Navigate into the desired lab directory:**
   ```bash
   cd lab-01   # or cd lab-02 or cd lab-03
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the server:**
   - **For Lab 01:**
     ```bash
     npm start        # Starts Express server
     ```
   - **For Lab 02:**
     ```bash
     npm run dev      # Start development server with nodemon
     # or: npm start
     ```
   - **For Lab 03:**
     ```bash
     npm start        # Starts Express server on port 3000
     npm test         # Runs automated 17-test verification suite
     ```

Refer to the individual `README.md` file in each lab directory for full experiment details, API endpoint specifications, review questions, and screenshots.
