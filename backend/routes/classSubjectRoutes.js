const express = require("express");

const router = express.Router();
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    addClassSubject,
    getAllClassSubjects,
    getClassSubjectById,
    updateClassSubject,
    deleteClassSubject,
    getStudentsByClassSubject,
    getMyClassSubjects
} = require("../controllers/classSubjectController");

// Add Allocation
router.post("/", addClassSubject);

// Get All Allocations
router.get("/", getAllClassSubjects);

// ======================================
// Get Logged-in Teacher's Class Subjects
// ======================================
router.get(
    "/my",
    verifyToken,
    authorizeRoles("teacher"),
    getMyClassSubjects
);

router.get("/:id/students", getStudentsByClassSubject);



// Get Allocation By ID
router.get("/:id", getClassSubjectById);

// Update Allocation
router.put("/:id", updateClassSubject);

// Delete Allocation
router.delete("/:id", deleteClassSubject);

module.exports = router;