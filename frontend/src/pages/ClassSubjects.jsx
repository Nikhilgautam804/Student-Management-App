import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function ClassSubjects() {
  const [classSubjects, setClassSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [classSubjectsPerPage, setClassSubjectsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLookups();
    fetchClassSubjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchLookups = async () => {
    try {
      const [classesResponse, subjectsResponse, teachersResponse] = await Promise.all([
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/teachers"),
      ]);

      setClasses(classesResponse.data);
      setSubjects(subjectsResponse.data);
      setTeachers(teachersResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClassSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/class-subjects");
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

  const handleEdit = (allocation) => {
    setEditingId(allocation.id);
    setErrors({});

    setFormData({
      class_id: allocation.class_id ? allocation.class_id.toString() : "",
      subject_id: allocation.subject_id ? allocation.subject_id.toString() : "",
      teacher_id: allocation.teacher_id ? allocation.teacher_id.toString() : "",
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.class_id) {
      validationErrors.class_id = "Class is required.";
    }

    if (!formData.subject_id) {
      validationErrors.subject_id = "Subject is required.";
    }

    if (!formData.teacher_id) {
      validationErrors.teacher_id = "Teacher is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      if (editingId === null) {
        await api.post("/class-subjects", formData);
        toast.success("Allocation Added Successfully");
      } else {
        await api.put(`/class-subjects/${editingId}`, formData);
        toast.success("Allocation Updated Successfully");
        setEditingId(null);
      }

      await fetchClassSubjects();
      setErrors({});

      setFormData({
        class_id: "",
        subject_id: "",
        teacher_id: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Operation Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this allocation?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/class-subjects/${id}`);
      toast.success("Allocation Deleted Successfully");
      fetchClassSubjects();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const filteredClassSubjects = classSubjects.filter((allocation) => {
    return (
      (allocation.class_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (allocation.section || "").toLowerCase().includes(search.toLowerCase()) ||
      (allocation.subject_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (allocation.teacher_name || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedClassSubjects = [...filteredClassSubjects].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return sortOrder === "asc"
      ? String(a[sortField] || "").localeCompare(String(b[sortField] || ""))
      : String(b[sortField] || "").localeCompare(String(a[sortField] || ""));
  });

  const indexOfLastClassSubject = currentPage * classSubjectsPerPage;
  const indexOfFirstClassSubject = indexOfLastClassSubject - classSubjectsPerPage;
  const currentClassSubjects = sortedClassSubjects.slice(
    indexOfFirstClassSubject,
    indexOfLastClassSubject
  );
  const totalPages = Math.ceil(filteredClassSubjects.length / classSubjectsPerPage);

  return (

        <Layout>

        <div className="container mt-4">
          <h2 className="mb-4">Class Subjects</h2>

          <div className="card shadow p-4 mb-4">
            <h4>{editingId ? "Update Allocation" : "Add Allocation"}</h4>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <select
                  className={`form-select ${errors.class_id ? "is-invalid" : ""}`}
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {`${classItem.class_name} - ${classItem.section}`}
                    </option>
                  ))}
                </select>
                {errors.class_id && (
                  <div className="invalid-feedback d-block">{errors.class_id}</div>
                )}
              </div>

              <div className="mb-3">
                <select
                  className={`form-select ${errors.subject_id ? "is-invalid" : ""}`}
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
                {errors.subject_id && (
                  <div className="invalid-feedback d-block">{errors.subject_id}</div>
                )}
              </div>

              <div className="mb-3">
                <select
                  className={`form-select ${errors.teacher_id ? "is-invalid" : ""}`}
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
                {errors.teacher_id && (
                  <div className="invalid-feedback d-block">{errors.teacher_id}</div>
                )}
              </div>

              <button
                type="submit"
                className={`btn mt-2 ${editingId ? "btn-warning" : "btn-primary"}`}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Allocation"
                  : "Add Allocation"}
              </button>
            </form>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search by Class, Subject or Teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: "170px" }}
              value={classSubjectsPerPage}
              onChange={(e) => {
                setClassSubjectsPerPage(Number(e.target.value));
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
                <th onClick={() => handleSort("class_name")} style={{ cursor: "pointer" }}>
                  Class {sortField === "class_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("section")} style={{ cursor: "pointer" }}>
                  Section {sortField === "section" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("subject_name")} style={{ cursor: "pointer" }}>
                  Subject {sortField === "subject_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("teacher_name")} style={{ cursor: "pointer" }}>
                  Teacher {sortField === "teacher_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    <div className="spinner-border text-primary me-2" role="status" />
                    Loading allocations...
                  </td>
                </tr>
              ) : filteredClassSubjects.length > 0 ? (
                currentClassSubjects.map((allocation) => (
                  <tr key={allocation.id}>
                    <td>{allocation.id}</td>
                    <td>{allocation.class_name || "N/A"}</td>
                    <td>{allocation.section || "N/A"}</td>
                    <td>{allocation.subject_name || "N/A"}</td>
                    <td>{allocation.teacher_name || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(allocation)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(allocation.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
        </Layout>
  );
}

export default ClassSubjects;
