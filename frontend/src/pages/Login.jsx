import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    


    // Redirect if already logged in
    useEffect(() => {

        const token = localStorage.getItem("token");

        const user = JSON.parse(localStorage.getItem("user"));

        if (token && user) {

            if (user.role === "admin") {
                navigate("/admin");
            }
            else if (user.role === "teacher") {
                navigate("/teacher");
            }
            else if (user.role === "student") {
                navigate("/student");
            }

        }

    }, [navigate]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async () => {

        if (!formData.username.trim()) {
            toast.error("Please enter username.");
            return;
        }

        if (!formData.password.trim()) {
            toast.error("Please enter password.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                formData
            );

            // Save Token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save User
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            toast.success("Login Successful");

            const role = response.data.user.role;

            if (role === "admin") {

                navigate("/admin");

            } else if (role === "teacher") {

                navigate("/teacher");

            } else {

                navigate("/student");

            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
    <div
        className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
        style={{
            background:
                "linear-gradient(135deg,#4F46E5,#7C3AED,#2563EB)"
        }}
    >

        <div className="row justify-content-center w-100">

            <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">

                <div
                    className="card border-0 shadow-lg rounded-4"
                    style={{
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)"
                    }}
                >

                    <div className="card-body p-5">

                        {/* Logo */}

                        <div className="text-center mb-4">

                            <div
                                className="d-inline-flex justify-content-center align-items-center rounded-circle bg-white shadow mb-3"
                                style={{
                                    width: "80px",
                                    height: "80px"
                                }}
                            >

                                <i
                                    className="bi bi-building fs-2"
                                    style={{
                                        color: "#4F46E5"
                                    }}
                                ></i>

                            </div>

                            <h2 className="fw-bold text-white mb-2">

                                School Management

                            </h2>

                            <p className="text-white-50 mb-0">

                                Welcome Back! Please login to continue.

                            </p>

                        </div>

                        {/* Login Form */}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                        >

                            {/* Username */}

                            <div className="mb-4">

                                <label className="form-label text-white fw-semibold">

                                    Username

                                </label>

                                <div className="input-group input-group-lg">

                                    <span className="input-group-text bg-white border-end-0">

                                        <i className="bi bi-person-fill"></i>

                                    </span>

                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Enter Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                            {/* Password */}

                            <div className="mb-4">

                                <label className="form-label text-white fw-semibold">

                                    Password

                                </label>

                                <div className="input-group input-group-lg">

                                    <span className="input-group-text bg-white border-end-0">

                                        <i className="bi bi-lock-fill"></i>

                                    </span>

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="form-control border-start-0 border-end-0"
                                        placeholder="Enter Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {
                                            showPassword
                                                ? (
                                                    <i className="bi bi-eye-slash-fill"></i>
                                                )
                                                : (
                                                    <i className="bi bi-eye-fill"></i>
                                                )
                                        }

                                    </button>

                                </div>

                            </div>

                            {/* Remember */}

                            <div className="d-flex justify-content-between align-items-center mb-4">

                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="remember"
                                    />

                                    <label
                                        className="form-check-label text-white"
                                        htmlFor="remember"
                                    >

                                        Remember Me

                                    </label>

                                </div>

                                <a
                                    href="#"
                                    className="text-warning text-decoration-none fw-semibold"
                                >

                                    Forgot Password?

                                </a>

                            </div>

                            {/* Login */}

                            <div className="d-grid">

                                <button
                                    type="submit"
                                    className="btn btn-warning btn-lg rounded-pill fw-bold shadow"
                                    disabled={loading}
                                >

                                    {
                                        loading
                                            ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>

                                                    Logging In...
                                                </>
                                            )
                                            : (
                                                <>
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>

                                                    Login
                                                </>
                                            )
                                    }

                                </button>

                            </div>

                        </form>

                        <hr className="border-light my-4" />

                        <div className="text-center">

                            <small className="text-white-50">

                                © 2026 School Management System

                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);
}

export default Login;