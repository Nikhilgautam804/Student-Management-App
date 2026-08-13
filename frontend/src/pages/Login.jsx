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

        const role = String(user.role).toLowerCase();

        if (role === "admin") {
            navigate("/admin");
        } else if (role === "teacher") {
            navigate("/teacher");
        } else if (role === "student") {
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

            // Remove old login data
            localStorage.removeItem("token");
            localStorage.removeItem("user");


            // ==================================================
            // LOGIN API
            // ==================================================

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // ==================================================
            // CHECK RESPONSE
            // ==================================================

            if (!response || !response.data) {
                throw new Error(
                    "Empty response received from server."
                );
            }

            const data = response.data;


            // ==================================================
            // TOKEN
            // ==================================================

            const token = data?.token;

            if (!token) {
                throw new Error(
                    data?.message ||
                    "Login response did not contain a token."
                );
            }


            // ==================================================
            // USER
            // ==================================================

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

            } else if (data?.role) {

                loggedInUser = data;

            }


            // ==================================================
            // CHECK USER ROLE
            // ==================================================

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


            // ==================================================
            // SAVE LOGIN DATA
            // ==================================================

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


            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            toast.success(
                "Login Successful"
            );


            // ==================================================
            // REDIRECT
            // ==================================================

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

        <div
            className="login-page"
            style={{
                background:
                    "linear-gradient(135deg,#4F46E5,#7C3AED,#2563EB)"
            }}
        >

            <div className="login-row">

                <div className="login-container">

                    <div
                        className="login-card card border-0 shadow-lg rounded-4"
                        style={{
                            background:
                                "rgba(255,255,255,0.18)",
                            backdropFilter:
                                "blur(18px)",
                            WebkitBackdropFilter:
                                "blur(18px)"
                        }}
                    >

                        <div className="card-body">

                            {/* ==================================
                                LOGO
                            ================================== */}

                            <div className="text-center mb-4">

                                <div
                                    className="login-logo d-inline-flex justify-content-center align-items-center rounded-circle bg-white shadow"
                                >

                                    <i
                                        className="bi bi-building"
                                    ></i>

                                </div>


                                <h2 className="fw-bold text-white">
                                    School Management
                                </h2>


                                <p className="text-white-50 mb-0">
                                    Welcome Back! Please login to continue.
                                </p>

                            </div>


                            {/* ==================================
                                LOGIN FORM
                            ================================== */}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >

                                {/* ==================================
                                    USERNAME
                                ================================== */}

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
                                            autoComplete="username"
                                        />

                                    </div>

                                </div>


                                {/* ==================================
                                    PASSWORD
                                ================================== */}

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


                                {/* ==================================
                                    REMEMBER / FORGOT
                                ================================== */}

                                <div className="login-options d-flex justify-content-between align-items-center mb-4">

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
                                        onClick={(e) =>
                                            e.preventDefault()
                                        }
                                    >
                                        Forgot Password?
                                    </a>

                                </div>


                                {/* ==================================
                                    LOGIN BUTTON
                                ================================== */}

                                <div className="d-grid">

                                    <button
                                        type="submit"
                                        className="btn btn-warning login-button fw-bold shadow"
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


                            {/* ==================================
                                FOOTER
                            ================================== */}

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