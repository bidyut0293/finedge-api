const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validator = require("../middleware/validator");

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

router.use(authMiddleware);

router.post("/", validator, createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.patch("/:id", validator, updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;