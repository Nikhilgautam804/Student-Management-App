import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";


function Exams() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage, setExamsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("exam_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    exam_name: "",
    exam_type: "",
    max_marks: "",
    exam_date: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));

    const isTeacher = user?.role === "teacher";

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/exams");
      setExams(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to Load Exams");
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

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      exam_name: "",
      exam_type: "",
      max_marks: "",
      exam_date: "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleEdit = (exam) => {
    setEditingId(exam.id);
    setFormData({
      exam_name: exam.exam_name || "",
      exam_type: exam.exam_type || "",
      max_marks: exam.max_marks ? String(exam.max_marks) : "",
      exam_date: exam.exam_date ? exam.exam_date.split("T")[0] : "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      exam_name: "",
      exam_type: "",
      max_marks: "",
      exam_date: "",
    });
    setErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.exam_name.trim()) {
      validationErrors.exam_name = "Exam Name is required.";
    }

    if (!formData.exam_type) {
      validationErrors.exam_type = "Exam Type is required.";
    }

    if (!formData.max_marks.toString().trim()) {
      validationErrors.max_marks = "Maximum Marks is required.";
    } else {
      const value = Number(formData.max_marks);
      if (Number.isNaN(value) || value <= 0) {
        validationErrors.max_marks = "Maximum Marks must be greater than zero.";
      }
    }

    if (!formData.exam_date) {
      validationErrors.exam_date = "Exam Date is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const payload = {
        exam_name: formData.exam_name.trim(),
        exam_type: formData.exam_type,
        max_marks: Number(formData.max_marks),
        exam_date: formData.exam_date,
      };

      if (editingId === null) {
        await api.post("/exams", payload);
        toast.success("Exam Added Successfully");
      } else {
        await api.put(`/exams/${editingId}`, payload);
        toast.success("Exam Updated Successfully");
      }

      await fetchExams();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Unable to Save Exam");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/exams/${id}`);
      toast.success("Exam Deleted Successfully");
      fetchExams();
    } catch (error) {
      console.error(error);
      toast.error("Unable to Delete Exam");
    }
  };

  const filteredExams = exams.filter((exam) => {
    const searchValue = search.toLowerCase();
    return (
      exam.exam_name.toLowerCase().includes(searchValue) ||
      exam.exam_type.toLowerCase().includes(searchValue)
    );
  });

  const sortedExams = [...filteredExams].sort((a, b) => {
    if (sortField === "max_marks") {
      return sortOrder === "asc" ? a.max_marks - b.max_marks : b.max_marks - a.max_marks;
    }

    if (sortField === "exam_date") {
      return sortOrder === "asc"
        ? new Date(a.exam_date) - new Date(b.exam_date)
        : new Date(b.exam_date) - new Date(a.exam_date);
    }

    return sortOrder === "asc"
      ? String(a.exam_name || "").localeCompare(String(b.exam_name || ""))
      : String(b.exam_name || "").localeCompare(String(a.exam_name || ""));
  });

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = sortedExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  return (
    <Layout>

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-0">
                    {isTeacher ? "Exams" : "Exam Management"}
                    </h2>

                </div>

                {
    !isTeacher && (

        <button
            className="btn btn-primary"
            onClick={openAddModal}
            disabled={loading}
        >
            Add Exam
        </button>

    )
}

            </div>

            <div className="card shadow p-4 mb-4">

                <div className="row gy-3">

                    <div className="col-lg-8">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Exam Name or Exam Type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <div className="col-lg-4">

                        <select
                            className="form-select"
                            value={examsPerPage}
                            onChange={(e) => {
                                setExamsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >

                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={15}>15 per page</option>
                            <option value={20}>20 per page</option>

                        </select>

                    </div>

                </div>

            </div>

            <div className="card shadow">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th
                                        onClick={() => handleSort("exam_name")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Exam Name{" "}
                                        {sortField === "exam_name" &&
                                            (sortOrder === "asc" ? "▲" : "▼")}
                                    </th>

                                    <th>Exam Type</th>

                                    <th
                                        onClick={() => handleSort("max_marks")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Maximum Marks{" "}
                                        {sortField === "max_marks" &&
                                            (sortOrder === "asc" ? "▲" : "▼")}
                                    </th>

                                    <th
                                        onClick={() => handleSort("exam_date")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Exam Date{" "}
                                        {sortField === "exam_date" &&
                                            (sortOrder === "asc" ? "▲" : "▼")}
                                    </th>

                                        {
                                            !isTeacher && <th>Actions</th>
                                        }

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td colSpan="5" className="text-center py-4">

                                            <div className="spinner-border text-primary"></div>

                                        </td>

                                    </tr>

                                ) : currentExams.length === 0 ? (

                                    <tr>

                                        <td colSpan="5" className="text-center py-4">

                                            No Exams Found

                                        </td>

                                    </tr>

                                ) : (

                                    currentExams.map((exam) => (

                                        <tr key={exam.id}>

                                            <td>{exam.exam_name}</td>

                                            <td>{exam.exam_type}</td>

                                            <td>{exam.max_marks}</td>

                                            <td>
                                                {exam.exam_date
                                                    ? exam.exam_date.split("T")[0]
                                                    : ""}
                                            </td>

                                            {
                                            !isTeacher && (

                                                <td>

                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => handleEdit(exam)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(exam.id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            )
                                        }

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                    {totalPages > 1 && (

                        <nav className="mt-4">

                            <ul className="pagination justify-content-center">

                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>

                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }
                                    >
                                        Previous
                                    </button>

                                </li>

                                {Array.from({ length: totalPages }, (_, index) => (

                                    <li
                                        key={index}
                                        className={`page-item ${
                                            currentPage === index + 1 ? "active" : ""
                                        }`}
                                    >

                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>

                                    </li>

                                ))}

                                <li
                                    className={`page-item ${
                                        currentPage === totalPages ? "disabled" : ""
                                    }`}
                                >

                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                    >
                                        Next
                                    </button>

                                </li>

                            </ul>

                        </nav>

                    )}

                </div>

            </div>

            {!isTeacher && modalOpen && (
                <div className="modal show fade d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingId !== null ? "Update Exam" : "Add Exam"}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label className="form-label">Exam Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.exam_name ? "is-invalid" : ""}`}
                                            name="exam_name"
                                            value={formData.exam_name}
                                            onChange={handleChange}
                                        />
                                        {errors.exam_name && (
                                            <div className="invalid-feedback d-block">{errors.exam_name}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Exam Type</label>
                                        <select
                                            className={`form-select ${errors.exam_type ? "is-invalid" : ""}`}
                                            name="exam_type"
                                            value={formData.exam_type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Exam Type</option>
                                            <option value="Internal">Internal</option>
                                            <option value="External">External</option>
                                            <option value="Quiz">Quiz</option>
                                            <option value="Assignment">Assignment</option>
                                            <option value="Practical">Practical</option>
                                            <option value="Viva">Viva</option>
                                        </select>
                                        {errors.exam_type && (
                                            <div className="invalid-feedback d-block">{errors.exam_type}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Maximum Marks</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.max_marks ? "is-invalid" : ""}`}
                                            name="max_marks"
                                            value={formData.max_marks}
                                            onChange={handleChange}
                                            min="1"
                                        />
                                        {errors.max_marks && (
                                            <div className="invalid-feedback d-block">{errors.max_marks}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Exam Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.exam_date ? "is-invalid" : ""}`}
                                            name="exam_date"
                                            value={formData.exam_date}
                                            onChange={handleChange}
                                        />
                                        {errors.exam_date && (
                                            <div className="invalid-feedback d-block">{errors.exam_date}</div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModal}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? "Saving..." : editingId !== null ? "Update Exam" : "Save Exam"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    </Layout>
);
}

export default Exams;
