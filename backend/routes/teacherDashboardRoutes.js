const express = require("express");

const router = express.Router();

const { verifyToken } =
    require("../middleware/authMiddleware");


const {

    getTeacherDashboardStats,

    getTeacherStudentsByClass,

    getTeacherAttendanceOverview,

    getTeacherMarksPerformance,

    getTeacherSubjects,

    getTeacherClasses

} = require("../controllers/teacherDashboardController");


// ======================================================
// Dashboard Stats
// ======================================================

router.get(
    "/stats",
    verifyToken,
    getTeacherDashboardStats
);


// ======================================================
// Students By Class
// ======================================================

router.get(
    "/students-by-class",
    verifyToken,
    getTeacherStudentsByClass
);


// ======================================================
// Attendance
// ======================================================

router.get(
    "/attendance-overview",
    verifyToken,
    getTeacherAttendanceOverview
);


// ======================================================
// Marks Performance
// ======================================================

router.get(
    "/marks-performance",
    verifyToken,
    getTeacherMarksPerformance
);


// ======================================================
// My Subjects
// ======================================================

router.get(
    "/subjects",
    verifyToken,
    getTeacherSubjects
);


// ======================================================
// My Classes
// ======================================================

router.get(
    "/classes",
    verifyToken,
    getTeacherClasses
);


module.exports = router;