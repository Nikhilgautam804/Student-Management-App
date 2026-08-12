const pool = require("../config/db");

// ===============================
// Add Subject
// ===============================
const addSubject = async (req, res) => {
    try {

        const {
            subject_code,
            subject_name
        } = req.body;

        const result = await pool.query(
            `INSERT INTO subjects
            (subject_code, subject_name)
            VALUES ($1, $2)
            RETURNING *`,
            [
                subject_code,
                subject_name
            ]
        );

        res.status(201).json({
            message: "Subject Added Successfully",
            subject: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({
                message: "Subject Code or Subject Name already exists."
            });
        }

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ===============================
// Get All Subjects
// ===============================
const getAllSubjects = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM subjects
             ORDER BY id ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ===============================
// Get Subject By ID
// ===============================
const getSubjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM subjects
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ===============================
// Update Subject
// ===============================
const updateSubject = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            subject_code,
            subject_name
        } = req.body;

        const result = await pool.query(
            `UPDATE subjects
             SET
                subject_code = $1,
                subject_name = $2,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [
                subject_code,
                subject_name,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        res.status(200).json({
            message: "Subject Updated Successfully",
            subject: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        if (error.code === "23505") {
            return res.status(400).json({
                message: "Subject Code or Subject Name already exists."
            });
        }

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ===============================
// Delete Subject
// ===============================
const deleteSubject = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM subjects
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        res.status(200).json({
            message: "Subject Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    addSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};