const transactionService = require("../services/transactionService");
const { calculateSummary } = require("../services/analyticsService");
const { getCache, setCache } = require("../services/cacheService");

exports.getSummary = async (req, res, next) => {
  try {
    const cacheKey = `summary-${req.user.id}`;

    const cached = getCache(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        cached: true,
        data: cached
      });
    }

    const transactions = await transactionService.getTransactions(
      req.user.id
    );

    const summary = calculateSummary(transactions);

    setCache(cacheKey, summary, process.env.CACHE_TTL);

    res.json({
      success: true,
      cached: false,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};