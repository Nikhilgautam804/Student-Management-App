const pool = require("../config/db");

// ======================================
// Add Class Subject Allocation
// ======================================
const addClassSubject = async (req, res) => {
    try {

        const {
            class_id,
            subject_id,
            teacher_id
        } = req.body;

        // Check duplicate allocation
        const existing = await pool.query(
            `SELECT *
             FROM class_subjects
             WHERE class_id = $1
               AND subject_id = $2
               AND teacher_id = $3`,
            [
                class_id,
                subject_id,
                teacher_id
            ]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "This subject is already assigned to this class."
            });
        }

        const result = await pool.query(
            `INSERT INTO class_subjects
            (class_id, subject_id, teacher_id)
            VALUES ($1,$2,$3)
            RETURNING *`,
            [
                class_id,
                subject_id,
                teacher_id
            ]
        );

        res.status(201).json({
            message: "Subject Assigned Successfully",
            classSubject: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

// ======================================
// Get All Allocations
// ======================================
const getAllClassSubjects = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                cs.id,

                cs.class_id,
                cs.subject_id,
                cs.teacher_id,

                c.class_name,
                c.section,

                s.subject_code,
                s.subject_name,

                t.teacher_code,
                t.full_name AS teacher_name

            FROM class_subjects cs

            JOIN classes c
                ON cs.class_id = c.id

            JOIN subjects s
                ON cs.subject_id = s.id

            JOIN teachers t
                ON cs.teacher_id = t.id

            ORDER BY cs.id ASC
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
// Get Allocation By ID
// ======================================
const getClassSubjectById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                cs.id,

                cs.class_id,
                cs.subject_id,
                cs.teacher_id,

                c.class_name,
                c.section,

                s.subject_code,
                s.subject_name,

                t.teacher_code,
                t.full_name AS teacher_name

            FROM class_subjects cs

            JOIN classes c
                ON cs.class_id = c.id

            JOIN subjects s
                ON cs.subject_id = s.id

            JOIN teachers t
                ON cs.teacher_id = t.id

            WHERE cs.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Allocation Not Found"
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
// Update Allocation
// ======================================
const updateClassSubject = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            class_id,
            subject_id,
            teacher_id
        } = req.body;

        const duplicate = await pool.query(
            `
            SELECT *
            FROM class_subjects
            WHERE class_id = $1
              AND subject_id = $2
              AND teacher_id = $3
              AND id <> $4
            `,
            [
                class_id,
                subject_id,
                teacher_id,
                id
            ]
        );

        if (duplicate.rows.length > 0) {

            return res.status(400).json({
                message: "This allocation already exists."
            });

        }

        const result = await pool.query(
            `
            UPDATE class_subjects

            SET

                class_id = $1,
                subject_id = $2,
                teacher_id = $3

            WHERE id = $4

            RETURNING *
            `,
            [
                class_id,
                subject_id,
                teacher_id,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Allocation Not Found"
            });

        }

        res.status(200).json({
            message: "Allocation Updated Successfully",
            classSubject: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ======================================
// Delete Allocation
// ======================================
const deleteClassSubject = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM class_subjects

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Allocation Not Found"
            });

        }

        res.status(200).json({
            message: "Allocation Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// ======================================
// Get Students By Class Subject
// ======================================
const getStudentsByClassSubject = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT

                s.id,
                s.roll_no,
                s.full_name,
                s.gender,
                s.phone

            FROM class_subjects cs

            JOIN students s
                ON cs.class_id = s.class_id

            WHERE cs.id = $1

            ORDER BY s.roll_no ASC
            `,
            [id]
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
// Get My Class Subjects (Teacher)
// ======================================
const getMyClassSubjects = async (req, res) => {

    try {

        // Find logged-in teacher
        const teacherResult = await pool.query(

            `
            SELECT id
            FROM teachers
            WHERE user_id = $1
            `,

            [req.user.id]

        );

        if (teacherResult.rows.length === 0) {

            return res.status(404).json({

                message: "Teacher not found."

            });

        }

        const teacherId = teacherResult.rows[0].id;

        // Fetch only this teacher's assigned class-subjects
        const result = await pool.query(

            `
            SELECT

                cs.id,

                cs.class_id,

                cs.subject_id,

                c.class_name,

                c.section,

                s.subject_name,

                s.subject_code

            FROM class_subjects cs

            JOIN classes c
                ON cs.class_id = c.id

            JOIN subjects s
                ON cs.subject_id = s.id

            WHERE cs.teacher_id = $1

            ORDER BY
                c.class_name,
                c.section,
                s.subject_name
            `,

            [teacherId]

        );

        res.status(200).json(result.rows);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

module.exports = {
    addClassSubject,
    getAllClassSubjects,
    getClassSubjectById,
    updateClassSubject,
    deleteClassSubject,
    getStudentsByClassSubject,
    getMyClassSubjects
};