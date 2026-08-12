const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ======================================================
// Add Teacher
// ======================================================

const addTeacher = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            teacher_code,
            full_name,
            email,
            phone,
            gender,
            qualification,
            address
        } = req.body;

        // ==========================================
        // Basic Validation
        // ==========================================

        if (
            !teacher_code ||
            !full_name ||
            !email ||
            !phone ||
            !gender ||
            !qualification
        ) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }

        // ==========================================
        // Start Transaction
        // ==========================================

        await client.query("BEGIN");

        // ==========================================
        // Check Duplicate Teacher Code
        // ==========================================

        const existingTeacher = await client.query(
            `
            SELECT id
            FROM teachers
            WHERE teacher_code = $1
            `,
            [teacher_code]
        );

        if (existingTeacher.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Teacher Code already exists."
            });

        }

        // ==========================================
        // Check Duplicate Username
        // Username = Teacher Code
        // ==========================================

        const existingUser = await client.query(
            `
            SELECT id
            FROM users
            WHERE username = $1
            `,
            [teacher_code]
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

        const defaultPassword = "teacher123";

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
                is_active,
                email,
                phone,
                address
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, username, role
            `,
            [
                teacher_code,
                hashedPassword,
                "teacher",
                true,
                email,
                phone,
                address
            ]
        );

        const userId = userResult.rows[0].id;

        // ==========================================
        // Create Teacher Profile
        // ==========================================

        const teacherResult = await client.query(
            `
            INSERT INTO teachers
            (
                user_id,
                teacher_code,
                full_name,
                email,
                phone,
                gender,
                qualification,
                address
            )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                userId,
                teacher_code,
                full_name,
                email,
                phone,
                gender,
                qualification,
                address
            ]
        );

        // ==========================================
        // Commit
        // ==========================================

        await client.query("COMMIT");

        // ==========================================
        // Send Response
        // ==========================================

        res.status(201).json({

            message: "Teacher Added Successfully",

            teacher: teacherResult.rows[0],

            credential: {
                username: teacher_code,
                password: defaultPassword
            }

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Add Teacher Error:",
            error
        );

        if (error.code === "23505") {

            return res.status(400).json({
                message:
                    "Teacher Code, Username or Email already exists."
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
// Get All Teachers
// ======================================================

const getAllTeachers = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                teachers.*,
                users.username,
                users.is_active
            FROM teachers
            LEFT JOIN users
                ON teachers.user_id = users.id
            ORDER BY teachers.id ASC
            `
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


// ======================================================
// Get Teacher By ID
// ======================================================

const getTeacherById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                teachers.*,
                users.username,
                users.is_active
            FROM teachers
            LEFT JOIN users
                ON teachers.user_id = users.id
            WHERE teachers.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Teacher not found"
            });

        }

        res.status(200).json(result.rows[0]);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ======================================================
// Update Teacher
// ======================================================

const updateTeacher = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        const {
            teacher_code,
            full_name,
            email,
            phone,
            gender,
            qualification,
            address
        } = req.body;

        await client.query("BEGIN");

        // ==========================================
        // Get Existing Teacher
        // ==========================================

        const existingTeacher = await client.query(
            `
            SELECT
                id,
                user_id,
                teacher_code
            FROM teachers
            WHERE id = $1
            `,
            [id]
        );

        if (existingTeacher.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Teacher not found"
            });

        }

        const teacher = existingTeacher.rows[0];

        // ==========================================
        // Check Duplicate Teacher Code
        // ==========================================

        const duplicateTeacher = await client.query(
            `
            SELECT id
            FROM teachers
            WHERE teacher_code = $1
            AND id <> $2
            `,
            [
                teacher_code,
                id
            ]
        );

        if (duplicateTeacher.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Teacher Code already exists."
            });

        }

        // ==========================================
        // Check Duplicate Username
        // ==========================================

        const duplicateUser = await client.query(
            `
            SELECT id
            FROM users
            WHERE username = $1
            AND id <> $2
            `,
            [
                teacher_code,
                teacher.user_id
            ]
        );

        if (duplicateUser.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Username already exists."
            });

        }

        // ==========================================
        // Update Teacher
        // ==========================================

        const result = await client.query(
            `
            UPDATE teachers
            SET
                teacher_code = $1,
                full_name = $2,
                email = $3,
                phone = $4,
                gender = $5,
                qualification = $6,
                address = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
            `,
            [
                teacher_code,
                full_name,
                email,
                phone,
                gender,
                qualification,
                address,
                id
            ]
        );

        // ==========================================
        // Update User Login Information
        // ==========================================

        await client.query(
            `
            UPDATE users
            SET
                username = $1,
                email = $2,
                phone = $3,
                address = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            `,
            [
                teacher_code,
                email,
                phone,
                address,
                teacher.user_id
            ]
        );

        // ==========================================
        // Commit
        // ==========================================

        await client.query("COMMIT");

        res.status(200).json({

            message: "Teacher Updated Successfully",

            teacher: result.rows[0]

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Update Teacher Error:",
            error
        );

        if (error.code === "23505") {

            return res.status(400).json({
                message:
                    "Teacher Code, Username or Email already exists."
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
// Delete Teacher
// ======================================================

const deleteTeacher = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        await client.query("BEGIN");

        // ==========================================
        // Get Associated User
        // ==========================================

        const teacherResult = await client.query(
            `
            SELECT user_id
            FROM teachers
            WHERE id = $1
            `,
            [id]
        );

        if (teacherResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Teacher not found"
            });

        }

        const userId =
            teacherResult.rows[0].user_id;

        // ==========================================
        // Delete Teacher
        // ==========================================

        await client.query(
            `
            DELETE FROM teachers
            WHERE id = $1
            `,
            [id]
        );

        // ==========================================
        // Delete Login Account
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

        // ==========================================
        // Commit
        // ==========================================

        await client.query("COMMIT");

        res.status(200).json({
            message: "Teacher Deleted Successfully"
        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Delete Teacher Error:",
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
// Get My Students
// ======================================================

const getMyStudents = async (req, res) => {

    try {

        // ==========================================
        // Find Teacher Using Logged-in User
        // ==========================================

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

        // ==========================================
        // Get Students Assigned to Teacher
        // ==========================================

        const result = await pool.query(
            `
            SELECT

                s.id,
                s.roll_no,
                s.full_name,
                s.email,
                s.phone,
                s.gender,

                c.class_name,
                c.section

            FROM students s

            JOIN classes c
                ON s.class_id = c.id

            WHERE c.class_teacher_id = $1

            ORDER BY s.roll_no
            `,
            [teacherId]
        );

        res.status(200).json(result.rows);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch students"
        });

    }

};


// ======================================================
// Export Controllers
// ======================================================

module.exports = {

    addTeacher,

    getAllTeachers,

    getTeacherById,

    updateTeacher,

    deleteTeacher,

    getMyStudents

};