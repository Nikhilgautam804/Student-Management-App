import { useEffect, useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import DashboardCard from "../components/DashboardCard";
import Layout from "../components/Layout";
import api from "../services/api";


function TeacherDashboard() {

    // ======================================================
    // DASHBOARD STATS
    // ======================================================

    const [stats, setStats] = useState({

        students: 0,
        classes: 0,
        subjects: 0,
        exams: 0

    });


    // ======================================================
    // CHART DATA
    // ======================================================

    const [studentsByClass, setStudentsByClass] =
        useState([]);

    const [attendanceData, setAttendanceData] =
        useState([]);

    const [marksPerformance, setMarksPerformance] =
        useState([]);


    // ======================================================
    // SUBJECTS & CLASSES
    // ======================================================

    const [subjects, setSubjects] =
        useState([]);

    const [classes, setClasses] =
        useState([]);


    // ======================================================
    // LOADING
    // ======================================================

    const [loading, setLoading] =
        useState(true);

    const [chartsLoading, setChartsLoading] =
        useState(true);


    // ======================================================
    // COLORS
    // ======================================================

    const chartColors = [
        "#4f46e5",
        "#8b5cf6",
        "#06b6d4",
        "#10b981",
        "#f59e0b",
        "#ef4444"
    ];


    // ======================================================
    // FETCH DASHBOARD DATA
    // ======================================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    // ======================================================
    // FETCH ALL DATA
    // ======================================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            setChartsLoading(true);


            // ==================================================
            // DASHBOARD STATS
            // ==================================================

            const statsResponse =
                await api.get(
                    "/teacher-dashboard/stats"
                );


            setStats(
                statsResponse.data
            );


            // ==================================================
            // STUDENTS BY CLASS
            // ==================================================

            const classChartResponse =
                await api.get(
                    "/teacher-dashboard/students-by-class"
                );


            setStudentsByClass(
                classChartResponse.data || []
            );


            // ==================================================
            // ATTENDANCE
            // ==================================================

            const attendanceResponse =
                await api.get(
                    "/teacher-dashboard/attendance-overview"
                );


            setAttendanceData(
                attendanceResponse.data || []
            );


            // ==================================================
            // MARKS PERFORMANCE
            // ==================================================

            const marksResponse =
                await api.get(
                    "/teacher-dashboard/marks-performance"
                );


            setMarksPerformance(
                marksResponse.data || []
            );


            // ==================================================
            // SUBJECTS
            // ==================================================

            const subjectsResponse =
                await api.get(
                    "/teacher-dashboard/subjects"
                );


            setSubjects(
                subjectsResponse.data || []
            );


            // ==================================================
            // CLASSES
            // ==================================================

            const classesResponse =
                await api.get(
                    "/teacher-dashboard/classes"
                );


            setClasses(
                classesResponse.data || []
            );

        }

        catch (error) {

            console.error(
                "Teacher Dashboard Error:",
                error
            );

        }

        finally {

            setLoading(false);

            setChartsLoading(false);

        }

    };


    // ======================================================
    // CUSTOM TOOLTIP
    // ======================================================

    const CustomTooltip = ({
        active,
        payload,
        label
    }) => {

        if (
            !active ||
            !payload ||
            payload.length === 0
        ) {

            return null;

        }


        return (

            <div
                style={{
                    background: "#ffffff",
                    border:
                        "1px solid rgba(15, 23, 42, 0.08)",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.12)"
                }}
            >

                <div
                    className="fw-bold mb-1"
                    style={{
                        color: "#1f2937"
                    }}
                >

                    {label}

                </div>


                <div
                    style={{
                        color:
                            payload[0].color ||
                            "#4f46e5"
                    }}
                >

                    {payload[0].name}:

                    {" "}

                    <strong>

                        {payload[0].value}

                    </strong>

                </div>

            </div>

        );

    };


    // ======================================================
    // ATTENDANCE COLORS
    // ======================================================

    const getAttendanceColor = (name) => {

        const value =
            name?.toLowerCase();


        if (value === "present") {
            return "#10b981";
        }

        if (value === "absent") {
            return "#ef4444";
        }

        if (value === "late") {
            return "#f59e0b";
        }

        if (value === "leave") {
            return "#06b6d4";
        }

        return "#4f46e5";

    };


    return (

        <Layout>

            <div className="container-fluid p-4">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-4">

                    <h2 className="fw-bold">

                        Welcome Teacher 👋

                    </h2>


                    <p className="text-muted">

                        Manage your classes, attendance and exams
                        from one place.

                    </p>

                </div>


                {/* ==================================================
                    STATISTICS
                ================================================== */}

                <div className="row g-4">


                    <DashboardCard
                        title="Students"
                        value={
                            loading
                                ? "..."
                                : stats.students
                        }
                        color="primary"
                    />


                    <DashboardCard
                        title="Subjects"
                        value={
                            loading
                                ? "..."
                                : stats.subjects
                        }
                        color="success"
                    />


                    <DashboardCard
                        title="Classes"
                        value={
                            loading
                                ? "..."
                                : stats.classes
                        }
                        color="info"
                    />


                    <DashboardCard
                        title="Exams"
                        value={
                            loading
                                ? "..."
                                : stats.exams
                        }
                        color="danger"
                    />

                </div>


                {/* ==================================================
                    CHART ROW
                ================================================== */}

                <div className="row g-4 mt-2">


                    {/* ==================================================
                        STUDENTS BY CLASS
                    ================================================== */}

                    <div className="col-lg-7">

                        <div className="card border-0 shadow h-100">


                            <div
                                className="card-header bg-transparent border-0 pt-4 px-4"
                            >

                                <h5 className="fw-bold mb-1">

                                    <i
                                        className="bi bi-bar-chart-fill text-primary me-2"
                                    ></i>

                                    Students by Class

                                </h5>


                                <p className="text-muted small mb-0">

                                    Number of students in your
                                    assigned classes

                                </p>

                            </div>


                            <div className="card-body">


                                {chartsLoading ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >

                                            <span className="visually-hidden">

                                                Loading...

                                            </span>

                                        </div>

                                    </div>

                                ) : studentsByClass.length === 0 ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center text-muted"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        No class data available.

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "320px"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    studentsByClass
                                                }
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 10
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="rgba(15,23,42,0.08)"
                                                />


                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <YAxis
                                                    allowDecimals={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <Tooltip
                                                    content={
                                                        <CustomTooltip />
                                                    }
                                                    cursor={{
                                                        fill:
                                                            "rgba(79,70,229,0.05)"
                                                    }}
                                                />


                                                <Bar
                                                    dataKey="students"
                                                    name="Students"
                                                    fill="#4f46e5"
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0
                                                    ]}
                                                    barSize={45}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ATTENDANCE OVERVIEW
                    ================================================== */}

                    <div className="col-lg-5">

                        <div className="card border-0 shadow h-100">


                            <div
                                className="card-header bg-transparent border-0 pt-4 px-4"
                            >

                                <h5 className="fw-bold mb-1">

                                    <i
                                        className="bi bi-calendar-check-fill text-success me-2"
                                    ></i>

                                    Attendance Overview

                                </h5>


                                <p className="text-muted small mb-0">

                                    Attendance records for your students

                                </p>

                            </div>


                            <div className="card-body">


                                {chartsLoading ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        <div
                                            className="spinner-border text-success"
                                            role="status"
                                        >

                                            <span className="visually-hidden">

                                                Loading...

                                            </span>

                                        </div>

                                    </div>

                                ) : attendanceData.length === 0 ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center text-muted"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        No attendance data available.

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "320px"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    attendanceData
                                                }
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 10
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="rgba(15,23,42,0.08)"
                                                />


                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <YAxis
                                                    allowDecimals={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <Tooltip
                                                    content={
                                                        <CustomTooltip />
                                                    }
                                                />


                                                <Bar
                                                    dataKey="attendance"
                                                    name="Records"
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0
                                                    ]}
                                                    barSize={45}
                                                >

                                                    {
                                                        attendanceData.map(
                                                            (
                                                                entry,
                                                                index
                                                            ) => (

                                                                <Cell
                                                                    key={
                                                                        `attendance-${index}`
                                                                    }
                                                                    fill={
                                                                        getAttendanceColor(
                                                                            entry.name
                                                                        )
                                                                    }
                                                                />

                                                            )
                                                        )
                                                    }

                                                </Bar>

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    MARKS PERFORMANCE
                ================================================== */}

                <div className="row g-4 mt-2">

                    <div className="col-12">

                        <div className="card border-0 shadow">


                            <div
                                className="card-header bg-transparent border-0 pt-4 px-4"
                            >

                                <h5 className="fw-bold mb-1">

                                    <i
                                        className="bi bi-graph-up-arrow text-warning me-2"
                                    ></i>

                                    Subject Performance

                                </h5>


                                <p className="text-muted small mb-0">

                                    Average marks percentage for
                                    your subjects

                                </p>

                            </div>


                            <div className="card-body">


                                {chartsLoading ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        <div
                                            className="spinner-border text-warning"
                                            role="status"
                                        >

                                            <span className="visually-hidden">

                                                Loading...

                                            </span>

                                        </div>

                                    </div>

                                ) : marksPerformance.length === 0 ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center text-muted"
                                        style={{
                                            height: "320px"
                                        }}
                                    >

                                        No marks data available.

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "320px"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={
                                                    marksPerformance
                                                }
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 10
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="rgba(15,23,42,0.08)"
                                                />


                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <YAxis
                                                    domain={[
                                                        0,
                                                        100
                                                    ]}
                                                    allowDecimals={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b"
                                                    }}
                                                />


                                                <Tooltip
                                                    content={
                                                        <CustomTooltip />
                                                    }
                                                />


                                                <Legend />


                                                <Bar
                                                    dataKey="percentage"
                                                    name="Average %"
                                                    fill="#f59e0b"
                                                    radius={[
                                                        8,
                                                        8,
                                                        0,
                                                        0
                                                    ]}
                                                    barSize={55}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    SUBJECTS & CLASSES
                ================================================== */}

                <div className="row g-4 mt-2">


                    {/* ==================================================
                        MY SUBJECTS
                    ================================================== */}

                    <div className="col-lg-6">

                        <div className="card shadow border-0 h-100">


                            <div
                                className="card-header bg-primary text-white fw-bold"
                            >

                                <i
                                    className="bi bi-book-fill me-2"
                                ></i>

                                My Subjects

                            </div>


                            {
                                subjects.length === 0 ? (

                                    <div
                                        className="card-body text-muted"
                                    >

                                        No subjects assigned.

                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {
                                            subjects.map(
                                                (subject) => (

                                                    <li
                                                        key={
                                                            subject.id
                                                        }
                                                        className="list-group-item d-flex align-items-center"
                                                    >

                                                        <div
                                                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                                                            style={{
                                                                width: "38px",
                                                                height: "38px"
                                                            }}
                                                        >

                                                            <i className="bi bi-book"></i>

                                                        </div>


                                                        <span className="fw-semibold">

                                                            {
                                                                subject.subject_name
                                                            }

                                                        </span>

                                                    </li>

                                                )
                                            )
                                        }

                                    </ul>

                                )
                            }

                        </div>

                    </div>


                    {/* ==================================================
                        ASSIGNED CLASSES
                    ================================================== */}

                    <div className="col-lg-6">

                        <div className="card shadow border-0 h-100">


                            <div
                                className="card-header bg-success text-white fw-bold"
                            >

                                <i
                                    className="bi bi-building me-2"
                                ></i>

                                Assigned Classes

                            </div>


                            {
                                classes.length === 0 ? (

                                    <div
                                        className="card-body text-muted"
                                    >

                                        No classes assigned.

                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {
                                            classes.map(
                                                (item) => (

                                                    <li
                                                        key={
                                                            item.id
                                                        }
                                                        className="list-group-item"
                                                    >

                                                        <div className="d-flex align-items-center">


                                                            <div
                                                                className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px"
                                                                }}
                                                            >

                                                                <i className="bi bi-building"></i>

                                                            </div>


                                                            <div>

                                                                <div className="fw-semibold">

                                                                    Class{" "}

                                                                    {
                                                                        item.class_name
                                                                    }

                                                                    {" - "}

                                                                    {
                                                                        item.section
                                                                    }

                                                                </div>


                                                                <small className="text-muted">

                                                                    {
                                                                        item.student_count
                                                                    }

                                                                    {" "}
                                                                    Students

                                                                    {
                                                                        item.room_number
                                                                            ? ` • Room ${item.room_number}`
                                                                            : ""
                                                                    }

                                                                </small>

                                                            </div>

                                                        </div>

                                                    </li>

                                                )
                                            )
                                        }

                                    </ul>

                                )
                            }

                        </div>

                    </div>

                </div>


                


            </div>

        </Layout>

    );

}


export default TeacherDashboard;