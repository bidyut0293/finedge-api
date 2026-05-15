const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { readJSON, writeJSON } = require("../utils/fileHelper");
const CustomError = require("../utils/customError");

const transactionPath = path.join(
  __dirname,
  "../data/transactions.json"
);

async function addTransaction(data, userId) {
  const transactions = await readJSON(transactionPath);

  const newTransaction = {
    id: uuidv4(),
    userId,
    ...data,
    createdAt: new Date().toISOString()
  };

  transactions.push(newTransaction);

  await writeJSON(transactionPath, transactions);

  return newTransaction;
}

async function getTransactions(userId) {
  const transactions = await readJSON(transactionPath);

  return transactions.filter(t => t.userId === userId);
}

async function getTransactionById(id) {
  const transactions = await readJSON(transactionPath);

  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    throw new CustomError("Transaction not found", 404);
  }

  return transaction;
}

async function updateTransaction(id, data) {
  const transactions = await readJSON(transactionPath);

  const index = transactions.findIndex(t => t.id === id);

  if (index === -1) {
    throw new CustomError("Transaction not found", 404);
  }

  transactions[index] = {
    ...transactions[index],
    ...data
  };

  await writeJSON(transactionPath, transactions);

  return transactions[index];
}

async function deleteTransaction(id) {
  const transactions = await readJSON(transactionPath);

  const filtered = transactions.filter(t => t.id !== id);

  await writeJSON(transactionPath, filtered);

  return true;
}

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};