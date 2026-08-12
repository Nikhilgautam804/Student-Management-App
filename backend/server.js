const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const {
    verifyToken,
    authorizeRoles
} = require("./middleware/authMiddleware");

const dashboardRoutes = require("./routes/dashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classSubjectRoutes = require("./routes/classSubjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const examRoutes = require("./routes/examRoutes");
const marksRoutes = require("./routes/marksRoutes");
const profileRoutes = require("./routes/profileRoutes");

const teacherDashboardRoutes =
    require("./routes/teacherDashboardRoutes");

const pool = require("./config/db");

const app = express();

// ==================================================
// CORS
// ==================================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://student-management-frontend-f50e.onrender.com",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {

        console.log("CORS request from:", origin);

        // Allow requests without an origin
        if (!origin) {
            return callback(null, true);
        }

        // Allow known origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("CORS BLOCKED:", origin);

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
};

app.use(cors(corsOptions));

app.use(express.json());

// ==================================================
// API ROUTES
// ==================================================

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/teachers", teacherRoutes);

app.use("/api/classes", classRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/class-subjects", classSubjectRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/marks", marksRoutes);

app.use("/api/profile", profileRoutes);

app.use(
    "/api/teacher-dashboard",
    teacherDashboardRoutes
);

// ==================================================
// ROOT
// ==================================================

app.get("/", (req, res) => {
    res.send("School Management API is Running...");
});

// ==================================================
// PROTECTED PROFILE TEST
// ==================================================

app.get(
    "/profile",
    verifyToken,
    (req, res) => {

        res.json({
            message: "Protected Route Accessed",
            user: req.user
        });

    }
);

// ==================================================
// DATABASE TEST
// ==================================================

app.get(
    "/test-db",
    async (req, res) => {

        try {

            const result = await pool.query(
                "SELECT NOW()"
            );

            res.json({
                message: "Database Connected Successfully!",
                time: result.rows[0].now
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Database Connection Failed"
            });

        }

    }
);

// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server is running on port ${PORT}`
        );

    }
);