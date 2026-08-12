const pool = require("../config/db");

// ======================================================
// Get Teacher Dashboard Stats
// ======================================================

const getTeacherDashboardStats = async (req, res) => {

    try {

        // ==================================================
        // Find Logged-in Teacher
        // ==================================================

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        // ==================================================
        // Total Students
        // Students in classes assigned to teacher
        // ==================================================

        const studentResult = await pool.query(
            `
            SELECT COUNT(DISTINCT s.id) AS count

            FROM students s

            JOIN classes c
                ON s.class_id = c.id

            WHERE c.class_teacher_id = $1
            `,
            [teacherId]
        );


        // ==================================================
        // Total Classes
        // ==================================================

        const classResult = await pool.query(
            `
            SELECT COUNT(*) AS count

            FROM classes

            WHERE class_teacher_id = $1
            `,
            [teacherId]
        );


        // ==================================================
        // Total Subjects
        // Subjects assigned to teacher
        // ==================================================

        const subjectResult = await pool.query(
            `
            SELECT COUNT(DISTINCT subject_id) AS count

            FROM class_subjects

            WHERE teacher_id = $1
            `,
            [teacherId]
        );


        // ==================================================
        // Total Exams
        // Exams in teacher's class subjects
        // ==================================================

        const examResult = await pool.query(
            `
            SELECT COUNT(DISTINCT m.exam_id) AS count

            FROM marks m

            JOIN class_subjects cs
                ON m.class_subject_id = cs.id

            WHERE cs.teacher_id = $1
            `,
            [teacherId]
        );


        res.status(200).json({

            students:
                Number(studentResult.rows[0].count),

            classes:
                Number(classResult.rows[0].count),

            subjects:
                Number(subjectResult.rows[0].count),

            exams:
                Number(examResult.rows[0].count)

        });

    }

    catch (error) {

        console.error(
            "Teacher Dashboard Stats Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// Students By Class
// ======================================================

const getTeacherStudentsByClass = async (req, res) => {

    try {

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        const result = await pool.query(
            `
            SELECT

                CONCAT(
                    c.class_name,
                    ' - ',
                    c.section
                ) AS class_name,

                COUNT(s.id) AS students

            FROM classes c

            LEFT JOIN students s
                ON s.class_id = c.id

            WHERE c.class_teacher_id = $1

            GROUP BY
                c.id,
                c.class_name,
                c.section

            ORDER BY
                c.class_name,
                c.section
            `,
            [teacherId]
        );


        res.status(200).json(
            result.rows.map(row => ({

                name: row.class_name,

                students:
                    Number(row.students)

            }))
        );

    }

    catch (error) {

        console.error(
            "Teacher Students By Class Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// Attendance Overview
// ======================================================

const getTeacherAttendanceOverview = async (req, res) => {

    try {

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        const result = await pool.query(
            `
            SELECT

                a.status,

                COUNT(*) AS total

            FROM attendance a

            JOIN class_subjects cs
                ON a.class_subject_id = cs.id

            WHERE cs.teacher_id = $1

            GROUP BY a.status

            ORDER BY a.status
            `,
            [teacherId]
        );


        const statusMap = {

            present: "Present",
            absent: "Absent",
            late: "Late",
            leave: "Leave"

        };


        res.status(200).json(

            result.rows.map(row => ({

                name:
                    statusMap[
                        row.status?.toLowerCase()
                    ] ||
                    row.status,

                attendance:
                    Number(row.total)

            }))

        );

    }

    catch (error) {

        console.error(
            "Teacher Attendance Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// Subject Performance
// ======================================================

const getTeacherMarksPerformance = async (req, res) => {

    try {

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        const result = await pool.query(
            `
            SELECT

                sub.subject_name,

                ROUND(
                    AVG(
                        (
                            m.marks_obtained::numeric
                            /
                            NULLIF(e.max_marks, 0)
                        ) * 100
                    ),
                    2
                ) AS percentage

            FROM marks m

            JOIN class_subjects cs
                ON m.class_subject_id = cs.id

            JOIN subjects sub
                ON cs.subject_id = sub.id

            JOIN exams e
                ON m.exam_id = e.id

            WHERE cs.teacher_id = $1

            GROUP BY
                sub.id,
                sub.subject_name

            ORDER BY
                sub.subject_name
            `,
            [teacherId]
        );


        res.status(200).json(

            result.rows.map(row => ({

                name: row.subject_name,

                percentage:
                    Number(row.percentage || 0)

            }))

        );

    }

    catch (error) {

        console.error(
            "Teacher Marks Performance Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// My Subjects
// ======================================================

const getTeacherSubjects = async (req, res) => {

    try {

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        const result = await pool.query(
            `
            SELECT DISTINCT

                s.id,

                s.subject_name

            FROM class_subjects cs

            JOIN subjects s
                ON cs.subject_id = s.id

            WHERE cs.teacher_id = $1

            ORDER BY s.subject_name
            `,
            [teacherId]
        );


        res.status(200).json(
            result.rows
        );

    }

    catch (error) {

        console.error(
            "Teacher Subjects Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// My Classes With Student Count
// ======================================================

const getTeacherClasses = async (req, res) => {

    try {

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
                message: "Teacher not found"
            });

        }


        const teacherId =
            teacherResult.rows[0].id;


        const result = await pool.query(
            `
            SELECT

                c.id,

                c.class_name,

                c.section,

                c.room_number,

                COUNT(s.id) AS student_count

            FROM classes c

            LEFT JOIN students s
                ON s.class_id = c.id

            WHERE c.class_teacher_id = $1

            GROUP BY
                c.id,
                c.class_name,
                c.section,
                c.room_number

            ORDER BY
                c.class_name,
                c.section
            `,
            [teacherId]
        );


        res.status(200).json(

            result.rows.map(row => ({

                id: row.id,

                class_name:
                    row.class_name,

                section:
                    row.section,

                room_number:
                    row.room_number,

                student_count:
                    Number(row.student_count)

            }))

        );

    }

    catch (error) {

        console.error(
            "Teacher Classes Error:",
            error
        );

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// Exports
// ======================================================

module.exports = {

    getTeacherDashboardStats,

    getTeacherStudentsByClass,

    getTeacherAttendanceOverview,

    getTeacherMarksPerformance,

    getTeacherSubjects,

    getTeacherClasses

};