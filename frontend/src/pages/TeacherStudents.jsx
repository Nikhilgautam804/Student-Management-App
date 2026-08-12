import { useEffect, useMemo, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import Layout from "../components/Layout";
import { getMyStudents } from "../services/teacherService";

function TeacherStudents() {

    // =======================
    // States
    // =======================

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [studentsPerPage, setStudentsPerPage] = useState(5);

    const [sortField, setSortField] = useState("roll_no");

    const [sortOrder, setSortOrder] = useState("asc");

    // =======================
    // Fetch Students
    // =======================

    useEffect(() => {

        fetchStudents();

    }, []);

    const fetchStudents = async () => {

        try {

            setLoading(true);

            const data = await getMyStudents();

            setStudents(data || []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    // =======================
    // Reset Page on Search
    // =======================

    useEffect(() => {

        setCurrentPage(1);

    }, [search, studentsPerPage]);

    // =======================
    // Search Filter
    // =======================

    const filteredStudents = useMemo(() => {

        const query = search.toLowerCase();

        return students.filter((student) =>

            student.roll_no.toLowerCase().includes(query)

            ||

            student.full_name.toLowerCase().includes(query)

            ||

            student.email.toLowerCase().includes(query)

            ||

            student.class_name.toLowerCase().includes(query)

            ||

            student.section.toLowerCase().includes(query)

        );

    }, [students, search]);

    // =======================
    // Sorting
    // =======================

    const handleSort = (field) => {

        if (sortField === field) {

            setSortOrder(

                sortOrder === "asc"

                    ?

                    "desc"

                    :

                    "asc"

            );

        }

        else {

            setSortField(field);

            setSortOrder("asc");

        }

    };

    const getRollNumber = (roll) => {

        return parseInt(

            String(roll).replace(/\D/g, ""),

            10

        ) || 0;

    };

    const sortedStudents = useMemo(() => {

        const temp = [...filteredStudents];

        temp.sort((a, b) => {

            let aValue = a[sortField];

            let bValue = b[sortField];

            if (sortField === "roll_no") {

                return sortOrder === "asc"

                    ?

                    getRollNumber(aValue) - getRollNumber(bValue)

                    :

                    getRollNumber(bValue) - getRollNumber(aValue);

            }

            aValue = String(aValue).toLowerCase();

            bValue = String(bValue).toLowerCase();

            return sortOrder === "asc"

                ?

                aValue.localeCompare(bValue)

                :

                bValue.localeCompare(aValue);

        });

        return temp;

    }, [

        filteredStudents,

        sortField,

        sortOrder

    ]);

    // =======================
    // Pagination
    // =======================

    const totalPages = Math.ceil(

        sortedStudents.length /

        studentsPerPage

    );

    const indexOfLastStudent =

        currentPage *

        studentsPerPage;

    const indexOfFirstStudent =

        indexOfLastStudent -

        studentsPerPage;

    const currentStudents =

        sortedStudents.slice(

            indexOfFirstStudent,

            indexOfLastStudent

        );

    // =======================
    // Dashboard Cards
    // =======================

    const totalStudents = students.length;

    const activeStudents = students.length;

    const inactiveStudents = 0;

    const totalClasses = new Set(

        students.map(

            (student) =>

                student.class_name

        )

    ).size;

    // =======================
    // Return Starts Here
    // =======================

    return (     
           <Layout>

            <div className="container-fluid">

                {/* ================= Header ================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">

                            My Students

                        </h2>

                        <p className="text-muted mb-0">

                            Manage students assigned to your classes.

                        </p>

                    </div>

                    

                </div>

                {/* ================= Dashboard Cards ================= */}

                <div className="row g-4 mb-4">

                    <DashboardCard
                        title="Students"
                        value={totalStudents}
                        color="primary"
                        icon="bi-people-fill"
                    />

                    <DashboardCard
                        title="Active"
                        value={activeStudents}
                        color="success"
                        icon="bi-check-circle-fill"
                    />

                    <DashboardCard
                        title="Inactive"
                        value={inactiveStudents}
                        color="danger"
                        icon="bi-x-circle-fill"
                    />

                    <DashboardCard
                        title="Classes"
                        value={totalClasses}
                        color="warning"
                        icon="bi-building"
                    />

                </div>

                {/* ================= Search Card ================= */}

                <div className="card shadow-sm border-0 rounded-4 mb-4">

                    <div className="card-body">

                        <div className="row align-items-center">

                            <div className="col-lg-7">

                                <div className="input-group">

                                    <span className="input-group-text bg-white">

                                        <i className="bi bi-search"></i>

                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Roll No, Name, Email, Class or Section..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                </div>

                            </div>

                            <div className="col-lg-2 mt-3 mt-lg-0">

                                <select
                                    className="form-select"
                                    value={studentsPerPage}
                                    onChange={(e) => {

                                        setStudentsPerPage(
                                            Number(e.target.value)
                                        );

                                    }}
                                >

                                    <option value={5}>5</option>

                                    <option value={10}>10</option>

                                    <option value={15}>15</option>

                                    <option value={20}>20</option>

                                </select>

                            </div>

                            <div className="col-lg-3 mt-3 mt-lg-0 text-lg-end">

                                <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">

                                    Total Records : {filteredStudents.length}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= Student Table ================= */}

                <div className="card shadow-sm border-0 rounded-4">

                    <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">

                        <h5 className="fw-bold mb-0">

                            Student List

                        </h5>

                        <span className="badge bg-secondary">

                            {filteredStudents.length} Records

                        </span>

                    </div>

                    <div className="card-body p-0">

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-dark">

                                    <tr>

                                        <th
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleSort("roll_no")
                                            }
                                        >

                                            Roll No

                                            {

                                                sortField === "roll_no"

                                                &&

                                                (

                                                    sortOrder === "asc"

                                                        ?

                                                        " ▲"

                                                        :

                                                        " ▼"

                                                )

                                            }

                                        </th>

                                        <th
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleSort("full_name")
                                            }
                                        >

                                            Student Name

                                            {

                                                sortField === "full_name"

                                                &&

                                                (

                                                    sortOrder === "asc"

                                                        ?

                                                        " ▲"

                                                        :

                                                        " ▼"

                                                )

                                            }

                                        </th>

                                        <th
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleSort("email")
                                            }
                                        >

                                            Email

                                        </th>

                                        <th>

                                            Phone

                                        </th>

                                        <th
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleSort("gender")
                                            }
                                        >

                                            Gender

                                        </th>

                                        <th
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                handleSort("class_name")
                                            }
                                        >

                                            Class

                                        </th>

                                        <th>

                                            Section

                                        </th>

                                        

                                    </tr>

                                </thead>

                                <tbody>
                                                                    {

                                        loading ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="text-center py-5"
                                                >

                                                    <div
                                                        className="spinner-border text-primary"
                                                        role="status"
                                                    ></div>

                                                    <p className="mt-3 mb-0">

                                                        Loading Students...

                                                    </p>

                                                </td>

                                            </tr>

                                        )

                                        :

                                        currentStudents.length === 0 ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan="8"
                                                    className="text-center py-5 text-muted"
                                                >

                                                    <i className="bi bi-people fs-1 d-block mb-3"></i>

                                                    No Students Found

                                                </td>

                                            </tr>

                                        )

                                        :

                                        currentStudents.map((student) => (

                                            <tr key={student.id}>

                                                <td className="fw-semibold">

                                                    {student.roll_no}

                                                </td>

                                                <td>

                                                    <div className="d-flex align-items-center">

                                                        

                                                        <div>

                                                            <div className="fw-semibold">

                                                                {student.full_name}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    {student.email}

                                                </td>

                                                <td>

                                                    {student.phone}

                                                </td>

                                                <td>

                                                    <span
                                                    >

                                                        {student.gender}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span >

                                                        {student.class_name}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="badge bg-secondary">

                                                        {student.section}

                                                    </span>

                                                </td>

                                                

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="card-footer bg-white border-0 py-3">

                        <div className="row align-items-center">

                            

                            <div className="col-md-6">

                                <nav>

                                    <ul className="pagination justify-content-md-end mb-0">

                                        <li
                                            className={`page-item ${
                                                currentPage === 1
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                        >

                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    setCurrentPage(currentPage - 1)
                                                }
                                            >

                                                Previous

                                            </button>

                                        </li>

                                        {

                                            Array.from(

                                                {

                                                    length: totalPages

                                                }

                                            ).map((_, index) => (

                                                <li
                                                    key={index}
                                                    className={`page-item ${
                                                        currentPage === index + 1
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >

                                                    <button
                                                        className="page-link"
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                index + 1
                                                            )
                                                        }
                                                    >

                                                        {index + 1}

                                                    </button>

                                                </li>

                                            ))

                                        }

                                        <li
                                            className={`page-item ${
                                                currentPage === totalPages
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                        >

                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    setCurrentPage(currentPage + 1)
                                                }
                                            >

                                                Next

                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default TeacherStudents;