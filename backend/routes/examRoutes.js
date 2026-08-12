const express = require("express");
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

const {
    addExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam
} = require("../controllers/examController");

// ======================================
// Add Exam (Admin Only)
// ======================================
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    addExam
);

// ======================================
// Get All Exams (Admin + Teacher + Student)
// ======================================

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "teacher", "student"),
    getAllExams
);

// ======================================
// Get Exam By ID (Admin + Teacher)
// ======================================
router.get(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "teacher"),
    getExamById
);

// ======================================
// Update Exam (Admin Only)
// ======================================
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    updateExam
);

// ======================================
// Delete Exam (Admin Only)
// ======================================
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteExam
);

module.exports = router;