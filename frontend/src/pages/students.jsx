import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Students() {

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // ==========================================
  // Registration Credentials
  // ==========================================

  const [credentials, setCredentials] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const [formData, setFormData] = useState({
    roll_no: "",
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    class_id: "",
    address: ""
  });

  const [editingId, setEditingId] = useState(null);


  // ==========================================
  // Load Data
  // ==========================================

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  // ==========================================
  // Fetch Students
  // ==========================================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response = await api.get("/students");

      setStudents(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // Fetch Classes
  // ==========================================

  const fetchClasses = async () => {

    try {

      const response = await api.get("/classes");

      setClasses(response.data);

    } catch (error) {

      console.log(error);

    }

  };


  // ==========================================
  // Sorting
  // ==========================================

  const handleSort = (field) => {

    if (sortField === field) {

      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortOrder("asc");

    }

  };


  // ==========================================
  // Handle Form Change
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

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
  // Edit Student
  // ==========================================

  const handleEdit = (student) => {

    setEditingId(student.id);

    setErrors({});

    setFormData({
      roll_no: student.roll_no,
      full_name: student.full_name,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      class_id: student.class_id
        ? student.class_id.toString()
        : "",
      address: student.address
    });

  };


  // ==========================================
  // Validation
  // ==========================================

  const validateForm = () => {

    const validationErrors = {};


    if (!formData.roll_no.trim()) {

      validationErrors.roll_no =
        "Roll Number is required.";

    }


    if (!formData.full_name.trim()) {

      validationErrors.full_name =
        "Full Name is required.";

    } else if (
      formData.full_name.trim().length < 3
    ) {

      validationErrors.full_name =
        "Full Name must be at least 3 characters.";

    }


    if (!formData.email.trim()) {

      validationErrors.email =
        "Email is required.";

    } else {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email.trim()
        )
      ) {

        validationErrors.email =
          "Please enter a valid email address.";

      }

    }


    if (!formData.phone.trim()) {

      validationErrors.phone =
        "Phone is required.";

    } else {

      const phoneRegex =
        /^[0-9]{10}$/;

      if (
        !phoneRegex.test(
          formData.phone.trim()
        )
      ) {

        validationErrors.phone =
          "Phone must contain exactly 10 digits.";

      }

    }


    if (!formData.gender) {

      validationErrors.gender =
        "Gender is required.";

    }


    if (!formData.class_id) {

      validationErrors.class_id =
        "Class is required.";

    }


    if (
      formData.address.trim().length < 5
    ) {

      validationErrors.address =
        "Address must be at least 5 characters.";

    }


    setErrors(validationErrors);


    if (
      Object.keys(validationErrors).length > 0
    ) {

      return false;

    }


    return true;

  };


  // ==========================================
  // Add / Update Student
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!validateForm()) {

      return;

    }


    try {

      setSaving(true);


      // ==========================================
      // ADD STUDENT
      // ==========================================

      if (editingId === null) {

        const response = await api.post(
          "/students",
          formData
        );


        /*
          Backend already creates:
          1. Student
          2. User login account

          and returns:
          credentials.username
          credentials.password
        */

        const returnedCredentials =
          response.data?.credentials;


        if (returnedCredentials) {

          setCredentials(
            returnedCredentials
          );

          setShowCredentialsModal(true);

        }


        toast.success(
          "Student Added Successfully"
        );


      }

      // ==========================================
      // UPDATE STUDENT
      // ==========================================

      else {

        await api.put(
          `/students/${editingId}`,
          formData
        );


        toast.success(
          "Student Updated Successfully"
        );


        setEditingId(null);

      }


      // Refresh students

      await fetchStudents();


      setErrors({});


      // Reset Form

      setFormData({

        roll_no: "",
        full_name: "",
        email: "",
        phone: "",
        gender: "",
        class_id: "",
        address: ""

      });


    } catch (error) {

      console.log(error);


      toast.error(
        error?.response?.data?.message ||
        "Operation Failed"
      );


    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // Delete Student
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      await api.delete(
        `/students/${id}`
      );


      toast.success(
        "Student Deleted Successfully"
      );


      fetchStudents();


    } catch (error) {

      console.log(error);


      toast.error(
        "Delete Failed"
      );

    }

  };


  // ==========================================
  // Copy Credentials
  // ==========================================

  const copyToClipboard = async (
    text,
    message
  ) => {

    try {

      await navigator.clipboard.writeText(
        text
      );

      toast.success(message);

    } catch (error) {

      console.log(error);

      toast.error(
        "Unable to copy"
      );

    }

  };


  // ==========================================
  // Filter Students
  // ==========================================

  const filteredStudents =
    students.filter((student) => {

      return (

        student.full_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        student.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        student.roll_no
          .toString()
          .includes(search) ||

        (student.class_name || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        (student.section || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    });


  // ==========================================
  // Sort Students
  // ==========================================

  const sortedStudents =
    [...filteredStudents].sort(
      (a, b) => {

        if (
          sortField === "id" ||
          sortField === "roll_no"
        ) {

          return sortOrder === "asc"
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];

        }


        return sortOrder === "asc"

          ? String(
              a[sortField] || ""
            ).localeCompare(
              String(
                b[sortField] || ""
              )
            )

          : String(
              b[sortField] || ""
            ).localeCompare(
              String(
                a[sortField] || ""
              )
            );

      }
    );


  // ==========================================
  // Pagination
  // ==========================================

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent -
    studentsPerPage;

  const currentStudents =
    sortedStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );

  const totalPages =
    Math.ceil(
      filteredStudents.length /
      studentsPerPage
    );


  return (

    <Layout>

      <div className="container mt-4">

        {/* ==========================================
            PAGE TITLE
        ========================================== */}

        <h2 className="mb-4">
          Students
        </h2>


        {/* ==========================================
            ADD / UPDATE STUDENT
        ========================================== */}

        <div className="card shadow p-4 mb-4">

          <h4>

            {editingId
              ? "Update Student"
              : "Add Student"}

          </h4>


          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Roll Number */}

            <div className="mb-3">

              <input
                type="text"
                className={`form-control ${
                  errors.roll_no
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Roll Number"
                name="roll_no"
                value={formData.roll_no}
                onChange={handleChange}
              />


              {errors.roll_no && (

                <div className="invalid-feedback d-block">

                  {errors.roll_no}

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


            {/* Class */}

            <div className="mb-3">

              <select
                className={`form-select ${
                  errors.class_id
                    ? "is-invalid"
                    : ""
                }`}
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
              >

                <option value="">
                  Select Class
                </option>


                {classes.map(
                  (classItem) => (

                    <option
                      key={classItem.id}
                      value={classItem.id}
                    >

                      {`${classItem.class_name} - ${classItem.section}`}

                    </option>

                  )
                )}

              </select>


              {errors.class_id && (

                <div className="invalid-feedback d-block">

                  {errors.class_id}

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
                name="address"
                rows="3"
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
                ? "Update Student"
                : "Add Student"}

            </button>


            {/* Cancel Update */}

            {editingId && (

              <button
                type="button"
                className="btn btn-secondary mt-2 ms-2"
                onClick={() => {

                  setEditingId(null);

                  setErrors({});

                  setFormData({

                    roll_no: "",
                    full_name: "",
                    email: "",
                    phone: "",
                    gender: "",
                    class_id: "",
                    address: ""

                  });

                }}
              >

                Cancel

              </button>

            )}

          </form>

        </div>


        {/* ==========================================
            SEARCH + PAGINATION
        ========================================== */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <input
            type="text"
            className="form-control me-3"
            placeholder="Search by Roll No, Name, Email, Class or Section..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            className="form-select"
            style={{
              width: "170px"
            }}
            value={studentsPerPage}
            onChange={(e) => {

              setStudentsPerPage(
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


        {/* ==========================================
            STUDENTS TABLE
        ========================================== */}

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>

                <th
                  onClick={() =>
                    handleSort("id")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  ID{" "}

                  {sortField === "id" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th
                  onClick={() =>
                    handleSort("roll_no")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Roll No{" "}

                  {sortField === "roll_no" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th
                  onClick={() =>
                    handleSort("full_name")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Name{" "}

                  {sortField === "full_name" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th
                  onClick={() =>
                    handleSort("email")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Email{" "}

                  {sortField === "email" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th>
                  Phone
                </th>


                <th
                  onClick={() =>
                    handleSort("gender")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Gender{" "}

                  {sortField === "gender" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th
                  onClick={() =>
                    handleSort("class_name")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Class Name{" "}

                  {sortField === "class_name" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

                </th>


                <th
                  onClick={() =>
                    handleSort("section")
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >

                  Section{" "}

                  {sortField === "section" &&
                    (
                      sortOrder === "asc"
                        ? "▲"
                        : "▼"
                    )}

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

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="text-center py-4"
                  >

                    Loading students...

                  </td>

                </tr>

              ) : filteredStudents.length > 0 ? (

                currentStudents.map(
                  (student) => (

                    <tr
                      key={student.id}
                    >

                      <td>
                        {student.id}
                      </td>


                      <td>
                        {student.roll_no}
                      </td>


                      <td>
                        {student.full_name}
                      </td>


                      <td>
                        {student.email}
                      </td>


                      <td>
                        {student.phone}
                      </td>


                      <td>
                        {student.gender}
                      </td>


                      <td>
                        {student.class_name ||
                          "N/A"}
                      </td>


                      <td>
                        {student.section ||
                          "N/A"}
                      </td>


                      <td>
                        {student.address ||
                          "N/A"}
                      </td>


                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            handleEdit(
                              student
                            )
                          }
                        >

                          Edit

                        </button>


                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(
                              student.id
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
                    colSpan="10"
                    className="text-center text-muted"
                  >

                    No students found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ==========================================
            PAGINATION
        ========================================== */}

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
            {
              length: totalPages
            },
            (_, index) => (

              <button
                key={index}
                className={`btn me-2 ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >

                {index + 1}

              </button>

            )
          )}


          <button
            className="btn btn-outline-primary ms-2"
            disabled={
              currentPage === totalPages
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


      {/* ==========================================
          STUDENT CREDENTIALS MODAL
      ========================================== */}

      {showCredentialsModal && (

        <>

          {/* Backdrop */}

          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1050
            }}
          ></div>


          {/* Modal */}

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              zIndex: 1055
            }}
          >

            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
            >

              <div className="modal-content border-0 shadow-lg rounded-4">


                {/* Header */}

                <div className="modal-header bg-primary text-white">

                  <h5 className="modal-title fw-bold">

                    <i className="bi bi-person-check-fill me-2"></i>

                    Student Created Successfully

                  </h5>


                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={() =>
                      setShowCredentialsModal(
                        false
                      )
                    }
                  ></button>

                </div>


                {/* Body */}

                <div className="modal-body p-4">

                  <div className="text-center mb-4">

                    <div
                      className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "65px",
                        height: "65px"
                      }}
                    >

                      <i className="bi bi-check-lg fs-2"></i>

                    </div>


                    <h5 className="fw-bold">

                      Login Account Created

                    </h5>


                    <p className="text-muted mb-0">

                      The student can now log in
                      using these credentials.

                    </p>

                  </div>


                  {credentials && (

                    <div className="card border-0 bg-light">

                      <div className="card-body p-4">


                        {/* Username */}

                        <div className="mb-4">

                          <label className="form-label text-muted small fw-semibold">

                            USERNAME

                          </label>


                          <div className="input-group">

                            <input
                              type="text"
                              className="form-control fw-bold"
                              value={
                                credentials.username ||
                                ""
                              }
                              readOnly
                            />


                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() =>
                                copyToClipboard(
                                  credentials.username,
                                  "Username copied"
                                )
                              }
                            >

                              <i className="bi bi-clipboard"></i>

                            </button>

                          </div>

                        </div>


                        {/* Password */}

                        <div>

                          <label className="form-label text-muted small fw-semibold">

                            TEMPORARY PASSWORD

                          </label>


                          <div className="input-group">

                            <input
                              type="text"
                              className="form-control fw-bold"
                              value={
                                credentials.password ||
                                ""
                              }
                              readOnly
                            />


                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() =>
                                copyToClipboard(
                                  credentials.password,
                                  "Password copied"
                                )
                              }
                            >

                              <i className="bi bi-clipboard"></i>

                            </button>

                          </div>

                        </div>


                      </div>

                    </div>

                  )}


                  <div className="alert alert-warning mt-4 mb-0">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    <strong>Important:</strong>{" "}

                    Share these credentials
                    securely with the student.

                  </div>


                </div>


                {/* Footer */}

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={() => {

                      setShowCredentialsModal(
                        false
                      );

                      setCredentials(null);

                    }}
                  >

                    Done

                  </button>

                </div>


              </div>

            </div>

          </div>

        </>

      )}

    </Layout>

  );

}

export default Students;