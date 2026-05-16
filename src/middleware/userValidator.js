const CustomError = require("../utils/customError");

module.exports = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return next(new CustomError("Name, email, and password are required", 400));
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new CustomError("Invalid email format", 400));
  }
  
  if (password.length < 6) {
    return next(new CustomError("Password must be at least 6 characters", 400));
  }
  
  next();
};
