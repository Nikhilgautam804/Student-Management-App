const pool = require("../config/db");

// ==========================================
// Save Marks
// ==========================================
const saveMarks = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            class_subject_id,
            exam_id,
            marks
        } = req.body;

        // Check Exam Exists
        const examResult = await client.query(
            `
            SELECT max_marks
            FROM exams
            WHERE id = $1
            `,
            [exam_id]
        );

        if (examResult.rows.length === 0) {

            client.release();

            return res.status(404).json({
                message: "Exam Not Found"
            });

        }

        const maxMarks = Number(examResult.rows[0].max_marks);

        await client.query("BEGIN");

        for (const student of marks) {

            if (
                student.marks_obtained < 0 ||
                student.marks_obtained > maxMarks
            ) {

                throw new Error(
                    `Marks for Student ID ${student.student_id} must be between 0 and ${maxMarks}`
                );

            }

            await client.query(
                `
                INSERT INTO marks
                (
                    student_id,
                    class_subject_id,
                    exam_id,
                    marks_obtained
                )

                VALUES
                (
                    $1,$2,$3,$4
                )

                ON CONFLICT
                (
                    student_id,
                    class_subject_id,
                    exam_id
                )

                DO UPDATE

                SET

                marks_obtained = EXCLUDED.marks_obtained

                RETURNING *
                `,
                [
                    student.student_id,
                    class_subject_id,
                    exam_id,
                    student.marks_obtained
                ]
            );

        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Marks Saved Successfully"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    } finally {

        client.release();

    }

};

// ==========================================
// Get All Marks
// ==========================================
const getAllMarks = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT

                m.id,

                s.roll_no,

                s.full_name,

                c.class_name,

                c.section,

                sub.subject_name,

                e.exam_name,

                e.max_marks,

                m.marks_obtained

            FROM marks m

            JOIN students s
                ON m.student_id = s.id

            JOIN class_subjects cs
                ON m.class_subject_id = cs.id

            JOIN classes c
                ON cs.class_id = c.id

            JOIN subjects sub
                ON cs.subject_id = sub.id

            JOIN exams e
                ON m.exam_id = e.id

            ORDER BY
                e.exam_date DESC,
                s.roll_no ASC
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

// ==========================================
// Get Marks By Exam & Class Subject
// ==========================================
const getMarksByExam = async (req, res) => {

    try {

        const {
            examId,
            classSubjectId
        } = req.params;

        const result = await pool.query(
            `
            SELECT

                m.id,

                s.id AS student_id,

                s.roll_no,

                s.full_name,

                m.marks_obtained

            FROM marks m

            JOIN students s
                ON m.student_id = s.id

            WHERE

                m.exam_id = $1

            AND

                m.class_subject_id = $2

            ORDER BY
                s.roll_no
            `,
            [
                examId,
                classSubjectId
            ]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================================
// Update Marks
// ==========================================
const updateMarks = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            marks_obtained
        } = req.body;

        const result = await pool.query(
            `
            UPDATE marks

            SET

                marks_obtained = $1

            WHERE id = $2

            RETURNING *
            `,
            [
                marks_obtained,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Marks Record Not Found"
            });

        }

        res.status(200).json({
            message: "Marks Updated Successfully",
            marks: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================================
// Delete Marks
// ==========================================
const deleteMarks = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM marks

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Marks Record Not Found"
            });

        }

        res.status(200).json({
            message: "Marks Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    saveMarks,
    getAllMarks,
    getMarksByExam,
    updateMarks,
    deleteMarks
};