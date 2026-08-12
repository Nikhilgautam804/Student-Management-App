import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function StudentAttendance() {

    const [loading, setLoading] = useState(false);

    const [attendanceMode, setAttendanceMode] = useState("today");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [attendance, setAttendance] = useState({

        attendance_percentage: 0,

        present: 0,

        absent: 0,

        records: []

    });

    const fetchAttendance = async (date = "") => {

        try {

            setLoading(true);

            let response;

            if (date === "") {

                response = await api.get(
                    "/students/attendance"
                );

            }

            else {

                response = await api.get(

                    `/students/attendance?date=${date}`

                );

            }

            setAttendance(response.data);

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to load attendance."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAttendance();

    }, []);

    return (

        <Layout>
            <div className="container-fluid p-4">

    {/* Header */}

    <div className="mb-4">

        <h2 className="fw-bold">

            My Attendance

        </h2>

        <p className="text-muted">

            View your attendance records and attendance summary.

        </p>

    </div>

    {/* Attendance Options */}

    <div className="card shadow border-0 rounded-4 mb-4">

        <div className="card-body">

            <div className="row g-3 align-items-end">

                <div className="col-md-6">

                    <button

                        className={`btn w-100 ${
                            attendanceMode === "today"
                                ? "btn-primary"
                                : "btn-outline-primary"
                        }`}

                        onClick={() => {

                            setAttendanceMode("today");

                            fetchAttendance();

                        }}

                    >

                        <i className="bi bi-calendar-check-fill me-2"></i>

                        Today's Attendance

                    </button>

                </div>

                <div className="col-md-6">

                    <button

                        className={`btn w-100 ${
                            attendanceMode === "previous"
                                ? "btn-success"
                                : "btn-outline-success"
                        }`}

                        onClick={() => {

                            setAttendanceMode("previous");

                        }}

                    >

                        <i className="bi bi-calendar-event-fill me-2"></i>

                        Previous Attendance

                    </button>

                </div>

            </div>

        </div>

    </div>
    {/* Previous Attendance Date */}

{attendanceMode === "previous" && (

    <div className="card shadow border-0 rounded-4 mb-4">

        <div className="card-body">

            <div className="row align-items-end g-3">

                <div className="col-md-6">

                    <label className="form-label fw-semibold">

                        Select Date

                    </label>

                    <input

                        type="date"

                        className="form-control"

                        value={selectedDate}

                        max={new Date().toISOString().split("T")[0]}

                        onChange={(e) =>

                            setSelectedDate(e.target.value)

                        }

                    />

                </div>

                <div className="col-md-3">

                    <button

                        className="btn btn-primary w-100"

                        onClick={() =>

                            fetchAttendance(selectedDate)

                        }

                        disabled={loading}

                    >

                        {loading ? (

                            <>

                                <span

                                    className="spinner-border spinner-border-sm me-2"

                                ></span>

                                Loading...

                            </>

                        ) : (

                            <>

                                <i className="bi bi-search me-2"></i>

                                Check Attendance

                            </>

                        )}

                    </button>

                </div>

                <div className="col-md-3">

                    <button

                        className="btn btn-secondary w-100"

                        onClick={() => {

                            const today = new Date()

                                .toISOString()

                                .split("T")[0];

                            setSelectedDate(today);

                        }}

                    >

                        <i className="bi bi-arrow-clockwise me-2"></i>

                        Reset

                    </button>

                </div>

            </div>

        </div>

    </div>

)}
{/* Attendance Summary */}

<div className="row g-4 mb-4">

    <div className="col-md-4">

        <div className="card shadow border-0 rounded-4">

            <div className="card-body text-center">

                <i className="bi bi-pie-chart-fill text-primary fs-1"></i>

                <h6 className="mt-3 text-muted">

                    Attendance Percentage

                </h6>

                <h2 className="fw-bold text-primary">

                    {attendance.attendance_percentage}%

                </h2>

            </div>

        </div>

    </div>

    <div className="col-md-4">

        <div className="card shadow border-0 rounded-4">

            <div className="card-body text-center">

                <i className="bi bi-check-circle-fill text-success fs-1"></i>

                <h6 className="mt-3 text-muted">

                    Present

                </h6>

                <h2 className="fw-bold text-success">

                    {attendance.present}

                </h2>

            </div>

        </div>

    </div>

    <div className="col-md-4">

        <div className="card shadow border-0 rounded-4">

            <div className="card-body text-center">

                <i className="bi bi-x-circle-fill text-danger fs-1"></i>

                <h6 className="mt-3 text-muted">

                    Absent

                </h6>

                <h2 className="fw-bold text-danger">

                    {attendance.absent}

                </h2>

            </div>

        </div>

    </div>

</div>
{/* Attendance Records */}

<div className="card shadow border-0 rounded-4">

    <div className="card-header bg-dark text-white fw-bold">

        <i className="bi bi-list-check me-2"></i>

        Attendance Records

    </div>

    <div className="card-body">

        {attendance.records.length === 0 ? (

            <div className="text-center py-5">

                <i className="bi bi-calendar-x fs-1 text-secondary"></i>

                <h5 className="mt-3">

                    No Attendance Records Found

                </h5>

                <p className="text-muted mb-0">

                    Attendance may not have been scheduled for the selected date.

                </p>

                <p className="text-muted">

                    It could also have been a holiday.

                </p>

            </div>

        ) : (

            <div className="table-responsive">

                <table className="table table-hover align-middle">

                    <thead className="table-light">

                        <tr>

                            <th width="10%">#</th>

                            <th>Subject</th>

                            <th width="20%">Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {attendance.records.map((record, index) => (

                            <tr key={index}>

                                <td>

                                    {index + 1}

                                </td>

                                <td>

                                    {record.subject_name}

                                </td>

                                <td>

                                    {record.status === "Present" ? (

                                        <span className="badge bg-success px-3 py-2">

                                            <i className="bi bi-check-circle-fill me-1"></i>

                                            Present

                                        </span>

                                    ) : record.status === "Absent" ? (

                                        <span className="badge bg-danger px-3 py-2">

                                            <i className="bi bi-x-circle-fill me-1"></i>

                                            Absent

                                        </span>

                                    ) : (

                                        <span className="badge bg-secondary px-3 py-2">

                                            {record.status}

                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        )}

    </div>

</div>
        </div>

    </Layout>

);

}

export default StudentAttendance;
