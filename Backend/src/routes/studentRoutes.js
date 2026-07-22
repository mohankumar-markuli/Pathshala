const express = require("express");
const router = express.Router();
const {
    getAllStudents,
    enrollStudent,
    updateStudentStatus,
    getGuardianChildren
} = require("../controllers/studentController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getAllStudents);
router.post("/", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN", "TEACHER"), enrollStudent);
router.patch("/:studentId/status", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN"), updateStudentStatus);
router.get("/guardian/children", authenticateToken, getGuardianChildren);

module.exports = router;
