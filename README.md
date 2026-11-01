# Backend Development Fundamentals - Lab Reports

Comprehensive laboratory experiments, implementations, and documentation for the **Backend Development Fundamentals** course.

---

## Student Information

- **Student Name:** Shaik Suheal
- **Registration Number:** 252U1R9145
- **Branch / Section:** CSE - Generative AI (2C 112)
- **Institution:** Aurora
- **Course:** Backend Development Fundamentals (Year II Term II)
- **Faculty:** Joel Prashanth D
- **GitHub Repository:** [Backend_development_fundamentals_lab](https://github.com/shaik-creator/Backend_development_fundamentals_lab)

---

## Lab Directory Index

| Lab | Title | Description | Technologies | Report Link |
| :---: | :--- | :--- | :--- | :---: |
| **Lab 01** | **Node.js and Express Server** | Introduction to backend servers using Node.js built-in `http` module and Express.js routing, status codes, and error handling. | Node.js, Express.js | [View Lab 01](./lab-01/) |
| **Lab 02** | **SQLite Database & CRUD Routes** | Relational database modeling, SQL DDL/DML, and RESTful CRUD API endpoints with parameterized queries using SQLite. | Node.js, Express.js, SQLite, sqlite3 | [View Lab 02](./lab-02/) |

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
│       ├── home.png
│       ├── about.png
│       ├── time.png
│       ├── not-found.png
│       └── error.png
└── lab-02/
    ├── .gitignore
    ├── server.js              # Express server with RESTful CRUD endpoints
    ├── books.db               # SQLite database file
    ├── init.sql               # SQL schema and seed records
    ├── seed.js                # Database initialization & seed script
    ├── package.json
    ├── package-lock.json
    ├── postman_collection.json# Postman API test collection
    ├── requests.http          # REST client query file
    ├── test-api.js            # Automated endpoint testing script
    ├── README.md
    └── screenshots/           # API response screenshots
        ├── get-all-books.png
        ├── get-single-book.png
        ├── post-book.png
        ├── put-book.png
        └── delete-book.png
```

---

## General Setup & Installation

Each lab experiment is self-contained within its respective directory. To set up and run any lab:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shaik-creator/Backend_development_fundamentals_lab.git
   cd Backend_development_fundamentals_lab
   ```

2. **Navigate into the desired lab directory:**
   ```bash
   cd lab-01   # or cd lab-02
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the server:**
   - **For Lab 01:**
     ```bash
     npm start        # Starts Express server
     # or: node server-http.js
     ```
   - **For Lab 02:**
     ```bash
     npm run seed     # Initialize and seed SQLite database
     npm run dev      # Start development server with nodemon
     # or: npm start
     ```

Refer to the individual `README.md` file in each lab directory for full experiment details, API endpoint specifications, review questions, and screenshots.
