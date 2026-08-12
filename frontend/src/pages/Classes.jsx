import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [formData, setFormData] = useState({
    class_name: "",
    section: "",
    class_teacher_id: "",
    room_number: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.log(error);
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

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);
    setErrors({});

    setFormData({
      class_name: classItem.class_name,
      section: classItem.section,
      class_teacher_id: classItem.class_teacher_id ? classItem.class_teacher_id.toString() : "",
      room_number: classItem.room_number,
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.class_name.trim()) {
      validationErrors.class_name = "Class Name is required.";
    }

    if (!formData.section.trim()) {
      validationErrors.section = "Section is required.";
    }

    if (!formData.class_teacher_id) {
      validationErrors.class_teacher_id = "Class Teacher is required.";
    }

    if (!formData.room_number.trim()) {
      validationErrors.room_number = "Room Number is required.";
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
        await api.post("/classes", formData);
        toast.success("Class Added Successfully");
      } else {
        await api.put(`/classes/${editingId}`, formData);
        toast.success("Class Updated Successfully");
        setEditingId(null);
      }

      await fetchClasses();
      setErrors({});

      setFormData({
        class_name: "",
        section: "",
        class_teacher_id: "",
        room_number: "",
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
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class Deleted Successfully");
      fetchClasses();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const filteredClasses = classes.filter((classItem) => {
    return (
      classItem.class_name.toLowerCase().includes(search.toLowerCase()) ||
      classItem.section.toLowerCase().includes(search.toLowerCase()) ||
      (classItem.teacher_name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    if (sortField === "id") {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    }

    return sortOrder === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = sortedClasses.slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  return (
      <Layout>

        <div className="container mt-4">
          <h2 className="mb-4">Classes</h2>

          <div className="card shadow p-4 mb-4">
            <h4>{editingId ? "Update Class" : "Add Class"}</h4>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.class_name ? "is-invalid" : ""}`}
                  placeholder="Class Name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                />
                {errors.class_name && (
                  <div className="invalid-feedback d-block">{errors.class_name}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.section ? "is-invalid" : ""}`}
                  placeholder="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                />
                {errors.section && (
                  <div className="invalid-feedback d-block">{errors.section}</div>
                )}
              </div>

              <div className="mb-3">
                <select
                  className={`form-select ${errors.class_teacher_id ? "is-invalid" : ""}`}
                  name="class_teacher_id"
                  value={formData.class_teacher_id}
                  onChange={handleChange}
                >
                  <option value="">Select Class Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </option>
                  ))}
                </select>
                {errors.class_teacher_id && (
                  <div className="invalid-feedback d-block">{errors.class_teacher_id}</div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control ${errors.room_number ? "is-invalid" : ""}`}
                  placeholder="Room Number"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                />
                {errors.room_number && (
                  <div className="invalid-feedback d-block">{errors.room_number}</div>
                )}
              </div>

              <button
                type="submit"
                className={`btn mt-2 ${editingId ? "btn-warning" : "btn-primary"}`}
                disabled={saving}
              >
                {saving ? "Saving..." : editingId ? "Update Class" : "Add Class"}
              </button>
            </form>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search by Class Name, Section or Teacher Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ width: "170px" }}
              value={classesPerPage}
              onChange={(e) => {
                setClassesPerPage(Number(e.target.value));
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
                  Class Name {sortField === "class_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("section")} style={{ cursor: "pointer" }}>
                  Section {sortField === "section" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("teacher_name")} style={{ cursor: "pointer" }}>
                  Class Teacher {sortField === "teacher_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("room_number")} style={{ cursor: "pointer" }}>
                  Room Number {sortField === "room_number" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Loading classes...
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                currentClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    <td>{classItem.id}</td>
                    <td>{classItem.class_name}</td>
                    <td>{classItem.section}</td>
                    <td>{classItem.teacher_name || "N/A"}</td>
                    <td>{classItem.room_number}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(classItem)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(classItem.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No classes found.
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

export default Classes;
