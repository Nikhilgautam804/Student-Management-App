const pool = require("../config/db");

// ==========================================
// Mark Attendance
// ==========================================
const markAttendance = async (req, res) => {
    const client = await pool.connect();

    try {

        const {
            class_subject_id,
            attendance_date,
            attendance
        } = req.body;

        await client.query("BEGIN");

        for (const student of attendance) {

            await client.query(
                `
                INSERT INTO attendance
                (
                    class_subject_id,
                    student_id,
                    attendance_date,
                    status
                )
                VALUES ($1,$2,$3,$4)

                ON CONFLICT
                (class_subject_id,student_id,attendance_date)

                DO UPDATE SET

                status = EXCLUDED.status
                `,
                [
                    class_subject_id,
                    student.student_id,
                    attendance_date,
                    student.status
                ]
            );

        }

        await client.query("COMMIT");

        res.status(200).json({
            message: "Attendance Saved Successfully"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    } finally {

        client.release();

    }
};

// ==========================================
// Get Attendance
// ==========================================
const getAttendance = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT

            a.id,

            a.attendance_date,

            a.status,

            s.roll_no,

            s.full_name,

            c.class_name,

            c.section,

            sub.subject_name,

            t.full_name AS teacher_name

            FROM attendance a

            JOIN students s
            ON a.student_id = s.id

            JOIN class_subjects cs
            ON a.class_subject_id = cs.id

            JOIN classes c
            ON cs.class_id = c.id

            JOIN subjects sub
            ON cs.subject_id = sub.id

            JOIN teachers t
            ON cs.teacher_id = t.id

            ORDER BY

            a.attendance_date DESC,
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
// Get Attendance By Date
// ==========================================
const getAttendanceByDate = async (req, res) => {

    try {

        const {
            class_subject_id,
            attendance_date
        } = req.query;

        const result = await pool.query(
            `
            SELECT

            a.id,

            s.id AS student_id,

            s.roll_no,

            s.full_name,

            a.status

            FROM attendance a

            JOIN students s
            ON a.student_id = s.id

            WHERE

            a.class_subject_id = $1

            AND

            a.attendance_date = $2

            ORDER BY s.roll_no
            `,
            [
                class_subject_id,
                attendance_date
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
// Update Attendance
// ==========================================
const updateAttendance = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const result = await pool.query(
            `
            UPDATE attendance

            SET status = $1

            WHERE id = $2

            RETURNING *
            `,
            [
                status,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Attendance Record Not Found"
            });

        }

        res.status(200).json({
            message: "Attendance Updated Successfully",
            attendance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================================
// Delete Attendance
// ==========================================
const deleteAttendance = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM attendance

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Attendance Record Not Found"
            });

        }

        res.status(200).json({
            message: "Attendance Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// getStudentsByClass
// ==========================================
// Get Students By Class
// ==========================================

const getStudentsByClass = async (req, res) => {

    try {

        const { classId } = req.params;

        // Get Teacher ID from Logged-in User
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

        // Verify Teacher owns this class
        const classResult = await pool.query(

            `
            SELECT id
            FROM class_subjects
            WHERE class_id = $1
            AND teacher_id = $2
            `,

            [
                classId,
                teacherId
            ]

        );

        if (classResult.rows.length === 0) {

            return res.status(403).json({

                message: "You are not authorized to access this class."

            });

        }

        // Fetch Students
        const studentResult = await pool.query(

            `
            SELECT

                id,
                roll_no,
                full_name,
                gender

            FROM students

            WHERE class_id = $1

            ORDER BY roll_no
            `,

            [classId]

        );

        res.status(200).json(studentResult.rows);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to fetch students."

        });

    }

};

module.exports = {
    markAttendance,
    getAttendance,
    getAttendanceByDate,
    getStudentsByClass,
    updateAttendance,
    deleteAttendance
};