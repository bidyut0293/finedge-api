const express = require("express");
const router = express.Router();

const userValidator = require("../middleware/userValidator");
const { createUser } = require("../controllers/userController");

router.post("/", userValidator, createUser);

module.exports = router;
