const express = require("express");
const router = express.Router();
const { login, getMe, seedData } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.post("/seed", seedData);

module.exports = router;
