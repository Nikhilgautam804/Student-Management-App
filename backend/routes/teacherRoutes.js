const express = require("express");

const router = express.Router();

const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    addTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getMyStudents
} = require("../controllers/teacherController");


// ==========================================
// Teacher Dashboard - My Students
// ==========================================

router.get(
    "/students",
    verifyToken,
    authorizeRoles("teacher"),
    getMyStudents
);


// ==========================================
// Get All Teachers
// ==========================================
// This was missing.
// Frontend calls GET /api/teachers

router.get(
    "/",
    getAllTeachers
);


// ==========================================
// Get Teacher By ID
// ==========================================

router.get(
    "/:id",
    getTeacherById
);


// ==========================================
// Add Teacher
// ==========================================
// Only Admin can create/register a teacher

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    addTeacher
);


// ==========================================
// Update Teacher
// ==========================================

router.put(
    "/:id",
    updateTeacher
);


// ==========================================
// Delete Teacher
// ==========================================

router.delete(
    "/:id",
    deleteTeacher
);


module.exports = router;