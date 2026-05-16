const budgetService = require("../services/budgetService");

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user.id);
    
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(req.params.id);
    
    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(req.params.id, req.body);
    
    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.params.id);
    
    res.json({
      success: true,
      message: "Budget deleted"
    });
  } catch (error) {
    next(error);
  }
};
