const transactionService = require("../services/transactionService");

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.addTransaction(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(
      req.user.id
    );

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id
    );

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id);

    res.json({
      success: true,
      message: "Transaction deleted"
    });
  } catch (error) {
    next(error);
  }
};