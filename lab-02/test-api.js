/**
 * Lab 2 Automated Test Script
 * Verifies all CRUD endpoints against a running server at http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log(`Starting automated tests against ${BASE_URL}...\n`);

  const tests = [
    {
      name: 'Route A: GET /books/ (Retrieve all books)',
      method: 'GET',
      url: `${BASE_URL}/books/`,
      expectedStatus: 200
    },
    {
      name: 'Route B: GET /books/1/ (Retrieve single book by ID)',
      method: 'GET',
      url: `${BASE_URL}/books/1/`,
      expectedStatus: 200
    },
    {
      name: 'Route C: POST /books/ (Create new book)',
      method: 'POST',
      url: `${BASE_URL}/books/`,
      body: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 550,
        pages: 464
      },
      expectedStatus: 201
    },
    {
      name: 'Route D: PUT /books/2/ (Update book details)',
      method: 'PUT',
      url: `${BASE_URL}/books/2/`,
      body: {
        title: 'The Alchemist (Special Edition)',
        author: 'Paulo Coelho',
        price: 350,
        pages: 220
      },
      expectedStatus: 200
    },
    {
      name: 'Route E: DELETE /books/10/ (Delete book by ID)',
      method: 'DELETE',
      url: `${BASE_URL}/books/10/`,
      expectedStatus: 200
    },
    {
      name: 'Error Case: GET /books/999/ (Nonexistent ID)',
      method: 'GET',
      url: `${BASE_URL}/books/999/`,
      expectedStatus: 404
    },
    {
      name: 'Error Case: GET /books/abc/ (Invalid ID format)',
      method: 'GET',
      url: `${BASE_URL}/books/abc/`,
      expectedStatus: 400
    },
    {
      name: 'Error Case: POST /books/ (Missing required fields)',
      method: 'POST',
      url: `${BASE_URL}/books/`,
      body: { title: 'No Author Book' },
      expectedStatus: 400
    },
    {
      name: 'Error Case: GET /invalid-endpoint/ (404 Not Found)',
      method: 'GET',
      url: `${BASE_URL}/invalid-endpoint/`,
      expectedStatus: 404
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const res = await fetch(test.url, options);
      const text = await res.text();
      const statusMatch = res.status === test.expectedStatus;

      if (statusMatch) {
        console.log(`[PASS] ${test.name} -> Status: ${res.status}`);
        passed++;
      } else {
        console.error(`[FAIL] ${test.name} -> Expected ${test.expectedStatus}, got ${res.status}`);
        console.error(`       Response: ${text}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${test.name}: Connection failed (${err.message}). Is the server running?`);
      failed++;
    }
  }

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed out of ${tests.length} tests.`);
}

runTests();

