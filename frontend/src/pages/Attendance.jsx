import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Attendance() {
  const [classSubjects, setClassSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [attendanceExists, setAttendanceExists] = useState(false);

  const [formData, setFormData] = useState({
    class_subject_id: "",
    attendance_date: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));

const isTeacher = user?.role === "teacher";

  useEffect(() => {
    fetchClassSubjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchClassSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get(

    isTeacher

        ? "/class-subjects/my"

        : "/class-subjects"

);
      setClassSubjects(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateLoad = () => {
    const validationErrors = {};

    if (!formData.class_subject_id) {
      validationErrors.class_subject_id = "Allocation is required.";
    }

    if (!formData.attendance_date) {
      validationErrors.attendance_date = "Attendance Date is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleLoadStudents = async (e) => {
    e.preventDefault();

    if (!validateLoad()) {
      return;
    }

    try {
      setLoadingStudents(true);
      // Find selected allocation
const selectedAllocation = classSubjects.find(

    cs => cs.id === Number(formData.class_subject_id)

);

let response;

if (isTeacher) {

    response = await api.get(

        `/attendance/class/${selectedAllocation.class_id}/students`

    );

} else {

    response = await api.get(

        `/class-subjects/${formData.class_subject_id}/students`

    );

}

      // Load students first
let loadedStudents = response.data;

// Check if attendance already exists
const attendanceResponse = await api.get(

    "/attendance/date",

    {

        params: {

            class_subject_id: formData.class_subject_id,

            attendance_date: formData.attendance_date

        }

    }

);

// Existing attendance
const existingAttendance = attendanceResponse.data;
setAttendanceExists(existingAttendance.length > 0);

// Merge attendance with students
loadedStudents = loadedStudents.map(student => {

    const attendance = existingAttendance.find(

        a => a.student_id === student.id

    );

    return {

        ...student,

        status: attendance

            ? attendance.status

            : "Present"

    };

});

setStudents(loadedStudents);
      toast.success("Students loaded successfully");
      setErrors({});
    } catch(error){

    console.log(error);

    if(error.response){

        toast.error(

            error.response.data.message ||

            "Failed to load students"

        );

    }

    else{

        toast.error("Network Error");

    }

} finally {
      setLoadingStudents(false);
    }
  };

  const handleStatusChange = (studentId, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, status: value } : student
      )
    );
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      toast.error("Load students before saving attendance");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        class_subject_id: formData.class_subject_id,
        attendance_date: formData.attendance_date,
        attendance: students.map((student) => ({
          student_id: student.id,
          status: student.status,
        })),
      };

      await api.post("/attendance", payload);
      toast.success(

    attendanceExists

        ? "Attendance Updated Successfully"

        : "Attendance Saved Successfully"

);

setAttendanceExists(true);

setErrors({});
    } catch (error) {
      console.log(error);
      toast.error("Save Attendance Failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.roll_no.toString().toLowerCase().includes(search.toLowerCase()) ||
      (student.full_name || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return sortOrder === "asc"
      ? String(a[sortField] || "").localeCompare(String(b[sortField] || ""))
      : String(b[sortField] || "").localeCompare(String(a[sortField] || ""));
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
      <Layout>

        <div className="container mt-4">
          <h2 className="mb-4">Attendance</h2>

          <div className="card shadow p-4 mb-4">
            <h4>Record Attendance</h4>

            <form onSubmit={handleLoadStudents} noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <select
                    className={`form-select ${errors.class_subject_id ? "is-invalid" : ""}`}
                    name="class_subject_id"
                    value={formData.class_subject_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Class - Subject</option>
                    {classSubjects.map((allocation) => (
                      <option key={allocation.id} value={allocation.id}>
                        {`${allocation.class_name || ""} - ${allocation.section || ""} - ${allocation.subject_name || ""}`}
                      </option>
                    ))}
                  </select>
                  {errors.class_subject_id && (
                    <div className="invalid-feedback d-block">
                      {errors.class_subject_id}
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <input
                    type="date"
                    className={`form-control ${errors.attendance_date ? "is-invalid" : ""}`}
                    name="attendance_date"
                    value={formData.attendance_date}
                    onChange={handleChange}
                  />
                  {errors.attendance_date && (
                    <div className="invalid-feedback d-block">
                      {errors.attendance_date}
                    </div>
                  )}
                </div>

                <div className="col-md-2 mb-3 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingStudents}
                  >
                    {loadingStudents ? "Loading..." : "Load Students"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="card shadow p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="flex-grow-1 me-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Roll No or Student Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: "170px" }}
                value={studentsPerPage}
                onChange={(e) => {
                  setStudentsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                    ID {sortField === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("roll_no")} style={{ cursor: "pointer" }}>
                    Roll No {sortField === "roll_no" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("full_name")} style={{ cursor: "pointer" }}>
                    Student Name {sortField === "full_name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingStudents ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      <div className="spinner-border text-primary me-2" role="status" />
                      Loading students...
                    </td>
                  </tr>
                ) : currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.roll_no}</td>
                      <td>{student.full_name || student.student_name || "N/A"}</td>
                      <td>
                        <select
                          className="form-select"
                          value={student.status}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No students loaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-success"
                onClick={handleSaveAttendance}
                disabled={saving || students.length === 0}
              >
                {

                    saving

                        ? "Saving..."

                        : attendanceExists

                            ? "Update Attendance"

                            : "Save Attendance"

                }
              </button>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-primary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`btn me-2 ${
                    currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-outline-primary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
        </Layout>
  );
}

export default Attendance;
