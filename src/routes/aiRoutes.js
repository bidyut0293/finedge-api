const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getInsights, suggestCategory } = require("../controllers/aiController");

// All AI routes require authentication
router.use(authMiddleware);

// GET /ai/insights - Get AI-powered insights and saving tips
router.get("/insights", getInsights);

// POST /ai/categorize - Auto-categorize transaction description
router.post("/categorize", suggestCategory);

module.exports = router;
