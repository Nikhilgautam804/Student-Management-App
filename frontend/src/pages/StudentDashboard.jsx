import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardCard from "../components/DashboardCard";
import Layout from "../components/Layout";
import api from "../services/api";

function StudentDashboard() {

    const navigate = useNavigate();


    // ==========================================
    // State
    // ==========================================

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({

        student_name: "",

        roll_no: "",

        class_name: "",

        section: "",

        attendance_percentage: 0,

        average_marks: 0,

        total_subjects: 0,

        upcoming_exams: 0,

        today_attendance: [],

        upcoming_exam_list: []

    });


    // ==========================================
    // Fetch Dashboard
    // ==========================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);


            const response =
                await api.get("/students/dashboard");


            setDashboard({

                ...response.data,

                today_attendance:
                    response.data.today_attendance || [],

                upcoming_exam_list:
                    response.data.upcoming_exam_list || []

            });

        }

        catch (error) {

            console.error(
                "Student Dashboard Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Load Dashboard
    // ==========================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <Layout>

                <div className="container-fluid p-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >

                        <span className="visually-hidden">
                            Loading...
                        </span>

                    </div>


                    <h5 className="mt-3">

                        Loading Dashboard...

                    </h5>

                </div>

            </Layout>

        );

    }


    // ==========================================
    // Format Exam Date
    // ==========================================

    const formatExamDate = (date) => {

        if (!date) {

            return "N/A";

        }


        const examDate = new Date(date);


        if (isNaN(examDate.getTime())) {

            return "N/A";

        }


        return examDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // Filter Upcoming Exams
    // TODAY + FUTURE ONLY
    // ==========================================

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcomingExams =
        dashboard.upcoming_exam_list
            .filter((exam) => {

                if (!exam.date) {

                    return false;

                }


                const examDate =
                    new Date(exam.date);


                if (isNaN(examDate.getTime())) {

                    return false;

                }


                examDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return examDate >= today;

            })
            .sort((a, b) => {

                return (
                    new Date(a.date) -
                    new Date(b.date)
                );

            });


    // ==========================================
    // Dashboard
    // ==========================================

    return (

        <Layout>

            <div className="container-fluid p-4">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-4">

                    <h2 className="fw-bold">

                        Welcome {dashboard.student_name} 👋

                    </h2>


                    <p className="text-muted">

                        Roll No :

                        <strong>
                            {" "}
                            {dashboard.roll_no}
                        </strong>


                        &nbsp; | &nbsp;


                        Class :

                        <strong>

                            {" "}

                            {dashboard.class_name}

                            {" - "}

                            {dashboard.section}

                        </strong>

                    </p>

                </div>


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="row g-4">


                    {/* ======================================
                        Attendance Pie Chart
                    ====================================== */}

                    <div className="col-md-6 col-lg-3">

                        <div className="card shadow border-0 rounded-4 h-100">

                            <div className="card-header bg-primary text-white fw-bold">
                                <i className="bi bi-pie-chart-fill me-2"></i>
                                Total Attendance
                            </div>

                            <div className="card-body d-flex flex-column align-items-center justify-content-center">

                                {(() => {
                                    const attendance = Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(dashboard.attendance_percentage) || 0
                                        )
                                    );

                                    const radius = 52;
                                    const circumference = 2 * Math.PI * radius;
                                    const dash = (attendance / 100) * circumference;

                                    return (
                                        <>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    width: "150px",
                                                    height: "150px"
                                                }}
                                            >
                                                <svg
                                                    width="150"
                                                    height="150"
                                                    viewBox="0 0 120 120"
                                                    style={{
                                                        transform: "rotate(-90deg)"
                                                    }}
                                                >
                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#e9ecef"
                                                        strokeWidth="14"
                                                    />

                                                    <circle
                                                        cx="60"
                                                        cy="60"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#0d6efd"
                                                        strokeWidth="14"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${dash} ${circumference}`}
                                                    />
                                                </svg>

                                                <div
                                                    className="position-absolute top-50 start-50 translate-middle text-center"
                                                    style={{ width: "100%" }}
                                                >
                                                    <div className="fw-bold fs-3">
                                                        {attendance}%
                                                    </div>

                                                    <small className="text-muted">
                                                        Present
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-4 mt-3">

                                                <div className="text-center">
                                                    <div className="fw-bold text-primary">
                                                        {attendance}%
                                                    </div>
                                                    <small className="text-muted">
                                                        Present
                                                    </small>
                                                </div>

                                                <div className="text-center">
                                                    <div className="fw-bold text-secondary">
                                                        {(100 - attendance).toFixed(1)}%
                                                    </div>
                                                    <small className="text-muted">
                                                        Absent
                                                    </small>
                                                </div>

                                            </div>
                                        </>
                                    );
                                })()}

                            </div>

                        </div>

                    </div>


                    {/* ======================================
                        Average Marks
                    ====================================== */}

                    <DashboardCard 

                        title="Average Marks"

                        value={
                            dashboard.average_marks
                        }

                        color="success"

                    />


                    {/* ======================================
                        Subjects
                    ====================================== */}

                    <DashboardCard

                        title="Subjects"

                        value={
                            dashboard.total_subjects
                        }

                        color="warning"

                    />


                    {/* ======================================
                        Upcoming Exams
                    ====================================== */}

                    <DashboardCard

                        title="Upcoming Exams"

                        value={
                            dashboard.upcoming_exams
                        }

                        color="danger"

                    />

                </div>


                {/* ==================================================
                    TODAY'S ATTENDANCE + UPCOMING EXAMS
                ================================================== */}

                <div className="row mt-4">


                    {/* ==============================================
                        TODAY'S ATTENDANCE
                    ============================================== */}

                    <div className="col-lg-6 mb-4">

                        <div className="card shadow border-0 rounded-4 h-100">


                            <div className="card-header bg-primary text-white fw-bold">

                                <i className="bi bi-calendar-check-fill me-2"></i>

                                Today's Attendance

                            </div>


                            <div className="card-body p-0">


                                {dashboard.today_attendance.length === 0 ? (

                                    <div className="text-center text-muted p-5">

                                        <i className="bi bi-calendar-x fs-1 d-block mb-3"></i>


                                        <h6 className="fw-bold">

                                            No attendance recorded today

                                        </h6>


                                        <small>

                                            Today's attendance has not been
                                            marked yet.

                                        </small>

                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {dashboard.today_attendance.map(
                                            (item, index) => (

                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                >

                                                    <span className="fw-semibold">

                                                        {item.subject}

                                                    </span>


                                                    {item.status === "Present" ? (

                                                        <span className="badge bg-success rounded-pill">

                                                            Present

                                                        </span>

                                                    ) : item.status === "Absent" ? (

                                                        <span className="badge bg-danger rounded-pill">

                                                            Absent

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-warning text-dark rounded-pill">

                                                            {item.status}

                                                        </span>

                                                    )}

                                                </li>

                                            )
                                        )}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==============================================
                        UPCOMING EXAMS
                    ============================================== */}

                    <div className="col-lg-6 mb-4">

                        <div className="card shadow border-0 rounded-4 h-100">


                            {/* Header */}

                            <div className="card-header bg-success text-white fw-bold">

                                <i className="bi bi-file-earmark-text-fill me-2"></i>

                                Upcoming Exams

                            </div>


                            {/* Body */}

                            <div className="card-body p-0">


                                {upcomingExams.length === 0 ? (

                                    <div className="text-center text-muted p-5">

                                        <i className="bi bi-calendar-x fs-1 d-block mb-3"></i>


                                        <h6 className="fw-bold">

                                            No upcoming exams

                                        </h6>


                                        <small>

                                            There are no upcoming exams
                                            scheduled at the moment.

                                        </small>

                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {upcomingExams.map(
                                            (exam) => (

                                                <li
                                                    key={exam.id}
                                                    className="list-group-item"
                                                >

                                                    <div className="d-flex justify-content-between align-items-center">


                                                        {/* ==================================
                                                            Exam Name
                                                        ================================== */}

                                                        <div className="d-flex align-items-center">

                                                            <i
                                                                className="bi bi-calendar-event text-success me-3"
                                                                style={{
                                                                    fontSize: "20px"
                                                                }}
                                                            ></i>


                                                            <span className="fw-semibold">

                                                                {exam.exam ||
                                                                    "Unnamed Exam"}

                                                            </span>

                                                        </div>


                                                        {/* ==================================
                                                            Exam Date
                                                        ================================== */}

                                                        <span className="badge bg-warning text-dark">

                                                            {formatExamDate(
                                                                exam.date
                                                            )}

                                                        </span>

                                                    </div>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    QUICK ACTIONS
                ================================================== */}

                <div className="card shadow border-0 rounded-4">


                    <div className="card-header bg-dark text-white fw-bold">

                        <i className="bi bi-lightning-fill me-2"></i>

                        Quick Actions

                    </div>


                    <div className="card-body">


                        <div className="row g-3">


                            {/* ======================================
                                ATTENDANCE
                            ====================================== */}

                            <div className="col-md-4">

                                <button
                                    type="button"
                                    className="btn btn-primary w-100 py-3"
                                    onClick={() =>
                                        navigate(
                                            "/student/attendance"
                                        )
                                    }
                                >

                                    <i className="bi bi-calendar-check-fill fs-4 d-block mb-2"></i>

                                    My Attendance

                                </button>

                            </div>


                            {/* ======================================
                                MARKS
                            ====================================== */}

                            <div className="col-md-4">

                                <button
                                    type="button"
                                    className="btn btn-success w-100 py-3"
                                    onClick={() =>
                                        navigate(
                                            "/student/marks"
                                        )
                                    }
                                >

                                    <i className="bi bi-clipboard-data-fill fs-4 d-block mb-2"></i>

                                    My Marks

                                </button>

                            </div>


                            {/* ======================================
                                PROFILE
                            ====================================== */}

                            <div className="col-md-4">

                                <button
                                    type="button"
                                    className="btn btn-info text-white w-100 py-3"
                                    onClick={() =>
                                        navigate(
                                            "/student/profile"
                                        )
                                    }
                                >

                                    <i className="bi bi-person-fill fs-4 d-block mb-2"></i>

                                    My Profile

                                </button>

                            </div>


                        </div>

                    </div>

                </div>


            </div>

        </Layout>

    );

}


export default StudentDashboard;