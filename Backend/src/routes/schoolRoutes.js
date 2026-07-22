const express = require("express");
const router = express.Router();
const {
    getAllSchools,
    createSchool,
    getSchoolById,
    updateApprovalStatus
} = require("../controllers/schoolController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getAllSchools);
router.post("/", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_OWNER"), createSchool);
router.get("/:id", authenticateToken, getSchoolById);
router.patch("/:id/approval", authenticateToken, authorizeRoles("SUPERADMIN"), updateApprovalStatus);

module.exports = router;
