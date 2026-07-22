const express = require("express");
const router = express.Router();
const {
    getGrievances,
    createGrievance,
    updateGrievanceStatus
} = require("../controllers/grievanceController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Public/Anonymous route to create grievance
router.post("/", createGrievance);

// Admin-protected routes
router.get("/", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN", "SCHOOL_OWNER"), getGrievances);
router.patch("/:grievanceId", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN"), updateGrievanceStatus);

module.exports = router;
