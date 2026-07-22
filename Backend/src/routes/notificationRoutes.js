const express = require("express");
const router = express.Router();
const { getNotifications, createNotification } = require("../controllers/notificationController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getNotifications);
router.post("/", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN", "TEACHER"), createNotification);

module.exports = router;
