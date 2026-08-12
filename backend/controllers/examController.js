const pool = require("../config/db");

// ======================================
// Add Exam
// ======================================
const addExam = async (req, res) => {
    try {

        const {
            exam_name,
            exam_type,
            max_marks,
            exam_date
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO exams
            (
                exam_name,
                exam_type,
                max_marks,
                exam_date
            )

            VALUES
            (
                $1,$2,$3,$4
            )

            RETURNING *
            `,
            [
                exam_name,
                exam_type,
                max_marks,
                exam_date
            ]
        );

        res.status(201).json({
            message: "Exam Created Successfully",
            exam: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

// ======================================
// Get All Exams
// ======================================
const getAllExams = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *

            FROM exams

            ORDER BY exam_date DESC
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ======================================
// Get Exam By ID
// ======================================
const getExamById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *

            FROM exams

            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Exam Not Found"
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

// ======================================
// Update Exam
// ======================================
const updateExam = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            exam_name,
            exam_type,
            max_marks,
            exam_date
        } = req.body;

        const result = await pool.query(
            `
            UPDATE exams

            SET

                exam_name = $1,
                exam_type = $2,
                max_marks = $3,
                exam_date = $4

            WHERE id = $5

            RETURNING *
            `,
            [
                exam_name,
                exam_type,
                max_marks,
                exam_date,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Exam Not Found"
            });

        }

        res.status(200).json({
            message: "Exam Updated Successfully",
            exam: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ======================================
// Delete Exam
// ======================================
const deleteExam = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM exams

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Exam Not Found"
            });

        }

        res.status(200).json({
            message: "Exam Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    addExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam
};