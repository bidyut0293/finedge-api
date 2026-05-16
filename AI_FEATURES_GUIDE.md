# AI & Automation Features Guide

## Overview

FinEdge API now includes AI-powered features to help users manage their finances more intelligently:

1. **Auto-Categorization** - Automatically categorize expenses based on description
2. **Saving Tips** - Get personalized saving recommendations based on spending patterns
3. **Spending Analysis** - Analyze trends and get insights

---

## Features

### 1. Auto-Categorization

Automatically categorizes expenses using keyword matching when creating transactions.

#### How It Works

When you create a transaction without specifying a category, the system analyzes the description and suggests an appropriate category.

**Supported Categories:**
- Food (restaurant, grocery, cafe, coffee, etc.)
- Transportation (uber, taxi, bus, fuel, etc.)
- Shopping (amazon, mall, clothing, etc.)
- Entertainment (movie, netflix, spotify, etc.)
- Healthcare (hospital, doctor, medicine, etc.)
- Utilities (electricity, water, internet, etc.)
- Education (school, course, book, etc.)
- Travel (hotel, flight, vacation, etc.)
- Fitness (gym, yoga, sports, etc.)
- Other (default)

#### Example Usage

**Create Transaction with Auto-Categorization:**

```bash
curl -X POST http://localhost:5000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "expense",
    "amount": 500,
    "date": "2026-05-15",
    "description": "Lunch at restaurant"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user-id",
    "type": "expense",
    "category": "Food",
    "amount": 500,
    "date": "2026-05-15",
    "description": "Lunch at restaurant",
    "createdAt": "2026-05-15T15:30:00.000Z"
  },
  "autoCategorized": true
}
```

**Manual Category Suggestion:**

```bash
curl -X POST http://localhost:5000/ai/categorize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Uber ride to office"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "description": "Uber ride to office",
    "suggestedCategory": "Transportation"
  }
}
```

---

### 2. AI-Powered Insights & Saving Tips

Get personalized financial insights and saving recommendations based on your spending patterns.

#### Endpoint

```
GET /ai/insights
```

#### Features

1. **Spending Analysis**
   - Total expenses by category
   - Highest spending category
   - Budget utilization percentage

2. **Personalized Saving Tips**
   - High spending alerts
   - Budget warnings
   - Category-specific recommendations
   - Savings goal tracking

3. **Trend Analysis**
   - Month-over-month spending comparison
   - Spending increase/decrease alerts
   - Historical spending patterns

#### Example Usage

```bash
curl -X GET http://localhost:5000/ai/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Response Example

```json
{
  "success": true,
  "data": {
    "savingTips": [
      {
        "type": "high_spending",
        "category": "Food",
        "message": "You're spending 35.5% of your budget on Food. Consider reducing expenses in this category.",
        "amount": 15000
      },
      {
        "type": "budget_warning",
        "message": "You've used 78.5% of your monthly budget. Consider tracking your expenses more carefully.",
        "severity": "medium"
      },
      {
        "type": "category_tip",
        "category": "Food",
        "message": "Consider meal planning and cooking at home to reduce food expenses.",
        "potentialSavings": "4500.00"
      },
      {
        "type": "savings_goal",
        "message": "You need to save ₹2500.00 more to reach your savings target of ₹10000.",
        "severity": "medium"
      }
    ],
    "insights": {
      "totalExpenses": 42300,
      "categorySpending": {
        "Food": 15000,
        "Transportation": 8000,
        "Shopping": 12000,
        "Entertainment": 7300
      },
      "highestSpendingCategory": "Food",
      "highestSpendingAmount": 15000
    },
    "trends": [
      {
        "type": "spending_increase",
        "message": "Your spending increased by ₹5200.00 (14.0%) compared to last month.",
        "recommendation": "Review your recent expenses and identify areas where you can cut back."
      }
    ],
    "monthlyData": {
      "2026-04": {
        "total": 37100,
        "count": 45,
        "categories": {
          "Food": 12000,
          "Transportation": 7500,
          "Shopping": 10000,
          "Entertainment": 7600
        }
      },
      "2026-05": {
        "total": 42300,
        "count": 52,
        "categories": {
          "Food": 15000,
          "Transportation": 8000,
          "Shopping": 12000,
          "Entertainment": 7300
        }
      }
    },
    "currentBudget": {
      "id": "budget-id",
      "userId": "user-id",
      "monthlyGoal": 50000,
      "savingsTarget": 10000,
      "month": "2026-05"
    }
  }
}
```

---

## Tip Types Explained

### 1. High Spending Alert
Identifies categories where you're spending the most money.

**Example:**
```json
{
  "type": "high_spending",
  "category": "Food",
  "message": "You're spending 35.5% of your budget on Food...",
  "amount": 15000
}
```

### 2. Budget Alerts
Warns you when you're approaching or exceeding your budget.

**Severity Levels:**
- **High** (>90% used): Urgent warning
- **Medium** (75-90% used): Caution
- **Low** (<50% used): Positive feedback

**Example:**
```json
{
  "type": "budget_alert",
  "message": "Warning! You've used 92.5% of your monthly budget...",
  "severity": "high"
}
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/ai/insights` | Get AI-powered insights and saving tips | ✅ Yes |
| POST | `/ai/categorize` | Suggest category for a description | ✅ Yes |
| POST | `/transactions` | Create transaction (auto-categorizes if no category) | ✅ Yes |

---

## Keyword Reference

### Food Keywords
restaurant, food, grocery, cafe, coffee, lunch, dinner, breakfast, snack, pizza, burger, meal

### Transportation Keywords
uber, lyft, taxi, bus, train, metro, fuel, gas, parking, toll, car, bike

### Shopping Keywords
amazon, flipkart, mall, store, shop, clothing, shoes, electronics, gadget

### Entertainment Keywords
movie, cinema, netflix, spotify, game, concert, theatre, music, streaming

### Healthcare Keywords
hospital, doctor, medicine, pharmacy, clinic, medical, health, dental

### Utilities Keywords
electricity, water, gas, internet, phone, mobile, bill, utility

### Education Keywords
school, college, university, course, book, tuition, training, class

### Travel Keywords
hotel, flight, airbnb, vacation, trip, tour, booking

### Fitness Keywords
gym, yoga, fitness, sports, exercise, workout

---
