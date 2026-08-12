const pool = require("../config/db");

// ======================================================
// BASIC DASHBOARD STATS
// ======================================================

const getDashboardStats = async (req, res) => {

    try {

        const studentResult = await pool.query(
            "SELECT COUNT(*) FROM students"
        );

        const teacherResult = await pool.query(
            "SELECT COUNT(*) FROM teachers"
        );

        const classResult = await pool.query(
            "SELECT COUNT(*) FROM classes"
        );

        const subjectResult = await pool.query(
            "SELECT COUNT(*) FROM subjects"
        );

        const totalStudents =
            Number(studentResult.rows[0].count);

        const totalTeachers =
            Number(teacherResult.rows[0].count);

        const totalClasses =
            Number(classResult.rows[0].count);

        const totalSubjects =
            Number(subjectResult.rows[0].count);

        res.json({

            students: totalStudents,

            teachers: totalTeachers,

            subjects: totalSubjects,

            classes: totalClasses

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// STUDENTS BY CLASS
// ======================================================

const getStudentsByClass = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                c.class_name,

                c.section,

                COUNT(s.id) AS student_count

            FROM classes c

            LEFT JOIN students s

                ON s.class_id = c.id

            GROUP BY

                c.id,
                c.class_name,
                c.section

            ORDER BY

                c.class_name,
                c.section
            `

        );


        const labels = result.rows.map(

            row =>
                `${row.class_name} - ${row.section}`

        );


        const data = result.rows.map(

            row =>
                Number(row.student_count)

        );


        res.status(200).json({

            labels,

            data

        });

    }

    catch (error) {

        console.error(
            "Students By Class Error:",
            error
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// STUDENTS BY GENDER
// ======================================================

const getStudentsByGender = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                gender,

                COUNT(*) AS total

            FROM students

            GROUP BY gender

            ORDER BY gender
            `

        );


        const labels = result.rows.map(

            row => row.gender || "Unknown"

        );


        const data = result.rows.map(

            row => Number(row.total)

        );


        res.status(200).json({

            labels,

            data

        });

    }

    catch (error) {

        console.error(
            "Students Gender Error:",
            error
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// ATTENDANCE OVERVIEW
// ======================================================

const getAttendanceOverview = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                status,

                COUNT(*) AS total

            FROM attendance

            GROUP BY status

            ORDER BY status
            `

        );


        const labels = result.rows.map(

            row => row.status

        );


        const data = result.rows.map(

            row => Number(row.total)

        );


        res.status(200).json({

            labels,

            data

        });

    }

    catch (error) {

        console.error(
            "Attendance Overview Error:",
            error
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// AVERAGE MARKS BY SUBJECT
// ======================================================

const getMarksPerformance = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                sub.subject_name,

                ROUND(

                    AVG(

                        (m.marks_obtained::numeric
                        / NULLIF(e.max_marks, 0))
                        * 100

                    ),

                    2

                ) AS average_percentage

            FROM marks m

            JOIN class_subjects cs

                ON m.class_subject_id = cs.id

            JOIN subjects sub

                ON cs.subject_id = sub.id

            JOIN exams e

                ON m.exam_id = e.id

            GROUP BY

                sub.id,
                sub.subject_name

            ORDER BY

                sub.subject_name
            `

        );


        const labels = result.rows.map(

            row => row.subject_name

        );


        const data = result.rows.map(

            row => Number(row.average_percentage)

        );


        res.status(200).json({

            labels,

            data

        });

    }

    catch (error) {

        console.error(
            "Marks Performance Error:",
            error
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    getDashboardStats,

    getStudentsByClass,

    getStudentsByGender,

    getAttendanceOverview,

    getMarksPerformance

};