const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ======================================================
// Add Student
// ======================================================

const addStudent = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            roll_no,
            full_name,
            email,
            phone,
            gender,
            class_id,
            address
        } = req.body;

        // ==========================================
        // Basic Validation
        // ==========================================

        if (
            !roll_no ||
            !full_name ||
            !email ||
            !phone ||
            !gender ||
            !class_id
        ) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }

        await client.query("BEGIN");

        // ==========================================
        // Check Roll Number
        // ==========================================

        const existingStudent = await client.query(
            `
            SELECT id
            FROM students
            WHERE roll_no = $1
            `,
            [roll_no]
        );

        if (existingStudent.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Roll Number already exists."
            });

        }

        // ==========================================
        // Check Username
        // Username = Roll Number
        // ==========================================

        const existingUser = await client.query(
            `
            SELECT id
            FROM users
            WHERE username = $1
            `,
            [roll_no]
        );

        if (existingUser.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Username already exists."
            });

        }

        // ==========================================
        // Default Password
        // ==========================================

        const defaultPassword = "student123";

        const hashedPassword = await bcrypt.hash(
            defaultPassword,
            10
        );

        // ==========================================
        // Create User Account
        // ==========================================

        const userResult = await client.query(
            `
            INSERT INTO users
            (
                username,
                password,
                role,
                is_active
            )
            VALUES
            ($1, $2, $3, $4)
            RETURNING id, username, role
            `,
            [
                roll_no,
                hashedPassword,
                "student",
                true
            ]
        );

        const newUser = userResult.rows[0];

        // ==========================================
        // Create Student
        // ==========================================

        const studentResult = await client.query(
            `
            INSERT INTO students
            (
                user_id,
                roll_no,
                full_name,
                email,
                phone,
                gender,
                class_id,
                address
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                newUser.id,
                roll_no,
                full_name,
                email,
                phone,
                gender,
                class_id,
                address
            ]
        );

        const newStudent = studentResult.rows[0];

        // ==========================================
        // Commit
        // ==========================================

        await client.query("COMMIT");

        // ==========================================
        // Response
        // ==========================================

        res.status(201).json({

            message: "Student Added Successfully",

            student: newStudent,

            credentials: {
                username: roll_no,
                password: defaultPassword
            }

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Add Student Error:",
            error
        );

        // Duplicate constraint
        if (error.code === "23505") {

            return res.status(400).json({

                message:
                    "Student or username already exists."

            });

        }

        res.status(500).json({

            message: "Server Error"

        });

    }

    finally {

        client.release();

    }

};


// ======================================================
// Get All Students
// ======================================================

const getAllStudents = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                students.*,

                classes.class_name,

                classes.section

            FROM students

            LEFT JOIN classes

                ON students.class_id = classes.id

            ORDER BY students.id
            `

        );

        res.status(200).json(
            result.rows
        );

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// Get Student By ID
// ======================================================

const getStudentById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT

                students.*,

                classes.class_name,

                classes.section

            FROM students

            LEFT JOIN classes

                ON students.class_id = classes.id

            WHERE students.id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        res.status(200).json(
            result.rows[0]
        );

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};


// ======================================================
// Update Student
// ======================================================

const updateStudent = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        const {
            roll_no,
            full_name,
            email,
            phone,
            gender,
            class_id,
            address
        } = req.body;

        await client.query("BEGIN");

        // ==========================================
        // Get Existing Student
        // ==========================================

        const existingStudent = await client.query(
            `
            SELECT
                id,
                user_id,
                roll_no
            FROM students
            WHERE id = $1
            `,
            [id]
        );

        if (existingStudent.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({

                message: "Student not found"

            });

        }

        const student =
            existingStudent.rows[0];


        // ==========================================
        // Check Roll Number
        // ==========================================

        const duplicateRoll = await client.query(
            `
            SELECT id
            FROM students
            WHERE roll_no = $1
            AND id != $2
            `,
            [
                roll_no,
                id
            ]
        );

        if (duplicateRoll.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({

                message:
                    "Roll Number already exists."

            });

        }


        // ==========================================
        // Check User Username
        // ==========================================

        const duplicateUsername =
            await client.query(
                `
                SELECT id
                FROM users
                WHERE username = $1
                AND id != $2
                `,
                [
                    roll_no,
                    student.user_id
                ]
            );

        if (
            duplicateUsername.rows.length > 0
        ) {

            await client.query("ROLLBACK");

            return res.status(400).json({

                message:
                    "Username already exists."

            });

        }


        // ==========================================
        // Update Student
        // ==========================================

        const result = await client.query(
            `
            UPDATE students

            SET

                roll_no = $1,

                full_name = $2,

                email = $3,

                phone = $4,

                gender = $5,

                class_id = $6,

                address = $7,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $8

            RETURNING *
            `,
            [
                roll_no,
                full_name,
                email,
                phone,
                gender,
                class_id,
                address,
                id
            ]
        );


        // ==========================================
        // Keep Login Username Same As Roll Number
        // ==========================================

        await client.query(
            `
            UPDATE users

            SET

                username = $1,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2
            `,
            [
                roll_no,
                student.user_id
            ]
        );


        await client.query("COMMIT");


        res.status(200).json({

            message:
                "Student Updated Successfully",

            student:
                result.rows[0]

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Update Student Error:",
            error
        );

        if (error.code === "23505") {

            return res.status(400).json({

                message:
                    "Roll Number or Username already exists."

            });

        }

        res.status(500).json({

            message: "Server Error"

        });

    }

    finally {

        client.release();

    }

};


// ======================================================
// Delete Student
// ======================================================

const deleteStudent = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        await client.query("BEGIN");


        // ==========================================
        // Get User ID
        // ==========================================

        const studentResult = await client.query(
            `
            SELECT user_id
            FROM students
            WHERE id = $1
            `,
            [id]
        );

        if (studentResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({

                message: "Student not found"

            });

        }

        const userId =
            studentResult.rows[0].user_id;


        // ==========================================
        // Delete Student
        // ==========================================

        await client.query(
            `
            DELETE FROM students
            WHERE id = $1
            `,
            [id]
        );


        // ==========================================
        // Delete Associated User Account
        // ==========================================

        if (userId) {

            await client.query(
                `
                DELETE FROM users
                WHERE id = $1
                `,
                [userId]
            );

        }


        await client.query("COMMIT");


        res.status(200).json({

            message:
                "Student Deleted Successfully"

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Delete Student Error:",
            error
        );

        res.status(500).json({

            message: "Server Error"

        });

    }

    finally {

        client.release();

    }

};


// ======================================================
// Get Students By Class
// ======================================================

const getStudentsByClass = async (req, res) => {

    try {

        const { classId } = req.params;

        const result = await pool.query(

            `
            SELECT

                id,

                roll_no,

                full_name,

                gender

            FROM students

            WHERE class_id = $1

            ORDER BY roll_no ASC
            `,

            [classId]

        );

        res.status(200).json(
            result.rows
        );

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


// ======================================================
// Student Dashboard
// ======================================================

const getStudentDashboard = async (req, res) => {

    try {

        // ======================================
        // Get Logged In User
        // ======================================

        const userResult = await pool.query(

            `
            SELECT

                id,

                username

            FROM users

            WHERE id = $1
            `,

            [req.user.id]

        );


        if (userResult.rows.length === 0) {

            return res.status(404).json({

                message: "User not found."

            });

        }


        const user =
            userResult.rows[0];


        // ======================================
        // Get Student Using user_id
        // ======================================

        const studentResult = await pool.query(

            `
            SELECT

                s.id,

                s.roll_no,

                s.full_name,

                s.class_id,

                c.class_name,

                c.section

            FROM students s

            JOIN classes c

                ON s.class_id = c.id

            WHERE s.user_id = $1
            `,

            [user.id]

        );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        const student =
            studentResult.rows[0];


        const studentId =
            student.id;


        // ======================================
        // Overall Attendance Percentage
        // ======================================

        const attendanceResult =
            await pool.query(

                `
                SELECT

                    COUNT(*) FILTER (
                        WHERE status = 'Present'
                    ) AS present,

                    COUNT(*) AS total

                FROM attendance

                WHERE student_id = $1
                `,

                [studentId]

            );


        const present =
            Number(
                attendanceResult.rows[0].present || 0
            );


        const total =
            Number(
                attendanceResult.rows[0].total || 0
            );


        const attendancePercentage =

            total === 0

                ? 0

                : Math.round(
                    (present / total) * 100
                );


        // ======================================
        // Average Marks
        // ======================================

        const marksResult =
            await pool.query(

                `
                SELECT

                    AVG(marks_obtained)
                    AS average_marks

                FROM marks

                WHERE student_id = $1
                `,

                [studentId]

            );


        const averageMarks =

            Number(
                marksResult.rows[0]
                    .average_marks || 0
            ).toFixed(1);


        // ======================================
        // Total Subjects
        // ======================================

        const subjectResult =
            await pool.query(

                `
                SELECT

                    COUNT(*) AS total_subjects

                FROM class_subjects cs

                WHERE cs.class_id = $1
                `,

                [student.class_id]

            );


        const totalSubjects =
            Number(
                subjectResult.rows[0]
                    .total_subjects || 0
            );


        // ======================================
        // Today's Attendance
        // ======================================

        const todayAttendanceResult =
            await pool.query(

                `
                SELECT

                    sub.subject_name AS subject,

                    a.status

                FROM attendance a

                JOIN class_subjects cs

                    ON a.class_subject_id = cs.id

                JOIN subjects sub

                    ON cs.subject_id = sub.id

                WHERE

                    a.student_id = $1

                AND

                    a.attendance_date = CURRENT_DATE

                ORDER BY

                    sub.subject_name ASC
                `,

                [studentId]

            );


        const todayAttendance =
            todayAttendanceResult.rows;


        // ======================================
        // Upcoming Exams
        // ======================================

        const upcomingExamResult =
            await pool.query(

                `
                SELECT

                    id,

                    exam_name,

                    exam_date

                FROM exams

                WHERE

                    exam_date >= CURRENT_DATE

                ORDER BY

                    exam_date ASC

                LIMIT 5
                `

            );


        const upcomingExamList =
            upcomingExamResult.rows.map(

                (exam) => ({

                    id:
                        exam.id,

                    exam:
                        exam.exam_name,

                    date:
                        exam.exam_date

                })

            );


        // ======================================
        // Upcoming Exam Count
        // ======================================

        const upcomingExamCountResult =
            await pool.query(

                `
                SELECT

                    COUNT(*) AS upcoming_exams

                FROM exams

                WHERE

                    exam_date >= CURRENT_DATE
                `

            );


        const upcomingExams =
            Number(

                upcomingExamCountResult
                    .rows[0]
                    .upcoming_exams || 0

            );


        // ======================================
        // Final Dashboard Response
        // ======================================

        res.status(200).json({

            student_name:
                student.full_name,

            roll_no:
                student.roll_no,

            class_name:
                student.class_name,

            section:
                student.section,

            attendance_percentage:
                attendancePercentage,

            average_marks:
                averageMarks,

            total_subjects:
                totalSubjects,

            upcoming_exams:
                upcomingExams,

            today_attendance:
                todayAttendance,

            upcoming_exam_list:
                upcomingExamList

        });

    }

    catch (error) {

        console.error(
            "Student Dashboard Error:",
            error
        );

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


// ======================================================
// Student Attendance
// ======================================================

const getStudentAttendance = async (req, res) => {

    try {

        const date =
            req.query.date ||
            new Date()
                .toISOString()
                .split("T")[0];


        // ======================================
        // Get Student Using user_id
        // ======================================

        const studentResult =
            await pool.query(

                `
                SELECT

                    id,

                    roll_no,

                    full_name

                FROM students

                WHERE user_id = $1
                `,

                [req.user.id]

            );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        const studentId =
            studentResult.rows[0].id;


        // ======================================
        // Attendance Summary
        // ======================================

        const summaryResult =
            await pool.query(

                `
                SELECT

                    COUNT(*) FILTER (
                        WHERE status = 'Present'
                    ) AS present,

                    COUNT(*) FILTER (
                        WHERE status = 'Absent'
                    ) AS absent,

                    COUNT(*) AS total

                FROM attendance

                WHERE student_id = $1

                AND attendance_date = $2
                `,

                [
                    studentId,
                    date
                ]

            );


        const present =
            Number(
                summaryResult.rows[0].present || 0
            );


        const absent =
            Number(
                summaryResult.rows[0].absent || 0
            );


        const total =
            Number(
                summaryResult.rows[0].total || 0
            );


        const attendancePercentage =

            total === 0

                ? 0

                : Math.round(
                    (present / total) * 100
                );


        // ======================================
        // Attendance Records
        // ======================================

        const attendanceResult =
            await pool.query(

                `
                SELECT

                    sub.subject_name,

                    a.status

                FROM attendance a

                JOIN class_subjects cs

                    ON a.class_subject_id =
                       cs.id

                JOIN subjects sub

                    ON cs.subject_id =
                       sub.id

                WHERE

                    a.student_id = $1

                AND

                    a.attendance_date = $2

                ORDER BY
                    sub.subject_name
                `,

                [
                    studentId,
                    date
                ]

            );


        res.status(200).json({

            attendance_percentage:
                attendancePercentage,

            present,

            absent,

            records:
                attendanceResult.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


// ======================================================
// Student Marks
// ======================================================

const getStudentMarks = async (req, res) => {

    try {

        const { exam_id } = req.query;


        if (!exam_id) {

            return res.status(400).json({

                message:
                    "Exam is required."

            });

        }


        // ======================================
        // Get Student Using user_id
        // ======================================

        const studentResult =
            await pool.query(

                `
                SELECT

                    id,

                    class_id,

                    full_name

                FROM students

                WHERE user_id = $1
                `,

                [req.user.id]

            );


        if (studentResult.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        const student =
            studentResult.rows[0];


        // ======================================
        // Fetch Subjects + Marks
        // ======================================

        const marksResult =
            await pool.query(

                `
                SELECT

                    sub.subject_name,

                    e.max_marks,

                    m.marks_obtained

                FROM class_subjects cs

                JOIN subjects sub

                    ON cs.subject_id =
                       sub.id

                JOIN exams e

                    ON e.id = $2

                LEFT JOIN marks m

                    ON m.class_subject_id =
                       cs.id

                    AND m.student_id = $1

                    AND m.exam_id = $2

                WHERE

                    cs.class_id = $3

                ORDER BY

                    sub.subject_name
                `,

                [

                    student.id,

                    exam_id,

                    student.class_id

                ]

            );


        let totalObtained = 0;

        let totalMaximum = 0;

        let uploadedSubjects = 0;


        const subjects =
            marksResult.rows.map(

                (row) => {

                    if (
                        row.marks_obtained !== null
                    ) {

                        totalObtained +=
                            Number(
                                row.marks_obtained
                            );

                        totalMaximum +=
                            Number(
                                row.max_marks
                            );

                        uploadedSubjects++;

                    }


                    return {

                        subject_name:
                            row.subject_name,

                        marks_obtained:
                            row.marks_obtained,

                        max_marks:
                            row.max_marks,

                        uploaded:
                            row.marks_obtained !== null

                    };

                }

            );


        const totalSubjects =
            subjects.length;


        const allUploaded =
            uploadedSubjects ===
            totalSubjects;


        const percentage =

            totalMaximum === 0

                ? 0

                : (
                    (totalObtained /
                        totalMaximum) * 100
                );


        const average =

            uploadedSubjects === 0

                ? 0

                : (
                    totalObtained /
                    uploadedSubjects
                );


        res.status(200).json({

            average:
                average.toFixed(2),

            percentage:
                percentage.toFixed(2),

            uploaded_subjects:
                uploadedSubjects,

            total_subjects:
                totalSubjects,

            all_uploaded:
                allUploaded,

            result:

                totalMaximum === 0

                    ? "Not Available"

                    : allUploaded

                        ? percentage >= 40

                            ? "PASS"

                            : "FAIL"

                        : "Partial Result",

            subjects

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


// ======================================================
// Exports
// ======================================================

module.exports = {

    addStudent,

    getAllStudents,

    getStudentById,

    getStudentDashboard,

    getStudentsByClass,

    updateStudent,

    deleteStudent,

    getStudentAttendance,

    getStudentMarks

};