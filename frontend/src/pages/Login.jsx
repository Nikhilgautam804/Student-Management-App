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

    // ==================================================
    // REDIRECT IF ALREADY LOGGED IN
    // ==================================================

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            return;
        }

        let user = null;

        try {
            if (
                storedUser !== "undefined" &&
                storedUser !== "null"
            ) {
                user = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error(
                "Invalid user data in localStorage:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return;
        }

        if (!user || !user.role) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return;
        }

        if (user.role === "admin") {
            navigate("/admin");
        } else if (user.role === "teacher") {
            navigate("/teacher");
        } else if (user.role === "student") {
            navigate("/student");
        }
    }, [navigate]);

    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ==================================================
    // HANDLE LOGIN
    // ==================================================

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

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            if (!response || !response.data) {
                throw new Error(
                    "Empty response received from server."
                );
            }

            const data = response.data;

            const token = data?.token;

            if (!token) {
                throw new Error(
                    data?.message ||
                    "Login response did not contain a token."
                );
            }

            let loggedInUser = null;

            if (
                data?.user &&
                typeof data.user === "object"
            ) {
                loggedInUser = data.user;
            } else if (
                data?.data?.user &&
                typeof data.data.user === "object"
            ) {
                loggedInUser = data.data.user;
            } else if (
                data?.role
            ) {
                loggedInUser = data;
            }

            if (
                !loggedInUser ||
                !loggedInUser.role
            ) {
                console.error(
                    "Login response does not contain user role:",
                    data
                );

                throw new Error(
                    "Login response did not contain a valid user role."
                );
            }

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            console.log(
                "Logged in user:",
                loggedInUser
            );

            toast.success(
                "Login Successful"
            );

            const role =
                String(loggedInUser.role).toLowerCase();

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "teacher") {
                navigate("/teacher");
            } else if (role === "student") {
                navigate("/student");
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                throw new Error(
                    `Unknown user role: ${loggedInUser.role}`
                );
            }

        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Login Failed";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    // ==================================================
    // UI
    // ==================================================

    return (
        <>
            {/* ==================================================
                RESPONSIVE LOGIN STYLES
            ================================================== */}

            <style>
                {`
                    .login-page {
                        min-height: 100vh;
                        min-height: 100dvh;
                        padding: 24px 15px;
                        overflow-y: auto;
                        background:
                            linear-gradient(
                                135deg,
                                #4F46E5,
                                #7C3AED,
                                #2563EB
                            );
                    }

                    .login-wrapper {
                        width: 100%;
                        max-width: 440px;
                    }

                    .login-card {
                        width: 100%;
                        background: rgba(255,255,255,0.18);
                        backdrop-filter: blur(18px);
                        -webkit-backdrop-filter: blur(18px);
                    }

                    .login-card-body {
                        padding: 38px 42px;
                    }

                    .login-logo {
                        width: 76px;
                        height: 76px;
                    }

                    .login-title {
                        font-size: 30px;
                    }

                    .login-subtitle {
                        font-size: 16px;
                    }

                    .login-field {
                        margin-bottom: 22px;
                    }

                    .login-input {
                        height: 52px;
                    }

                    .login-button {
                        height: 52px;
                    }

                    @media (max-width: 575.98px) {

                        .login-page {
                            padding: 18px 12px;
                            align-items: flex-start !important;
                        }

                        .login-wrapper {
                            max-width: 430px;
                            margin-top: 18px;
                            margin-bottom: 18px;
                        }

                        .login-card {
                            border-radius: 20px !important;
                        }

                        .login-card-body {
                            padding: 28px 22px 24px;
                        }

                        .login-logo {
                            width: 66px;
                            height: 66px;
                            margin-bottom: 10px !important;
                        }

                        .login-logo i {
                            font-size: 1.7rem !important;
                        }

                        .login-title {
                            font-size: 25px;
                            margin-bottom: 6px !important;
                        }

                        .login-subtitle {
                            font-size: 14px;
                            line-height: 1.4;
                        }

                        .login-header {
                            margin-bottom: 24px !important;
                        }

                        .login-field {
                            margin-bottom: 18px;
                        }

                        .login-label {
                            margin-bottom: 6px !important;
                            font-size: 14px;
                        }

                        .login-input-group {
                            min-height: 48px;
                        }

                        .login-input {
                            height: 48px !important;
                            font-size: 15px;
                        }

                        .login-input-group .input-group-text,
                        .login-input-group .btn {
                            min-width: 52px;
                        }

                        .login-remember {
                            margin-bottom: 20px !important;
                            font-size: 13px;
                            flex-wrap: wrap;
                            gap: 8px;
                        }

                        .login-remember .form-check {
                            margin-bottom: 0;
                        }

                        .login-forgot {
                            font-size: 13px;
                        }

                        .login-button {
                            height: 50px;
                            font-size: 16px;
                        }

                        .login-divider {
                            margin: 22px 0 !important;
                        }

                        .login-footer {
                            font-size: 12px;
                        }
                    }

                    @media (max-width: 380px) {

                        .login-page {
                            padding: 12px 9px;
                        }

                        .login-wrapper {
                            margin-top: 8px;
                        }

                        .login-card-body {
                            padding: 24px 17px 20px;
                        }

                        .login-logo {
                            width: 60px;
                            height: 60px;
                        }

                        .login-title {
                            font-size: 22px;
                        }

                        .login-subtitle {
                            font-size: 13px;
                        }

                        .login-field {
                            margin-bottom: 15px;
                        }

                        .login-input {
                            height: 46px !important;
                            font-size: 14px;
                        }

                        .login-input-group .input-group-text,
                        .login-input-group .btn {
                            min-width: 48px;
                        }

                        .login-remember {
                            font-size: 12px;
                        }

                        .login-forgot {
                            font-size: 12px;
                        }
                    }
                `}
            </style>

            <div
                className="login-page container-fluid d-flex justify-content-center"
            >

                <div className="login-wrapper">

                    <div
                        className="login-card card border-0 shadow-lg rounded-4"
                    >

                        <div className="login-card-body card-body">

                            {/* ==================================================
                                LOGO + HEADING
                            ================================================== */}

                            <div className="login-header text-center">

                                <div
                                    className="login-logo d-inline-flex justify-content-center align-items-center rounded-circle bg-white shadow"
                                >
                                    <i
                                        className="login-logo-icon bi bi-building fs-2"
                                        style={{
                                            color: "#4F46E5"
                                        }}
                                    ></i>
                                </div>

                                <h2 className="login-title fw-bold text-white mb-2">
                                    School Management
                                </h2>

                                <p className="login-subtitle text-white-50 mb-0">
                                    Welcome Back! Please login to continue.
                                </p>

                            </div>


                            {/* ==================================================
                                LOGIN FORM
                            ================================================== */}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >

                                {/* USERNAME */}

                                <div className="login-field">

                                    <label className="login-label form-label text-white fw-semibold">
                                        Username
                                    </label>

                                    <div className="login-input-group input-group">

                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="bi bi-person-fill"></i>
                                        </span>

                                        <input
                                            type="text"
                                            className="login-input form-control border-start-0"
                                            placeholder="Enter Username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                        />

                                    </div>

                                </div>


                                {/* PASSWORD */}

                                <div className="login-field">

                                    <label className="login-label form-label text-white fw-semibold">
                                        Password
                                    </label>

                                    <div className="login-input-group input-group">

                                        <span className="input-group-text bg-white border-end-0">
                                            <i className="bi bi-lock-fill"></i>
                                        </span>

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="login-input form-control border-start-0 border-end-0"
                                            placeholder="Enter Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
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
                                            {showPassword ? (
                                                <i className="bi bi-eye-slash-fill"></i>
                                            ) : (
                                                <i className="bi bi-eye-fill"></i>
                                            )}
                                        </button>

                                    </div>

                                </div>


                                {/* REMEMBER + FORGOT */}

                                <div className="login-remember d-flex justify-content-between align-items-center">

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
                                        className="login-forgot text-warning text-decoration-none fw-semibold"
                                        onClick={(e) =>
                                            e.preventDefault()
                                        }
                                    >
                                        Forgot Password?
                                    </a>

                                </div>


                                {/* LOGIN BUTTON */}

                                <div className="d-grid">

                                    <button
                                        type="submit"
                                        className="login-button btn btn-warning rounded-pill fw-bold shadow"
                                        disabled={loading}
                                    >

                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Logging In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Login
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>


                            {/* FOOTER */}

                            <hr className="login-divider border-light" />

                            <div className="login-footer text-center">

                                <small className="text-white-50">
                                    © 2026 School Management System
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;