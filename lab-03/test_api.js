const http = require("http");

const BASE_URL = "http://localhost:3000";

const makeRequest = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log("==================================================");
  console.log("       RUNNING LAB 03 REST API TEST SUITE        ");
  console.log("==================================================\n");

  const results = [];

  const test = async (name, fn) => {
    try {
      const res = await fn();
      console.log(`[PASS] ${name}`);
      results.push({ name, status: "PASS", res });
    } catch (err) {
      console.error(`[FAIL] ${name} -> ${err.message}`);
      results.push({ name, status: "FAIL", error: err.message });
    }
  };

  // Test 1: GET All Books Default
  await test("1. GET /books/ (Default Params)", async () => {
    const res = await makeRequest("GET", "/books/");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.body)) throw new Error("Expected array");
    console.log(`   Count: ${res.body.length} books returned`);
    return res;
  });

  // Test 2: GET with search_q
  await test("2. GET /books/?search_q=The", async () => {
    const res = await makeRequest("GET", "/books/?search_q=The");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const matches = res.body.filter((b) => !b.title.toLowerCase().includes("the"));
    if (matches.length > 0) throw new Error("Results contain non-matching titles");
    console.log(`   Matches for 'The': ${res.body.map((b) => b.title).join(", ")}`);
    return res;
  });

  // Test 3: GET with order_by and order DESC
  await test("3. GET /books/?order_by=price&order=DESC", async () => {
    const res = await makeRequest("GET", "/books/?order_by=price&order=DESC");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    for (let i = 0; i < res.body.length - 1; i++) {
      if (res.body[i].price < res.body[i + 1].price) {
        throw new Error("Books not sorted descending by price");
      }
    }
    console.log(`   Top 3 highest prices: ${res.body.slice(0, 3).map((b) => `${b.title} (Rs ${b.price})`).join(", ")}`);
    return res;
  });

  // Test 4: GET with pagination limit & offset
  await test("4. GET /books/?limit=3&offset=0 (Page 1)", async () => {
    const res = await makeRequest("GET", "/books/?limit=3&offset=0");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.length !== 3) throw new Error(`Expected 3, got ${res.body.length}`);
    console.log(`   Page 1 IDs: ${res.body.map((b) => b.id).join(", ")}`);
    return res;
  });

  await test("5. GET /books/?limit=3&offset=3 (Page 2)", async () => {
    const res = await makeRequest("GET", "/books/?limit=3&offset=3");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.length !== 3) throw new Error(`Expected 3, got ${res.body.length}`);
    console.log(`   Page 2 IDs: ${res.body.map((b) => b.id).join(", ")}`);
    return res;
  });

  // Test 6: GET with price range filter
  await test("6. GET /books/?min_price=300&max_price=450", async () => {
    const res = await makeRequest("GET", "/books/?min_price=300&max_price=450");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const outOfRange = res.body.filter((b) => b.price < 300 || b.price > 450);
    if (outOfRange.length > 0) throw new Error("Records found outside 300-450 range");
    console.log(`   Books in [300, 450]: ${res.body.length} books`);
    return res;
  });

  // Test 7: Combined Filters
  await test("7. GET Combined Query (?search_q=o&min_price=300&order_by=price&order=ASC&limit=5)", async () => {
    const res = await makeRequest("GET", "/books/?search_q=o&min_price=300&order_by=price&order=ASC&limit=5");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    console.log(`   Returned: ${res.body.length} books sorted ascending by price`);
    return res;
  });

  // Test 8: GET single book 200
  await test("8. GET /books/1/ (Single Book Success)", async () => {
    const res = await makeRequest("GET", "/books/1/");
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.id !== 1) throw new Error(`Expected ID 1`);
    console.log(`   Book 1: ${res.body.title} by ${res.body.author}`);
    return res;
  });

  // Test 9: GET single book 404
  await test("9. GET /books/999/ (Book Not Found)", async () => {
    const res = await makeRequest("GET", "/books/999/");
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    if (res.body.message !== "Book Not Found") throw new Error(`Unexpected message: ${res.body.message}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return res;
  });

  // Test 10: POST create book 201
  let createdBookId = null;
  await test("10. POST /books/ (Create Book Success)", async () => {
    const newBook = {
      title: "Clean Code",
      author: "Robert C. Martin",
      price: 550,
      pages: 464,
    };
    const res = await makeRequest("POST", "/books/", newBook);
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    if (!res.body.bookId) throw new Error("Missing bookId in response");
    createdBookId = res.body.bookId;
    console.log(`   Created Book ID: ${createdBookId}, Response: ${JSON.stringify(res.body)}`);
    return res;
  });

  // Test 11: POST missing title 400
  await test("11. POST /books/ Missing Title (Validation 400)", async () => {
    const badBook = { author: "No Title Author", price: 300, pages: 200 };
    const res = await makeRequest("POST", "/books/", badBook);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    console.log(`   Validation rejection message: ${res.body.message}`);
    return res;
  });

  // Test 12: POST missing author 400
  await test("12. POST /books/ Missing Author (Validation 400)", async () => {
    const badBook = { title: "No Author Book", price: 300, pages: 200 };
    const res = await makeRequest("POST", "/books/", badBook);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    console.log(`   Validation rejection message: ${res.body.message}`);
    return res;
  });

  // Test 13: POST non-numeric price 400
  await test("13. POST /books/ Non-numeric Price (Validation 400)", async () => {
    const badBook = { title: "Price Test", author: "Tester", price: "three-hundred", pages: 200 };
    const res = await makeRequest("POST", "/books/", badBook);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    console.log(`   Validation rejection message: ${res.body.message}`);
    return res;
  });

  // Test 14: PUT update book 200
  await test("14. PUT /books/1/ (Update Book Success)", async () => {
    const updatedBook = {
      title: "Atomic Habits: An Easy & Proven Way",
      author: "James Clear",
      price: 499,
      pages: 320,
    };
    const res = await makeRequest("PUT", "/books/1/", updatedBook);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return res;
  });

  // Test 15: PUT update book 404
  await test("15. PUT /books/999/ (Update Non-existent Book 404)", async () => {
    const updatedBook = {
      title: "Ghost Book",
      author: "Nobody",
      price: 100,
      pages: 100,
    };
    const res = await makeRequest("PUT", "/books/999/", updatedBook);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return res;
  });

  // Test 16: DELETE book 200
  if (createdBookId) {
    await test(`16. DELETE /books/${createdBookId}/ (Delete Book Success)`, async () => {
      const res = await makeRequest("DELETE", `/books/${createdBookId}/`);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      console.log(`   Response: ${JSON.stringify(res.body)}`);
      return res;
    });
  }

  // Test 17: DELETE book 404
  await test("17. DELETE /books/999/ (Delete Non-existent Book 404)", async () => {
    const res = await makeRequest("DELETE", "/books/999/");
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return res;
  });

  console.log("\n==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log("==================================================");
};

runTests();
