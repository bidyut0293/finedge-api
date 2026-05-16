const transactionService = require("../services/transactionService");
const {
  calculateSummary,
  filterByCategory,
  filterByDateRange,
  calculateMonthlyTrends,
  getCategoryBreakdown
} = require("../services/analyticsService");
const { getCache, setCache } = require("../services/cacheService");

exports.getSummary = async (req, res, next) => {
  try {
    const { category, startDate, endDate, includeTrends, includeCategories } = req.query;
    
    const cacheKey = `summary-${req.user.id}-${category || 'all'}-${startDate || ''}-${endDate || ''}`;

    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        cached: true,
        data: cached
      });
    }

    let transactions = await transactionService.getTransactions(req.user.id);

    // Apply filters
    if (category) {
      transactions = filterByCategory(transactions, category);
    }

    if (startDate && endDate) {
      transactions = filterByDateRange(transactions, startDate, endDate);
    }

    const summary = calculateSummary(transactions);
    
    // Add optional analytics
    const result = { ...summary };
    
    if (includeTrends === 'true') {
      result.monthlyTrends = calculateMonthlyTrends(transactions);
    }
    
    if (includeCategories === 'true') {
      result.categoryBreakdown = getCategoryBreakdown(transactions);
    }

    setCache(cacheKey, result, process.env.CACHE_TTL);

    res.json({
      success: true,
      cached: false,
      filters: { category, startDate, endDate },
      data: result
    });
  } catch (error) {
    next(error);
  }
};
