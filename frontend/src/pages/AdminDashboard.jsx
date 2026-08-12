import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import DashboardCard from "../components/DashboardCard";
import Layout from "../components/Layout";
import api from "../services/api";


function AdminDashboard() {

    // ======================================================
    // BASIC DASHBOARD STATS
    // ======================================================

    const [stats, setStats] = useState({

        students: 0,
        teachers: 0,
        classes: 0,
        subjects: 0

    });


    // ======================================================
    // CHART DATA
    // ======================================================

    const [studentsByClass, setStudentsByClass] =
        useState([]);

    const [studentsByGender, setStudentsByGender] =
        useState([]);

    const [attendanceData, setAttendanceData] =
        useState([]);

    const [marksPerformance, setMarksPerformance] =
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
    // FETCH ALL DASHBOARD DATA
    // ======================================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    // ======================================================
    // FETCH DASHBOARD DATA
    // ======================================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);

            setChartsLoading(true);


            // ==============================================
            // BASIC STATS
            // ==============================================

            const statsResponse =
                await api.get(
                    "/dashboard/stats"
                );


            setStats(
                statsResponse.data
            );


            // ==============================================
            // STUDENTS BY CLASS
            // ==============================================

            const classResponse =
                await api.get(
                    "/dashboard/students-by-class"
                );


            const classChartData =
                classResponse.data.labels.map(
                    (label, index) => ({

                        name: label,

                        students:
                            Number(
                                classResponse.data.data[index]
                            )

                    })
                );


            setStudentsByClass(
                classChartData
            );


            // ==============================================
            // STUDENTS BY GENDER
            // ==============================================

            const genderResponse =
                await api.get(
                    "/dashboard/students-by-gender"
                );


            const genderChartData =
                genderResponse.data.labels.map(
                    (label, index) => ({

                        name: label,

                        value:
                            Number(
                                genderResponse.data.data[index]
                            )

                    })
                );


            setStudentsByGender(
                genderChartData
            );


            // ==============================================
            // ATTENDANCE OVERVIEW
            // ==============================================

            const attendanceResponse =
                await api.get(
                    "/dashboard/attendance-overview"
                );


            const attendanceChartData =
                attendanceResponse.data.labels.map(
                    (label, index) => ({

                        name: label,

                        attendance:
                            Number(
                                attendanceResponse.data.data[index]
                            )

                    })
                );


            setAttendanceData(
                attendanceChartData
            );


            // ==============================================
            // MARKS PERFORMANCE
            // ==============================================

            const marksResponse =
                await api.get(
                    "/dashboard/marks-performance"
                );


            const marksChartData =
                marksResponse.data.labels.map(
                    (label, index) => ({

                        name: label,

                        percentage:
                            Number(
                                marksResponse.data.data[index]
                            )

                    })
                );


            setMarksPerformance(
                marksChartData
            );

        }

        catch (error) {

            console.error(
                "Error fetching dashboard data:",
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
            !payload.length
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
    // PIE TOOLTIP
    // ======================================================

    const GenderTooltip = ({
        active,
        payload
    }) => {

        if (
            !active ||
            !payload ||
            !payload.length
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

                <div className="fw-bold">

                    {payload[0].name}

                </div>


                <div
                    style={{
                        color:
                            payload[0].payload.fill
                    }}
                >

                    Students:

                    {" "}

                    <strong>

                        {payload[0].value}

                    </strong>

                </div>

            </div>

        );

    };


    return (

        <Layout>

            <div className="container-fluid p-4">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-4">

                    <h2 className="fw-bold">

                        Welcome Admin 👋

                    </h2>


                    <p className="text-muted">

                        School Management System Dashboard

                    </p>

                </div>


                {/* ==================================================
                    DASHBOARD CARDS
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
                        title="Teachers"
                        value={
                            loading
                                ? "..."
                                : stats.teachers
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
                        title="Subjects"
                        value={
                            loading
                                ? "..."
                                : stats.subjects
                        }
                        color="warning"
                    />

                </div>


                {/* ==================================================
                    CHARTS ROW 1
                ================================================== */}

                <div className="row g-4 mt-2">


                    {/* ==================================================
                        STUDENTS BY CLASS
                    ================================================== */}

                    <div className="col-lg-8">

                        <div className="card border-0 shadow h-100">


                            <div className="card-header bg-transparent border-0 pt-4 px-4">

                                <h5 className="fw-bold mb-1">

                                    <i className="bi bi-bar-chart-fill text-primary me-2"></i>

                                    Students by Class

                                </h5>


                                <p className="text-muted small mb-0">

                                    Number of students enrolled
                                    in each class

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
                                                    barSize={38}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        STUDENTS BY GENDER
                    ================================================== */}

                    <div className="col-lg-4">

                        <div className="card border-0 shadow h-100">


                            <div className="card-header bg-transparent border-0 pt-4 px-4">

                                <h5 className="fw-bold mb-1">

                                    <i className="bi bi-pie-chart-fill text-success me-2"></i>

                                    Student Gender

                                </h5>


                                <p className="text-muted small mb-0">

                                    Gender distribution of students

                                </p>

                            </div>


                            <div className="card-body">


                                {chartsLoading ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            height: "300px"
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

                                ) : studentsByGender.length === 0 ? (

                                    <div
                                        className="d-flex justify-content-center align-items-center text-muted"
                                        style={{
                                            height: "300px"
                                        }}
                                    >

                                        No gender data available.

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "300px"
                                        }}
                                    >

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <PieChart>

                                                <Pie
                                                    data={
                                                        studentsByGender
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="45%"
                                                    outerRadius={90}
                                                    innerRadius={55}
                                                    paddingAngle={3}
                                                >

                                                    {
                                                        studentsByGender.map(
                                                            (entry, index) => (

                                                                <Cell
                                                                    key={
                                                                        `gender-${index}`
                                                                    }
                                                                    fill={
                                                                        chartColors[
                                                                            index %
                                                                            chartColors.length
                                                                        ]
                                                                    }
                                                                />

                                                            )
                                                        )
                                                    }

                                                </Pie>


                                                <Tooltip
                                                    content={
                                                        <GenderTooltip />
                                                    }
                                                />


                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                />

                                            </PieChart>

                                        </ResponsiveContainer>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    CHARTS ROW 2
                ================================================== */}

                <div className="row g-4 mt-2">


                    {/* ==================================================
                        ATTENDANCE
                    ================================================== */}

                    <div className="col-lg-6">

                        <div className="card border-0 shadow h-100">


                            <div className="card-header bg-transparent border-0 pt-4 px-4">

                                <h5 className="fw-bold mb-1">

                                    <i className="bi bi-calendar-check-fill text-success me-2"></i>

                                    Attendance Overview

                                </h5>


                                <p className="text-muted small mb-0">

                                    Overall attendance records

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
                                                    cursor={{
                                                        fill:
                                                            "rgba(16,185,129,0.05)"
                                                    }}
                                                />


                                                <Bar
                                                    dataKey="attendance"
                                                    name="Records"
                                                    fill="#10b981"
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


                    {/* ==================================================
                        MARKS PERFORMANCE
                    ================================================== */}

                    <div className="col-lg-6">

                        <div className="card border-0 shadow h-100">


                            <div className="card-header bg-transparent border-0 pt-4 px-4">

                                <h5 className="fw-bold mb-1">

                                    <i className="bi bi-graph-up-arrow text-warning me-2"></i>

                                    Subject Performance

                                </h5>


                                <p className="text-muted small mb-0">

                                    Average marks percentage by subject

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
                                                    cursor={{
                                                        fill:
                                                            "rgba(245,158,11,0.05)"
                                                    }}
                                                />


                                                <Bar
                                                    dataKey="percentage"
                                                    name="Average"
                                                    fill="#f59e0b"
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

                </div>


                


            </div>

        </Layout>

    );

}


export default AdminDashboard;