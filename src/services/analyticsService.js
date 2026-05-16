function calculateSummary(transactions) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance: income - expenses
  };
}

function filterByCategory(transactions, category) {
  return transactions.filter(t => 
    t.category.toLowerCase() === category.toLowerCase()
  );
}

function filterByDateRange(transactions, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= start && transactionDate <= end;
  });
}

function calculateMonthlyTrends(transactions) {
  const monthlyData = {};
  
  transactions.forEach(t => {
    const month = t.date ? t.date.substring(0, 7) : "unknown";
    
    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        income: 0,
        expenses: 0,
        balance: 0
      };
    }
    
    if (t.type === "income") {
      monthlyData[month].income += t.amount;
    } else if (t.type === "expense") {
      monthlyData[month].expenses += t.amount;
    }
    
    monthlyData[month].balance = 
      monthlyData[month].income - monthlyData[month].expenses;
  });
  
  return Object.values(monthlyData).sort((a, b) => 
    a.month.localeCompare(b.month)
  );
}

function getCategoryBreakdown(transactions) {
  const categoryData = {};
  
  transactions.forEach(t => {
    const category = t.category || "Uncategorized";
    
    if (!categoryData[category]) {
      categoryData[category] = {
        category,
        income: 0,
        expenses: 0,
        total: 0
      };
    }
    
    if (t.type === "income") {
      categoryData[category].income += t.amount;
    } else if (t.type === "expense") {
      categoryData[category].expenses += t.amount;
    }
    
    categoryData[category].total = 
      categoryData[category].income - categoryData[category].expenses;
  });
  
  return Object.values(categoryData);
}

module.exports = {
  calculateSummary,
  filterByCategory,
  filterByDateRange,
  calculateMonthlyTrends,
  getCategoryBreakdown
};
