const requests = {};

module.exports = (req, res, next) => {
  const ip = req.ip;

  if (!requests[ip]) {
    requests[ip] = {
      count: 1,
      time: Date.now()
    };
  } else {
    requests[ip].count += 1;
  }

  if (requests[ip].count > 100) {
    return res.status(429).json({
      message: "Too many requests"
    });
  }

  next();
};