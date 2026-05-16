const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const budgetValidator = require("../middleware/budgetValidator");
const {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget
} = require("../controllers/budgetController");

router.use(authMiddleware);

router.post("/", budgetValidator, createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudget);
router.patch("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
