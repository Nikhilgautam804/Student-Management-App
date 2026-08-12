const express = require("express");

const router = express.Router();

const {
    getDashboardStats,
    getStudentsByClass,
    getStudentsByGender,
    getAttendanceOverview,
    getMarksPerformance
} = require("../controllers/dashboardController");


// ======================================================
// BASIC STATS
// ======================================================

router.get(
    "/stats",
    getDashboardStats
);


// ======================================================
// CHART APIs
// ======================================================

router.get(
    "/students-by-class",
    getStudentsByClass
);


router.get(
    "/students-by-gender",
    getStudentsByGender
);


router.get(
    "/attendance-overview",
    getAttendanceOverview
);


router.get(
    "/marks-performance",
    getMarksPerformance
);


module.exports = router;