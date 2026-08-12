import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage, setSubjectsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/subjects");
      setSubjects(response.data);
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

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setErrors({});

    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.subject_code.trim()) {
      validationErrors.subject_code = "Subject Code is required.";
    } else if (formData.subject_code.trim().length > 20) {
      validationErrors.subject_code = "Subject Code must be 20 characters or less.";
    }

    if (!formData.subject_name.trim()) {
      validationErrors.subject_name = "Subject Name is required.";
    } else if (formData.subject_name.trim().length > 100) {
      validationErrors.subject_name = "Subject Name must be 100 characters or less.";
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
        await api.post("/subjects", formData);
        toast.success("Subject Added Successfully");
      } else {
        await api.put(`/subjects/${editingId}`, formData);
        toast.success("Subject Updated Successfully");
        setEditingId(null);
      }

      await fetchSubjects();
      setErrors({});

      setFormData({
        subject_code: "",
        subject_name: "",
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
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Subject Deleted Successfully");
      fetchSubjects();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    return (
      subject.subject_code.toLowerCase().includes(search.toLowerCase()) ||
      subject.subject_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return sortOrder === "asc"
      ? String(a[sortField] || "").localeCompare(String(b[sortField] || ""))
      : String(b[sortField] || "").localeCompare(String(a[sortField] || ""));
  });

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = sortedSubjects.slice(indexOfFirstSubject, indexOfLastSubject);
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  return (
        <Layout>

        <div className="container mt-4">
          <h2 className="mb-4">Subjects</h2>

          <div className="card shadow p-4 mb-4">
            <h4>{editingId ? "Update Subject" : "Add Subject"}</h4>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.subject_code ? "is-invalid" : ""}`}
                  placeholder="Subject Code"
                  name="subject_code"
                  value={formData.subject_code}
                  onChange={handleChange}
                />
                {errors.subject_code && (
                  <div className="invalid-feedback d-block">{errors.subject_code}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.subject_name ? "is-invalid" : ""}`}
                  placeholder="Subject Name"
                  name="subject_name"
                  value={formData.subject_name}
                  onChange={handleChange}
                />
                {errors.subject_name && (
                  <div className="invalid-feedback d-block">{errors.subject_name}</div>
                )}
              </div>

              <button
                type="submit"
                className={`btn mt-2 ${editingId ? "btn-warning" : "btn-primary"}`}
                disabled={saving}
              >
                {saving ? "Saving..." : editingId ? "Update Subject" : "Add Subject"}
              </button>
            </form>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search by Subject Code or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: "170px" }}
              value={subjectsPerPage}
              onChange={(e) => {
                setSubjectsPerPage(Number(e.target.value));
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
                <th onClick={() => handleSort("subject_code")} style={{ cursor: "pointer" }}>
                  Subject Code {sortField === "subject_code" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("subject_name")} style={{ cursor: "pointer" }}>
                  Subject Name {sortField === "subject_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    <div className="spinner-border text-primary me-2" role="status" />
                    Loading subjects...
                  </td>
                </tr>
              ) : filteredSubjects.length > 0 ? (
                currentSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.subject_code}</td>
                    <td>{subject.subject_name}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(subject)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(subject.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No subjects found.
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

export default Subjects;
