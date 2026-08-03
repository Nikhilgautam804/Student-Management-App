const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
    try {

        const students = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role='student'"
        );

        const teachers = await pool.query(
            "SELECT COUNT(*) FROM users WHERE role='teacher'"
        );

        res.json({
            students: parseInt(students.rows[0].count),
            teachers: parseInt(teachers.rows[0].count),
            subjects: 0
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

module.exports = {
    getDashboardStats
};