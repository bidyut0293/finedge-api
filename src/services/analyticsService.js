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

module.exports = {
  calculateSummary
};