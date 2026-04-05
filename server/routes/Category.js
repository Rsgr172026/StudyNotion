const express = require("express");
const router = express.Router();
const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/Category");

// Categories Routes
router.post("/createCategory", createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
