const transactionService = require("../services/transactionService");
const budgetService = require("../services/budgetService");
const {
  autoCategorizeExpense,
  generateSavingTips,
  analyzeSpendingTrends
} = require("../services/aiService");

/**
 * Get AI-powered insights and saving tips
 */
exports.getInsights = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user's transactions
    const transactions = await transactionService.getTransactions(userId);
    
    // Get user's budgets (if any)
    const budgets = await budgetService.getBudgets(userId);
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentBudget = budgets.find(b => b.month === currentMonth);
    
    // Generate saving tips
    const savingTips = generateSavingTips(transactions, currentBudget);
    
    // Analyze spending trends
    const spendingTrends = analyzeSpendingTrends(transactions);
    
    res.json({
      success: true,
      data: {
        savingTips: savingTips.tips,
        insights: savingTips.insights,
        trends: spendingTrends.trends,
        monthlyData: spendingTrends.monthlyData,
        currentBudget: currentBudget || null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Auto-categorize a transaction description
 */
exports.suggestCategory = async (req, res, next) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }
    
    const suggestedCategory = autoCategorizeExpense(description);
    
    res.json({
      success: true,
      data: {
        description,
        suggestedCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInsights: exports.getInsights,
  suggestCategory: exports.suggestCategory
};
