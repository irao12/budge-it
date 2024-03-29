const express = require("express");
const router = express.Router();

// Load each controller
const authController = require("./auth.js");
const budgetController = require("./budget.js");
const expenditureController = require("./expenditure.js");

// Mount each controller under a specific route. These
// will be prefixes to all routes defined inside the controller
router.use("/auth", authController);
router.use("/budget", budgetController);
router.use("/expenditure", expenditureController);

module.exports = router;
