const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/fileHelper");
const CustomError = require("../utils/customError");

const budgetPath = path.join(__dirname, "../data/budgets.json");

async function createBudget(data, userId) {
  const budgets = await readJSON(budgetPath);
  
  const newBudget = {
    id: uuidv4(),
    userId,
    monthlyGoal: data.monthlyGoal,
    savingsTarget: data.savingsTarget,
    month: data.month,
    createdAt: new Date().toISOString()
  };
  
  budgets.push(newBudget);
  await writeJSON(budgetPath, budgets);
  
  return newBudget;
}

async function getBudgets(userId) {
  const budgets = await readJSON(budgetPath);
  return budgets.filter(b => b.userId === userId);
}

async function getBudgetById(id) {
  const budgets = await readJSON(budgetPath);
  const budget = budgets.find(b => b.id === id);
  
  if (!budget) {
    throw new CustomError("Budget not found", 404);
  }
  
  return budget;
}

async function updateBudget(id, data) {
  const budgets = await readJSON(budgetPath);
  const index = budgets.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new CustomError("Budget not found", 404);
  }
  
  budgets[index] = {
    ...budgets[index],
    ...data
  };
  
  await writeJSON(budgetPath, budgets);
  return budgets[index];
}

async function deleteBudget(id) {
  const budgets = await readJSON(budgetPath);
  const filtered = budgets.filter(b => b.id !== id);
  await writeJSON(budgetPath, filtered);
  return true;
}

module.exports = {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget
};
