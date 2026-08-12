const express = require("express");

const router = express.Router();

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    markAttendance,
    getAttendance,
    getAttendanceByDate,
    getStudentsByClass,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

// ======================================
// Mark Attendance
// ======================================
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    markAttendance
);

// ======================================
// Get All Attendance
// ======================================
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getAttendance
);

// ======================================
// Get Attendance By Date & Class Subject
// Example:
// /api/attendance/date?class_subject_id=1&attendance_date=2026-08-06
// ======================================
router.get(
    "/date",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getAttendanceByDate
);

// ======================================
// Get Students of Class
// ======================================
router.get(
    "/class/:classId/students",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getStudentsByClass
);

// ======================================
// Update Attendance
// ======================================
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    updateAttendance
);

// ======================================
// Delete Attendance
// ======================================
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    deleteAttendance
);

module.exports = router;