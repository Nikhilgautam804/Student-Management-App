const express = require("express");

const router = express.Router();

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    saveMarks,
    getAllMarks,
    getMarksByExam,
    updateMarks,
    deleteMarks
} = require("../controllers/marksController");

// ======================================
// Save Marks
// ======================================
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    saveMarks
);

// ======================================
// Get All Marks
// ======================================
router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getAllMarks
);

// ======================================
// Get Marks By Exam & Class Subject
// Example:
// /api/marks/exam/1/class-subject/4
// ======================================
router.get(
    "/exam/:examId/class-subject/:classSubjectId",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getMarksByExam
);

// ======================================
// Update Marks
// ======================================
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    updateMarks
);

// ======================================
// Delete Marks
// ======================================
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    deleteMarks
);

module.exports = router;