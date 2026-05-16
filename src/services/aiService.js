// AI and Automation Service for FinEdge API

// Category keywords mapping for auto-categorization
const categoryKeywords = {
  Food: ['restaurant', 'food', 'grocery', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'snack', 'pizza', 'burger', 'meal'],
  Transportation: ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'fuel', 'gas', 'parking', 'toll', 'car', 'bike'],
  Shopping: ['amazon', 'flipkart', 'mall', 'store', 'shop', 'clothing', 'shoes', 'electronics', 'gadget'],
  Entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'theatre', 'music', 'streaming'],
  Healthcare: ['hospital', 'doctor', 'medicine', 'pharmacy', 'clinic', 'medical', 'health', 'dental'],
  Utilities: ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'bill', 'utility'],
  Education: ['school', 'college', 'university', 'course', 'book', 'tuition', 'training', 'class'],
  Travel: ['hotel', 'flight', 'airbnb', 'vacation', 'trip', 'tour', 'booking'],
  Fitness: ['gym', 'yoga', 'fitness', 'sports', 'exercise', 'workout'],
  Other: []
};

/**
 * Auto-categorize expense based on description using keyword matching
 * @param {string} description - Transaction description
 * @returns {string} - Suggested category
 */
function autoCategorizeExpense(description) {
  if (!description) return 'Other';
  
  const lowerDesc = description.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue;
    
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
}

/**
 * Generate saving tips based on spending patterns
 * @param {Array} transactions - User's transactions
 * @param {Object} budget - User's budget (optional)
 * @returns {Object} - Saving tips and insights
 */
function generateSavingTips(transactions, budget = null) {
  const tips = [];
  const insights = {};
  
  // Calculate spending by category
  const categorySpending = {};
  let totalExpenses = 0;
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const category = t.category || 'Other';
      categorySpending[category] = (categorySpending[category] || 0) + t.amount;
      totalExpenses += t.amount;
    }
  });
  
  // Find highest spending category
  let highestCategory = null;
  let highestAmount = 0;
  
  for (const [category, amount] of Object.entries(categorySpending)) {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = category;
    }
  }
  
  insights.totalExpenses = totalExpenses;
  insights.categorySpending = categorySpending;
  insights.highestSpendingCategory = highestCategory;
  insights.highestSpendingAmount = highestAmount;
  
  // Generate tips based on spending patterns
  if (highestCategory && highestAmount > 0) {
    const percentage = ((highestAmount / totalExpenses) * 100).toFixed(1);
    tips.push({
      type: 'high_spending',
      category: highestCategory,
      message: `You're spending ${percentage}% of your budget on ${highestCategory}. Consider reducing expenses in this category.`,
      amount: highestAmount
    });
  }
  
  // Check against budget if provided
  if (budget && budget.monthlyGoal) {
    const remaining = budget.monthlyGoal - totalExpenses;
    const percentUsed = ((totalExpenses / budget.monthlyGoal) * 100).toFixed(1);
    
    if (percentUsed > 90) {
      tips.push({
        type: 'budget_alert',
        message: `Warning! You've used ${percentUsed}% of your monthly budget. Only ₹${remaining.toFixed(2)} remaining.`,
        severity: 'high'
      });
    } else if (percentUsed > 75) {
      tips.push({
        type: 'budget_warning',
        message: `You've used ${percentUsed}% of your monthly budget. Consider tracking your expenses more carefully.`,
        severity: 'medium'
      });
    } else if (percentUsed < 50) {
      tips.push({
        type: 'budget_positive',
        message: `Great job! You've only used ${percentUsed}% of your monthly budget. Keep up the good work!`,
        severity: 'low'
      });
    }
    
    // Savings target check
    if (budget.savingsTarget) {
      const potentialSavings = remaining;
      if (potentialSavings >= budget.savingsTarget) {
        tips.push({
          type: 'savings_goal',
          message: `Excellent! You're on track to meet your savings target of ₹${budget.savingsTarget}. Current potential savings: ₹${potentialSavings.toFixed(2)}`,
          severity: 'positive'
        });
      } else {
        const shortfall = budget.savingsTarget - potentialSavings;
        tips.push({
          type: 'savings_goal',
          message: `You need to save ₹${shortfall.toFixed(2)} more to reach your savings target of ₹${budget.savingsTarget}.`,
          severity: 'medium'
        });
      }
    }
  }
  
  // Category-specific tips
  if (categorySpending.Food && categorySpending.Food > 10000) {
    tips.push({
      type: 'category_tip',
      category: 'Food',
      message: 'Consider meal planning and cooking at home to reduce food expenses.',
      potentialSavings: (categorySpending.Food * 0.3).toFixed(2)
    });
  }
  
  if (categorySpending.Entertainment && categorySpending.Entertainment > 5000) {
    tips.push({
      type: 'category_tip',
      category: 'Entertainment',
      message: 'Look for free or low-cost entertainment alternatives to reduce spending.',
      potentialSavings: (categorySpending.Entertainment * 0.4).toFixed(2)
    });
  }
  
  if (categorySpending.Shopping && categorySpending.Shopping > 15000) {
    tips.push({
      type: 'category_tip',
      category: 'Shopping',
      message: 'Try the 30-day rule: wait 30 days before making non-essential purchases.',
      potentialSavings: (categorySpending.Shopping * 0.25).toFixed(2)
    });
  }
  
  // General savings tips
  if (tips.length === 0) {
    tips.push({
      type: 'general',
      message: 'Your spending looks balanced! Continue tracking your expenses to maintain financial health.',
      severity: 'positive'
    });
  }
  
  return {
    tips,
    insights,
    totalTips: tips.length
  };
}

/**
 * Analyze spending trends and provide recommendations
 * @param {Array} transactions - User's transactions
 * @returns {Object} - Spending analysis
 */
function analyzeSpendingTrends(transactions) {
  const monthlyData = {};
  
  transactions.forEach(t => {
    if (t.type === 'expense' && t.date) {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          total: 0,
          count: 0,
          categories: {}
        };
      }
      monthlyData[month].total += t.amount;
      monthlyData[month].count += 1;
      
      const category = t.category || 'Other';
      monthlyData[month].categories[category] = 
        (monthlyData[month].categories[category] || 0) + t.amount;
    }
  });
  
  const months = Object.keys(monthlyData).sort();
  const trends = [];
  
  // Compare current month with previous month
  if (months.length >= 2) {
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const currentTotal = monthlyData[currentMonth].total;
    const previousTotal = monthlyData[previousMonth].total;
    
    const change = currentTotal - previousTotal;
    const percentChange = ((change / previousTotal) * 100).toFixed(1);
    
    if (change > 0) {
      trends.push({
        type: 'spending_increase',
        message: `Your spending increased by ₹${change.toFixed(2)} (${percentChange}%) compared to last month.`,
        recommendation: 'Review your recent expenses and identify areas where you can cut back.'
      });
    } else if (change < 0) {
      trends.push({
        type: 'spending_decrease',
        message: `Great! Your spending decreased by ₹${Math.abs(change).toFixed(2)} (${Math.abs(percentChange)}%) compared to last month.`,
        recommendation: 'Keep up the good work! Continue monitoring your expenses.'
      });
    }
  }
  
  return {
    monthlyData,
    trends,
    totalMonths: months.length
  };
}

module.exports = {
  autoCategorizeExpense,
  generateSavingTips,
  analyzeSpendingTrends,
  categoryKeywords
};
