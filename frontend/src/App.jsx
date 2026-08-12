import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";

// ==========================================
// Admin
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";

// ==========================================
// Teacher
// ==========================================

import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherStudents from "./pages/TeacherStudents";

// ==========================================
// Student
// ==========================================

import StudentAttendance from "./pages/StudentAttendance";
import StudentDashboard from "./pages/StudentDashboard";
import StudentMarks from "./pages/StudentMarks";
import StudentProfile from "./pages/StudentProfile";

// ==========================================
// Common / Admin Pages
// ==========================================

import Attendance from "./pages/Attendance";
import Classes from "./pages/Classes";
import ClassSubjects from "./pages/ClassSubjects";
import Exams from "./pages/Exams";
import Login from "./pages/Login";
import Marks from "./pages/Marks";
import Students from "./pages/students";
import Subjects from "./pages/Subjects";
import Teachers from "./pages/Teachers";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==========================================
                    ROOT
                ========================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ==========================================
                    LOGIN
                ========================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN PROFILE
                ================================================== */}

                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <AdminProfile />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    TEACHER DASHBOARD
                ================================================== */}

                <Route
                    path="/teacher"
                    element={
                        <ProtectedRoute
                            roles={["teacher"]}
                        >
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    TEACHER PROFILE
                ================================================== */}

                <Route
                    path="/teacher/profile"
                    element={
                        <ProtectedRoute
                            roles={["teacher"]}
                        >
                            <TeacherProfile />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    TEACHER STUDENTS
                ================================================== */}

                <Route
                    path="/teacher/students"
                    element={
                        <ProtectedRoute
                            roles={["teacher"]}
                        >
                            <TeacherStudents />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    STUDENT DASHBOARD
                ================================================== */}

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute
                            roles={["student"]}
                        >
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    STUDENT ATTENDANCE
                ================================================== */}

                <Route
                    path="/student/attendance"
                    element={
                        <ProtectedRoute
                            roles={["student"]}
                        >
                            <StudentAttendance />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    STUDENT MARKS
                ================================================== */}

                <Route
                    path="/student/marks"
                    element={
                        <ProtectedRoute
                            roles={["student"]}
                        >
                            <StudentMarks />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    STUDENT PROFILE
                ================================================== */}

                <Route
                    path="/student/profile"
                    element={
                        <ProtectedRoute
                            roles={["student"]}
                        >
                            <StudentProfile />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN - STUDENTS
                ================================================== */}

                <Route
                    path="/students"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <Students />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN - TEACHERS
                ================================================== */}

                <Route
                    path="/teachers"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <Teachers />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN - CLASSES
                ================================================== */}

                <Route
                    path="/classes"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <Classes />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN - SUBJECTS
                ================================================== */}

                <Route
                    path="/subjects"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <Subjects />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN - CLASS SUBJECTS
                ================================================== */}

                <Route
                    path="/class-subjects"
                    element={
                        <ProtectedRoute
                            roles={["admin"]}
                        >
                            <ClassSubjects />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ATTENDANCE
                    ADMIN + TEACHER
                ================================================== */}

                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute
                            roles={["admin", "teacher"]}
                        >
                            <Attendance />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    MARKS
                    ADMIN + TEACHER
                ================================================== */}

                <Route
                    path="/marks"
                    element={
                        <ProtectedRoute
                            roles={["admin", "teacher"]}
                        >
                            <Marks />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    EXAMS
                    ADMIN + TEACHER
                ================================================== */}

                <Route
                    path="/exams"
                    element={
                        <ProtectedRoute
                            roles={["admin", "teacher"]}
                        >
                            <Exams />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    INVALID ROUTE
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>


            {/* ==================================================
                TOAST CONTAINER
            ================================================== */}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />

        </BrowserRouter>

    );

}

export default App;