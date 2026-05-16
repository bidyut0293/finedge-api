# FinEdge - Personal Finance Management API

A RESTful API for personal finance management built with Node.js and Express.

## Features

- ✅ MVC Architecture
- ✅ REST APIs
- ✅ JWT Authentication
- ✅ Middleware (Logger, Error Handler, Validator, Auth, Rate Limiter)
- ✅ Error Handling
- ✅ Validation
- ✅ Cache Service
- ✅ Analytics Summary
- ✅ Async/Await
- ✅ File Persistence
- ✅ Testing
- ✅ CORS Support
- ✅ Reusable Services
- ✅ **AI-Powered Auto-Categorization**
- ✅ **Personalized Saving Tips**
- ✅ **Spending Trend Analysis**

## Project Structure

```
FinEdge/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── summaryRoutes.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── transactionController.js
│   │   └── summaryController.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── transactionService.js
│   │   ├── analyticsService.js
│   │   └── cacheService.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── validator.js
│   │   ├── errorHandler.js
│   │   ├── authMiddleware.js
│   │   └── rateLimiter.js
│   ├── utils/
│   │   ├── customError.js
│   │   └── fileHelper.js
│   ├── data/
│   │   ├── users.json
│   │   └── transactions.json
│   └── tests/
│       └── app.test.js
├── .env
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
PORT=5000
JWT_SECRET=supersecretkey
CACHE_TTL=60
```

## Running the Application

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Running Tests

```bash
npm test
```

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### User Routes
- `POST /users` - Register a new user

### Transaction Routes (Protected)
- `POST /transactions` - Create a new transaction
- `GET /transactions` - Get all transactions for the user
- `GET /transactions/:id` - Get a specific transaction
- `PATCH /transactions/:id` - Update a transaction
- `DELETE /transactions/:id` - Delete a transaction

### Summary Routes (Protected)
- `GET /summary` - Get financial summary with caching

## API Usage Examples

### Register User

```http
POST /users
Content-Type: application/json

{
  "name": "Bidyut",
  "email": "bidyut@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Bidyut",
      "email": "bidyut@example.com",
      "password": "hashed_password"
    },
    "token": "jwt_token"
  }
}
```

### Add Transaction

```http
POST /transactions
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "type": "expense",
  "category": "Food",
  "amount": 500,
  "date": "2026-05-15"
}
```

### Get Summary

```http
GET /summary
Authorization: Bearer TOKEN
```