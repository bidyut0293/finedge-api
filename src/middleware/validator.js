const CustomError = require("../utils/customError");

module.exports = (req, res, next) => {
  const { type, amount, category } = req.body;

  if (!type || !amount || !category) {
    return next(new CustomError("All fields are required", 400));
  }

  if (!["income", "expense"].includes(type)) {
    return next(new CustomError("Invalid transaction type", 400));
  }

  if (amount <= 0) {
    return next(new CustomError("Amount must be greater than 0", 400));
  }

  next();
};