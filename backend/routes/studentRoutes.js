const express = require("express");
const router = express.Router();
const {
    verifyToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {addStudent,getAllStudents,getStudentById,updateStudent,deleteStudent,getStudentsByClass,getStudentDashboard,getStudentAttendance,getStudentMarks}= require("../controllers/studentController");


// Add Student Route
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    addStudent
);
// Get All Students Route
router.get("/", getAllStudents);

router.get("/class/:classId", getStudentsByClass);

router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("student"),
    getStudentDashboard
);
// ======================================
// Student Attendance
// ======================================

router.get(
    "/attendance",
    verifyToken,
    authorizeRoles("student"),
    getStudentAttendance
);
// ======================================
// Student Marks
// ======================================

router.get(
    "/marks",
    verifyToken,
    (req, res, next) => {

        console.log("MARKS USER:", req.user);

        next();

    },
    authorizeRoles("student"),
    getStudentMarks
);
// Get Student By ID Route
router.get("/:id", getStudentById);
// Update Student Route
router.put("/:id", updateStudent);
// Delete Student Route
router.delete("/:id", deleteStudent);
module.exports = router;