import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function StudentMarks() {

    const [exams, setExams] = useState([]);

    const [examTypes, setExamTypes] = useState([]);

    const [selectedExamType, setSelectedExamType] = useState("");

    const [selectedExam, setSelectedExam] = useState("");

    const [marks, setMarks] = useState({

        average: 0,

        percentage: 0,

        uploaded_subjects: 0,

        total_subjects: 0,

        all_uploaded: false,

        result: "Not Available",

        subjects: []

    });

    const [loading, setLoading] = useState(false);

    const [loadingExams, setLoadingExams] = useState(false);


    // ======================================
    // Fetch Exams
    // ======================================

    const fetchExams = async () => {

        try {

            setLoadingExams(true);

            const response = await api.get("/exams");

            setExams(response.data);

            // Get unique exam types

            const types = [

                ...new Set(

                    response.data

                        .map((exam) => exam.exam_type)

                        .filter(Boolean)

                )

            ];

            setExamTypes(types);

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to load exams."

            );

        }

        finally {

            setLoadingExams(false);

        }

    };


    // ======================================
    // Fetch Student Marks
    // ======================================

    const fetchMarks = async () => {

        if (!selectedExam) {

            toast.warning("Please select an exam.");

            return;

        }

        try {

            setLoading(true);

            const response = await api.get(

                `/students/marks?exam_id=${selectedExam}`

            );

            setMarks(response.data);

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Unable to load marks."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ======================================
    // Load Exams On Page Load
    // ======================================

    useEffect(() => {

        fetchExams();

    }, []);


    // ======================================
    // Filter Exams By Type
    // ======================================

    const filteredExams = exams.filter(

        (exam) =>

            exam.exam_type === selectedExamType

    );


    return (

        <Layout>
                    <div className="container-fluid p-4">

            {/* Header */}

            <div className="mb-4">

                <h2 className="fw-bold">

                    My Marks

                </h2>

                <p className="text-muted">

                    View your examination marks and result.

                </p>

            </div>


            {/* Exam Selection */}

            <div className="card shadow border-0 rounded-4 mb-4">

                <div className="card-header bg-dark text-white fw-bold">

                    <i className="bi bi-clipboard-data-fill me-2"></i>

                    Select Examination

                </div>

                <div className="card-body">

                    <div className="row g-4">


                        {/* Exam Type */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Exam Type

                            </label>

                            <select

                                className="form-select"

                                value={selectedExamType}

                                onChange={(e) => {

                                    setSelectedExamType(
                                        e.target.value
                                    );

                                    setSelectedExam("");

                                    setMarks({

                                        average: 0,

                                        percentage: 0,

                                        uploaded_subjects: 0,

                                        total_subjects: 0,

                                        all_uploaded: false,

                                        result: "Not Available",

                                        subjects: []

                                    });

                                }}

                                disabled={loadingExams}

                            >

                                <option value="">

                                    {loadingExams

                                        ? "Loading Exam Types..."

                                        : "Select Exam Type"

                                    }

                                </option>

                                {examTypes.map((type) => (

                                    <option

                                        key={type}

                                        value={type}

                                    >

                                        {type}

                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Exam */}

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">

                                Exam

                            </label>

                            <select

                                className="form-select"

                                value={selectedExam}

                                onChange={(e) => {

                                    setSelectedExam(
                                        e.target.value
                                    );

                                    setMarks({

                                        average: 0,

                                        percentage: 0,

                                        uploaded_subjects: 0,

                                        total_subjects: 0,

                                        all_uploaded: false,

                                        result: "Not Available",

                                        subjects: []

                                    });

                                }}

                                disabled={!selectedExamType}

                            >

                                <option value="">

                                    {selectedExamType

                                        ? "Select Exam"

                                        : "Select Exam Type First"

                                    }

                                </option>

                                {filteredExams.map((exam) => (

                                    <option

                                        key={exam.id}

                                        value={exam.id}

                                    >

                                        {exam.exam_name}

                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>

            </div>
                        {/* View Marks */}

            <div className="card shadow border-0 rounded-4 mb-4">

                <div className="card-body text-center">

                    <button

                        className="btn btn-primary px-5 py-2"

                        onClick={fetchMarks}

                        disabled={!selectedExam || loading}

                    >

                        {loading ? (

                            <>

                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                ></span>

                                Loading Marks...

                            </>

                        ) : (

                            <>

                                <i className="bi bi-search me-2"></i>

                                View Marks

                            </>

                        )}

                    </button>

                </div>

            </div>
                        {/* Marks Summary */}

            <div className="row g-4 mb-4">

                {/* Average */}

                <div className="col-md-3">

                    <div className="card shadow border-0 rounded-4 h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-bar-chart-fill text-primary fs-1"></i>

                            <h6 className="mt-3 text-muted">

                                Average Marks

                            </h6>

                            <h2 className="fw-bold text-primary">

                                {marks.uploaded_subjects === 0
                                    ? "--"
                                    : marks.average
                                }

                            </h2>

                        </div>

                    </div>

                </div>


                {/* Percentage */}

                <div className="col-md-3">

                    <div className="card shadow border-0 rounded-4 h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-percent text-success fs-1"></i>

                            <h6 className="mt-3 text-muted">

                                Percentage

                            </h6>

                            <h2 className="fw-bold text-success">

                                {marks.uploaded_subjects === 0
                                    ? "--"
                                    : `${marks.percentage}%`
                                }

                            </h2>

                        </div>

                    </div>

                </div>


                {/* Uploaded Subjects */}

                <div className="col-md-3">

                    <div className="card shadow border-0 rounded-4 h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-cloud-check-fill text-info fs-1"></i>

                            <h6 className="mt-3 text-muted">

                                Marks Uploaded

                            </h6>

                            <h2 className="fw-bold text-info">

                                {marks.uploaded_subjects}

                                <span className="fs-5 text-muted">

                                    {" / "}

                                    {marks.total_subjects}

                                </span>

                            </h2>

                        </div>

                    </div>

                </div>


                {/* Result */}

                <div className="col-md-3">

                    <div className="card shadow border-0 rounded-4 h-100">

                        <div className="card-body text-center">

                            <i className={`bi ${
                                marks.result === "PASS"
                                    ? "bi-check-circle-fill text-success"
                                    : marks.result === "FAIL"
                                        ? "bi-x-circle-fill text-danger"
                                        : "bi-info-circle-fill text-warning"
                            } fs-1`}></i>

                            <h6 className="mt-3 text-muted">

                                Result

                            </h6>

                            <h5 className={`fw-bold mt-3 ${
                                marks.result === "PASS"
                                    ? "text-success"
                                    : marks.result === "FAIL"
                                        ? "text-danger"
                                        : "text-warning"
                            }`}>

                                {marks.uploaded_subjects === 0
                                    ? "Not Available"
                                    : marks.result
                                }

                            </h5>

                        </div>

                    </div>

                </div>

            </div>
                        {/* Subject-wise Marks */}

            <div className="card shadow border-0 rounded-4 mb-4">

                <div className="card-header bg-dark text-white fw-bold">

                    <i className="bi bi-list-check me-2"></i>

                    Subject-wise Marks

                </div>

                <div className="card-body">

                    {/* No Exam Selected */}

                    {!selectedExam ? (

                        <div className="text-center py-5">

                            <i className="bi bi-clipboard-x fs-1 text-secondary"></i>

                            <h5 className="mt-3">

                                Select an Exam

                            </h5>

                            <p className="text-muted mb-0">

                                Select an exam above to view your marks.

                            </p>

                        </div>

                    ) : marks.subjects.length === 0 ? (

                        /* No Subjects */

                        <div className="text-center py-5">

                            <i className="bi bi-file-earmark-x fs-1 text-warning"></i>

                            <h5 className="mt-3">

                                Marks Not Available

                            </h5>

                            <p className="text-muted mb-0">

                                Your marks have not been uploaded yet
                                for this examination.

                            </p>

                            <p className="text-muted">

                                Please check again later.

                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-light">

                                    <tr>

                                        <th width="10%">
                                            #
                                        </th>

                                        <th>
                                            Subject
                                        </th>

                                        <th width="25%">
                                            Marks
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {marks.subjects.map(
                                        (subject, index) => (

                                            <tr key={index}>

                                                <td>

                                                    {index + 1}

                                                </td>

                                                <td>

                                                    <span className="fw-semibold">

                                                        {subject.subject_name}

                                                    </span>

                                                </td>

                                                <td>

                                                    {subject.uploaded ? (

                                                        <span className="badge bg-success px-3 py-2">

                                                            <i className="bi bi-check-circle-fill me-1"></i>

                                                            {subject.marks_obtained}
                                                            {" / "}
                                                            {subject.max_marks}

                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-warning text-dark px-3 py-2">

                                                            <i className="bi bi-clock-fill me-1"></i>

                                                            Not Uploaded Yet

                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

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

export default StudentMarks;