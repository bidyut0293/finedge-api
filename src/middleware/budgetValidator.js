const CustomError = require("../utils/customError");

module.exports = (req, res, next) => {
  const { monthlyGoal, savingsTarget, month } = req.body;
  
  if (!monthlyGoal || !savingsTarget || !month) {
    return next(new CustomError("All fields are required", 400));
  }
  
  if (monthlyGoal <= 0 || savingsTarget <= 0) {
    return next(new CustomError("Goals must be greater than 0", 400));
  }
  
  next();
};
