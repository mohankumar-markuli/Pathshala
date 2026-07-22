const express = require("express");
const router = express.Router();
const {
    getAllClasses,
    createClass,
    updateSubjectTeacher,
    updateTimetable
} = require("../controllers/classController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getAllClasses);
router.post("/", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_OWNER", "SCHOOL_ADMIN"), createClass);
router.patch("/:classId/subjects", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN"), updateSubjectTeacher);
router.put("/:classId/timetable", authenticateToken, authorizeRoles("SUPERADMIN", "SCHOOL_ADMIN"), updateTimetable);

module.exports = router;
