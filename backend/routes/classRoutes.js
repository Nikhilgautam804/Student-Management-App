const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const {
    addClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getMyClasses
} = require("../controllers/classController");

// Get All Classes
router.get("/", getAllClasses);
// Get My Classes
router.get(
    "/my/classes",
    verifyToken,
    getMyClasses
);

// Get Class By ID
router.get("/:id", getClassById);

// Add Class
router.post("/", addClass);

// Update Class
router.put("/:id", updateClass);

// Delete Class
router.delete("/:id", deleteClass);

module.exports = router;
