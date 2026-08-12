import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Teachers() {

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage, setTeachersPerPage] = useState(5);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // Teacher Login Credentials Modal
  // ==========================================

  const [credentials, setCredentials] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // ==========================================
  // Form
  // ==========================================

  const [formData, setFormData] = useState({
    teacher_code: "",
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    qualification: "",
    address: ""
  });

  // ==========================================
  // Fetch Teachers
  // ==========================================

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchTeachers = async () => {

    try {

      setLoading(true);

      const response = await api.get("/teachers");

      setTeachers(response.data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch teachers");

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // Sorting
  // ==========================================

  const handleSort = (field) => {

    if (sortField === field) {

      setSortOrder(
        sortOrder === "asc" ? "desc" : "asc"
      );

    } else {

      setSortField(field);
      setSortOrder("asc");

    }

  };

  // ==========================================
  // Form Change
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));

  };

  // ==========================================
  // Edit Teacher
  // ==========================================

  const handleEdit = (teacher) => {

    setEditingId(teacher.id);

    setErrors({});

    setFormData({
      teacher_code: teacher.teacher_code,
      full_name: teacher.full_name,
      email: teacher.email,
      phone: teacher.phone,
      gender: teacher.gender,
      qualification: teacher.qualification,
      address: teacher.address
    });

  };

  // ==========================================
  // Validation
  // ==========================================

  const validateForm = () => {

    let tempErrors = {};

    if (!formData.teacher_code.trim())
      tempErrors.teacher_code = "Teacher Code is required";

    if (!formData.full_name.trim())
      tempErrors.full_name = "Full Name is required";

    if (!formData.email.trim())
      tempErrors.email = "Email is required";

    if (!formData.phone.trim())
      tempErrors.phone = "Phone is required";

    if (!formData.gender)
      tempErrors.gender = "Gender is required";

    if (!formData.qualification.trim())
      tempErrors.qualification = "Qualification is required";

    if (!formData.address.trim())
      tempErrors.address = "Address is required";

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;

  };

  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {

    setEditingId(null);

    setErrors({});

    setFormData({
      teacher_code: "",
      full_name: "",
      email: "",
      phone: "",
      gender: "",
      qualification: "",
      address: ""
    });

  };

  // ==========================================
  // Submit Teacher
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    try {

      setSaving(true);

      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {

        await api.put(
          `/teachers/${editingId}`,
          formData
        );

        toast.success(
          "Teacher Updated Successfully"
        );

      }

      // ======================================
      // ADD
      // ======================================

      else {

        const response = await api.post(
          "/teachers",
          formData
        );

        toast.success(
          "Teacher Added Successfully"
        );

        // ====================================
        // Get Login Credentials
        // ====================================

        const returnedCredentials =
          response.data?.credential;

        if (returnedCredentials) {

          setCredentials(
            returnedCredentials
          );

          setShowCredentialsModal(true);

        }

      }

      resetForm();

      fetchTeachers();

    }

    catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Operation Failed"
      );

    }

    finally {

      setSaving(false);

    }

  };

  // ==========================================
  // Delete Teacher
  // ==========================================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this teacher?"))
      return;

    try {

      await api.delete(`/teachers/${id}`);

      toast.success(
        "Teacher Deleted Successfully"
      );

      fetchTeachers();

    }

    catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Delete Failed"
      );

    }

  };

  // ==========================================
  // Filter
  // ==========================================

  const filteredTeachers = teachers.filter(
    (teacher) => {

      return (

        teacher.teacher_code
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        teacher.full_name
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        teacher.email
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        teacher.phone
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        teacher.qualification
          .toLowerCase()
          .includes(search.toLowerCase())

        ||

        teacher.address
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    }
  );

  // ==========================================
  // Sorting
  // ==========================================

  const sortedTeachers =
    [...filteredTeachers].sort(
      (a, b) => {

        let first = a[sortField];
        let second = b[sortField];

        if (typeof first === "string")
          first = first.toLowerCase();

        if (typeof second === "string")
          second = second.toLowerCase();

        if (first < second)
          return sortOrder === "asc" ? -1 : 1;

        if (first > second)
          return sortOrder === "asc" ? 1 : -1;

        return 0;

      }
    );

  // ==========================================
  // Pagination
  // ==========================================

  const indexOfLastTeacher =
    currentPage * teachersPerPage;

  const indexOfFirstTeacher =
    indexOfLastTeacher - teachersPerPage;

  const currentTeachers =
    sortedTeachers.slice(
      indexOfFirstTeacher,
      indexOfLastTeacher
    );

  const totalPages =
    Math.ceil(
      sortedTeachers.length /
      teachersPerPage
    );

  // ==========================================
  // UI
  // ==========================================

  return (

    <Layout>

      <div className="container mt-4">

        <h2 className="mb-3">
          Teachers
        </h2>

        {/* ==================================
            Add / Update Teacher
        ================================== */}

        <div className="card shadow p-4 mb-4">

          <h4>
            {editingId
              ? "Update Teacher"
              : "Add Teacher"}
          </h4>

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Teacher Code */}

            <div className="mb-3">

              <input
                type="text"
                className={`form-control ${
                  errors.teacher_code
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Teacher Code"
                name="teacher_code"
                value={formData.teacher_code}
                onChange={handleChange}
              />

              {errors.teacher_code && (

                <div className="invalid-feedback d-block">
                  {errors.teacher_code}
                </div>

              )}

            </div>

            {/* Full Name */}

            <div className="mb-3">

              <input
                type="text"
                className={`form-control ${
                  errors.full_name
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />

              {errors.full_name && (

                <div className="invalid-feedback d-block">
                  {errors.full_name}
                </div>

              )}

            </div>

            {/* Email */}

            <div className="mb-3">

              <input
                type="email"
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (

                <div className="invalid-feedback d-block">
                  {errors.email}
                </div>

              )}

            </div>

            {/* Phone */}

            <div className="mb-3">

              <input
                type="text"
                className={`form-control ${
                  errors.phone
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              {errors.phone && (

                <div className="invalid-feedback d-block">
                  {errors.phone}
                </div>

              )}

            </div>

            {/* Gender */}

            <div className="mb-3">

              <select
                className={`form-select ${
                  errors.gender
                    ? "is-invalid"
                    : ""
                }`}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>

              {errors.gender && (

                <div className="invalid-feedback d-block">
                  {errors.gender}
                </div>

              )}

            </div>

            {/* Qualification */}

            <div className="mb-3">

              <input
                type="text"
                className={`form-control ${
                  errors.qualification
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />

              {errors.qualification && (

                <div className="invalid-feedback d-block">
                  {errors.qualification}
                </div>

              )}

            </div>

            {/* Address */}

            <div className="mb-3">

              <textarea
                className={`form-control ${
                  errors.address
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Address"
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              {errors.address && (

                <div className="invalid-feedback d-block">
                  {errors.address}
                </div>

              )}

            </div>

            {/* Submit */}

            <button
              type="submit"
              className={`btn mt-2 ${
                editingId
                  ? "btn-warning"
                  : "btn-primary"
              }`}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Teacher"
                : "Add Teacher"}

            </button>

          </form>

        </div>

        {/* ==================================
            Search
        ================================== */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <input
            type="text"
            className="form-control me-3"
            placeholder="Search by Teacher Code, Name, Email or Qualification..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="form-select"
            style={{ width: "170px" }}
            value={teachersPerPage}
            onChange={(e) => {

              setTeachersPerPage(
                Number(e.target.value)
              );

              setCurrentPage(1);

            }}
          >

            <option value={5}>
              5 per page
            </option>

            <option value={10}>
              10 per page
            </option>

            <option value={15}>
              15 per page
            </option>

            <option value={20}>
              20 per page
            </option>

          </select>

        </div>

        {/* ==================================
            Teachers Table
        ================================== */}

        <table className="table table-bordered table-hover">

          <thead className="table-dark">

            <tr>

              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                ID{" "}
                {sortField === "id" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th
                onClick={() =>
                  handleSort("teacher_code")
                }
                style={{ cursor: "pointer" }}
              >
                Teacher Code{" "}
                {sortField === "teacher_code" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th
                onClick={() =>
                  handleSort("full_name")
                }
                style={{ cursor: "pointer" }}
              >
                Name{" "}
                {sortField === "full_name" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th
                onClick={() =>
                  handleSort("email")
                }
                style={{ cursor: "pointer" }}
              >
                Email{" "}
                {sortField === "email" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th>
                Phone
              </th>

              <th
                onClick={() =>
                  handleSort("gender")
                }
                style={{ cursor: "pointer" }}
              >
                Gender{" "}
                {sortField === "gender" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th
                onClick={() =>
                  handleSort("qualification")
                }
                style={{ cursor: "pointer" }}
              >
                Qualification{" "}
                {sortField === "qualification" &&
                  (sortOrder === "asc"
                    ? "▲"
                    : "▼")}
              </th>

              <th>
                Address
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredTeachers.length > 0 ? (

              currentTeachers.map(
                (teacher) => (

                  <tr key={teacher.id}>

                    <td>
                      {teacher.id}
                    </td>

                    <td>
                      {teacher.teacher_code}
                    </td>

                    <td>
                      {teacher.full_name}
                    </td>

                    <td>
                      {teacher.email}
                    </td>

                    <td>
                      {teacher.phone}
                    </td>

                    <td>
                      {teacher.gender}
                    </td>

                    <td>
                      {teacher.qualification}
                    </td>

                    <td>
                      {teacher.address}
                    </td>

                    <td>

                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          handleEdit(teacher)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(
                            teacher.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="9"
                  className="text-center text-muted"
                >
                  No teachers found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

        {/* ==================================
            Pagination
        ================================== */}

        <div className="d-flex justify-content-center mt-3">

          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            ← Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => (

              <button
                key={index}
                className={`btn me-2 ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </button>

            )
          )}

          <button
            className="btn btn-outline-primary ms-2"
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next →
          </button>

        </div>

      </div>

      {/* ==================================================
          TEACHER CREDENTIALS MODAL
      ================================================== */}

      {showCredentialsModal &&
        credentials && (

          <div
            className="modal fade show"
            style={{
              display: "block",
              backgroundColor:
                "rgba(0,0,0,0.55)"
            }}
            tabIndex="-1"
            role="dialog"
          >

            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
            >

              <div className="modal-content shadow-lg border-0 rounded-4">

                {/* Header */}

                <div className="modal-header bg-success text-white">

                  <h5 className="modal-title fw-bold">

                    <i className="bi bi-person-check-fill me-2"></i>

                    Teacher Created Successfully

                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setShowCredentialsModal(false)
                    }
                  ></button>

                </div>

                {/* Body */}

                <div className="modal-body p-4">

                  <div className="text-center mb-3">

                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "65px",
                        height: "65px",
                        fontSize: "28px"
                      }}
                    >

                      <i className="bi bi-person-fill"></i>

                    </div>

                  </div>

                  <p className="text-center text-muted mb-4">

                    The teacher account has been
                    created successfully.

                    <br />

                    Use the following credentials
                    to log in.

                  </p>

                  {/* Username */}

                  <div className="mb-3">

                    <label className="form-label fw-bold">
                      Username
                    </label>

                    <div className="input-group">

                      <input
                        type="text"
                        className="form-control"
                        value={
                          credentials.username || ""
                        }
                        readOnly
                      />

                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {

                          navigator.clipboard.writeText(
                            credentials.username
                          );

                          toast.success(
                            "Username copied"
                          );

                        }}
                      >

                        <i className="bi bi-copy"></i>

                      </button>

                    </div>

                  </div>

                  {/* Password */}

                  <div className="mb-3">

                    <label className="form-label fw-bold">
                      Temporary Password
                    </label>

                    <div className="input-group">

                      <input
                        type="text"
                        className="form-control"
                        value={
                          credentials.password || ""
                        }
                        readOnly
                      />

                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {

                          navigator.clipboard.writeText(
                            credentials.password
                          );

                          toast.success(
                            "Password copied"
                          );

                        }}
                      >

                        <i className="bi bi-copy"></i>

                      </button>

                    </div>

                  </div>

                  {/* Warning */}

                  <div className="alert alert-warning mb-0">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    Please save these credentials
                    securely and share them with
                    the teacher.

                  </div>

                </div>

                {/* Footer */}

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-success px-4"
                    onClick={() => {

                      setShowCredentialsModal(false);
                      setCredentials(null);

                    }}
                  >

                    Done

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

    </Layout>

  );

}

export default Teachers;