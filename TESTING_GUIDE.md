# FinEdge API Testing Guide

This guide provides comprehensive instructions for testing the FinEdge Personal Finance Management API using both automated tests and manual testing with Postman.

## Table of Contents

- [Automated Testing](#automated-testing)
- [Manual Testing with Postman](#manual-testing-with-postman)
- [API Endpoints Reference](#api-endpoints-reference)
- [Common Test Scenarios](#common-test-scenarios)
- [Troubleshooting](#troubleshooting)

---

## Automated Testing

The project includes a comprehensive test suite with **27 automated tests** using Jest and Supertest.

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (re-runs on file changes):**
```bash
npm test -- --watch
```

**Run a specific test:**
```bash
npm test -- -t "should register a new user successfully"
```

**Run tests with verbose output:**
```bash
npm test -- --verbose
```

### Test Coverage

The automated test suite covers:

1. **Health Check (1 test)**
   - Verifies API is running

2. **User Registration (5 tests)**
   - Successful registration with valid data
   - Registration with minimal data
   - Handling missing name field
   - Handling missing email field
   - Failure with missing password field

3. **Transaction Routes - Authenticated (15 tests)**
   - Authentication requirements (no token, invalid token)
   - Creating transactions with valid/invalid data
   - Validation tests (missing fields, invalid types, negative/zero amounts)
   - Retrieving all transactions
   - Retrieving specific transactions
   - Updating transactions
   - Deleting transactions
   - Handling non-existent transactions

4. **Summary Route - Authenticated (2 tests)**
   - Authentication requirements
   - Financial summary generation

5. **Error Handling (2 tests)**
   - 404 for non-existent routes
   - Invalid JSON handling

6. **Rate Limiting (1 test)**
   - Multiple request handling

### Test Structure

Tests are located in `src/tests/app.test.js` and include:

- **Setup/Teardown**: Automatically resets data files before and after tests
- **Authentication**: Tests token generation and usage
- **Validation**: Tests input validation for all endpoints
- **Error Scenarios**: Tests proper error handling and status codes

---

## Manual Testing with Postman

### Step 1: Start the Server

```bash
npm start
```

The server runs on `http://localhost:5000`

### Step 2: Test Health Endpoint

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/health`

**Expected Response:**
```json
{
  "success": true,
  "message": "FinEdge API running"
}
```

### Step 3: Register a User

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/users`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "hashed_password"
    },
    "token": "jwt_token_here"
  }
}
```

**Important:** Save the `token` from the response for authenticated requests.

### Step 4: Create a Transaction (Authenticated)

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/transactions`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- Body (JSON):
```json
{
  "type": "expense",
  "amount": 100.50,
  "category": "Food",
  "date": "2024-01-15",
  "description": "Lunch"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user_uuid",
    "type": "expense",
    "amount": 100.5,
    "category": "Food",
    "date": "2024-01-15",
    "description": "Lunch",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Step 5: Get All Transactions

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/transactions`
- Headers: `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user_uuid",
      "type": "expense",
      "amount": 100.5,
      "category": "Food",
      "date": "2024-01-15",
      "description": "Lunch",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

### Step 6: Get Financial Summary

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/summary`
- Headers: `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "totalIncome": 0,
    "totalExpenses": 100.5,
    "balance": -100.5
  }
}
```

### Step 7: Update a Transaction

**Request:**
- Method: `PATCH`
- URL: `http://localhost:5000/transactions/TRANSACTION_ID`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- Body (JSON):
```json
{
  "amount": 150.75,
  "description": "Updated lunch description"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user_uuid",
    "type": "expense",
    "amount": 150.75,
    "category": "Food",
    "date": "2024-01-15",
    "description": "Updated lunch description",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Step 8: Delete a Transaction

**Request:**
- Method: `DELETE`
- URL: `http://localhost:5000/transactions/TRANSACTION_ID`
- Headers: `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted"
}
```

---

## API Endpoints Reference

### Authentication & Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Register new user | No |
| GET | `/health` | Health check | No |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/transactions` | Create transaction | Yes |
| GET | `/transactions` | Get all transactions | Yes |
| GET | `/transactions/:id` | Get specific transaction | Yes |
| PATCH | `/transactions/:id` | Update transaction | Yes |
| DELETE | `/transactions/:id` | Delete transaction | Yes |

### Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/summary` | Get financial summary | Yes |

---

## Common Test Scenarios

### 1. Test Authentication

**Without Token:**
```bash
curl http://localhost:5000/transactions
```
Expected: `401 Unauthorized` with message "No token provided"

**With Invalid Token:**
```bash
curl -H "Authorization: Bearer invalidtoken" http://localhost:5000/transactions
```
Expected: `401 Unauthorized` with message "Invalid token"

### 2. Test Validation

**Missing Required Fields:**
```json
{
  "type": "expense"
}
```
Expected: `400 Bad Request` with message "All fields are required"

**Invalid Transaction Type:**
```json
{
  "type": "invalid",
  "amount": 100,
  "category": "Test"
}
```
Expected: `400 Bad Request` with message "Invalid transaction type"

**Negative Amount:**
```json
{
  "type": "expense",
  "amount": -100,
  "category": "Test"
}
```
Expected: `400 Bad Request` with message "Amount must be greater than 0"

**Zero Amount:**
```json
{
  "type": "income",
  "amount": 0,
  "category": "Test"
}
```
Expected: `400 Bad Request` with message "All fields are required"

### 3. Test Data Persistence

1. Create a transaction
2. Stop the server (`Ctrl+C`)
3. Start the server again
4. Retrieve transactions
5. Verify the transaction still exists

### 4. Test User Isolation

1. Register User A and get token
2. Create transactions as User A
3. Register User B and get token
4. Retrieve transactions as User B
5. Verify User B cannot see User A's transactions

---

## Troubleshooting

### Server Won't Start

**Issue:** Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

**Issue:** Missing dependencies
```bash
npm install
```

**Issue:** Environment variables not loaded
Check `.env` file exists with:
```
PORT=5000
JWT_SECRET=supersecretkey
CACHE_TTL=60
```

### Tests Failing

**Issue:** Environment variables not loaded in tests
The test file includes `require("dotenv").config()` at the top.

**Issue:** Data files corrupted
Reset data files:
```bash
echo "[]" > src/data/users.json
echo "[]" > src/data/transactions.json
```

**Issue:** Port already in use during tests
Tests use Supertest and don't require the server to be running on a port.

### Postman Issues

**Issue:** "Could not get any response"
- Make sure the server is running (`npm start`)
- Check the URL is correct: `http://localhost:5000`
- Verify no firewall is blocking port 5000

**Issue:** 401 Unauthorized errors
- Ensure you're including the Authorization header
- Format: `Bearer YOUR_TOKEN_HERE` (note the space after "Bearer")
- Token might be expired (tokens expire in 1 day)

**Issue:** 500 Internal Server Error
- Check the server console for error messages
- Verify JSON body is valid (no trailing commas, proper quotes)
- Ensure all required fields are included

### Common Error Responses

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Missing fields, invalid data, validation failed |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Transaction ID doesn't exist, route doesn't exist |
| 500 | Internal Server Error | Server error, check console logs |

---

## Additional Resources

- **Project README**: `README.md` - General project information
- **Test File**: `src/tests/app.test.js` - Full test suite source code
- **API Documentation**: See endpoint reference above

## Support

If you encounter issues not covered in this guide:

1. Check the server console for error messages
2. Verify your request format matches the examples
3. Ensure all dependencies are installed (`npm install`)
4. Check that the `.env` file is properly configured

Happy Testing! 🚀