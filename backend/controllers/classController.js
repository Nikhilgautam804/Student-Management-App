const pool = require("../config/db");

// ======================================================
// Add Class
// ======================================================

const addClass = async (req, res) => {

    try {

        const {
            class_name,
            section,
            class_teacher_id,
            room_number
        } = req.body;

        const result = await pool.query(

            `
            INSERT INTO classes
            (
                class_name,
                section,
                class_teacher_id,
                room_number
            )
            VALUES($1,$2,$3,$4)
            RETURNING *
            `,

            [
                class_name,
                section,
                class_teacher_id,
                room_number
            ]

        );

        res.status(201).json(result.rows[0]);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

// ======================================================
// Get All Classes
// ======================================================

const getAllClasses = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                classes.*,

                teachers.full_name AS teacher_name

            FROM classes

            LEFT JOIN teachers

                ON classes.class_teacher_id = teachers.id

            ORDER BY classes.id
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
// Get Class By ID
// ======================================================

const getClassById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT

                classes.*,

                teachers.full_name AS teacher_name

            FROM classes

            LEFT JOIN teachers

                ON classes.class_teacher_id = teachers.id

            WHERE classes.id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Class not found"

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
// Update Class
// ======================================================

const updateClass = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            class_name,
            section,
            class_teacher_id,
            room_number

        } = req.body;

        const result = await pool.query(

            `
            UPDATE classes

            SET

                class_name = $1,
                section = $2,
                class_teacher_id = $3,
                room_number = $4

            WHERE id = $5

            RETURNING *
            `,

            [
                class_name,
                section,
                class_teacher_id,
                room_number,
                id
            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Class not found"

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
// Delete Class
// ======================================================

const deleteClass = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            DELETE FROM classes
            WHERE id = $1
            RETURNING *
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Class not found"

            });

        }

        res.status(200).json({

            message: "Class Deleted Successfully"

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
// Get My Classes
// ======================================================

const getMyClasses = async (req, res) => {

    try {

        // Find Teacher using Logged-in User
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

        const teacherId = teacherResult.rows[0].id;

        const result = await pool.query(

            `
            SELECT

                id,
                class_name,
                section,
                room_number

            FROM classes

            WHERE class_teacher_id = $1

            ORDER BY class_name
            `,

            [teacherId]

        );

        res.status(200).json(result.rows);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to fetch classes"

        });

    }

};

// ======================================================
// Exports
// ======================================================

module.exports = {

    addClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getMyClasses

};