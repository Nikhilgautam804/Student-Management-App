const express = require("express");

const router = express.Router();

const {
    addSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

router.post("/", addSubject);

router.get("/", getAllSubjects);

router.get("/:id", getSubjectById);

router.put("/:id", updateSubject);

router.delete("/:id", deleteSubject);

module.exports = router;