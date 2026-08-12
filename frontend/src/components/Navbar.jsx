import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ collapsed, setCollapsed }) {

    const [profile, setProfile] = useState(null);

    // ==========================================
    // Logged In User
    // ==========================================

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");


    // ==========================================
    // Get Profile
    // ==========================================

    const fetchProfile = async () => {

        try {

            if (!token) {
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(
                response.data?.profile ||
                response.data
            );

        } catch (error) {

            console.error(
                "Navbar profile error:",
                error
            );

        }

    };


    // ==========================================
    // Load Profile
    // ==========================================

    useEffect(() => {

        fetchProfile();

        const handleProfileUpdate = () => {
            fetchProfile();
        };

        window.addEventListener(
            "profileUpdated",
            handleProfileUpdate
        );

        return () => {

            window.removeEventListener(
                "profileUpdated",
                handleProfileUpdate
            );

        };

    }, [token]);


    // ==========================================
    // Dashboard Path
    // ==========================================

    const getDashboardPath = () => {

        if (user?.role === "admin") {
            return "/admin";
        }

        if (user?.role === "teacher") {
            return "/teacher";
        }

        if (user?.role === "student") {
            return "/student";
        }

        return "/login";

    };


    // ==========================================
    // Profile Path
    // ==========================================

    const getProfilePath = () => {

        if (user?.role === "admin") {
            return "/admin/profile";
        }

        if (user?.role === "teacher") {
            return "/teacher/profile";
        }

        if (user?.role === "student") {
            return "/student/profile";
        }

        return "/login";

    };


    // ==========================================
    // Profile Name
    // ==========================================

    const profileName =
        profile?.full_name ||
        profile?.username ||
        user?.username ||
        "User";


    // ==========================================
    // Profile Image
    // ==========================================

    const profileImage =
        profile?.profile_image || null;


    return (

        /*
            IMPORTANT:
            Navbar is NOT fixed.

            It stays in normal document flow.
            Do NOT add position: fixed here.
        */

        <nav
    className="navbar navbar-expand-lg navbar-dark bg-primary shadow"
    style={{
        minHeight: "56px",
        width: "100%",
        maxWidth: "100%",
        alignSelf: "stretch",
        zIndex: 1000
    }}
>

            <div className="container-fluid">


                {/* ==================================
                    LEFT SIDE
                ================================== */}

                <div className="d-flex align-items-center">


                    {/* ==================================
                        DESKTOP TOGGLE
                    ================================== */}

                    <button
                        type="button"
                        className="btn btn-outline-light me-2 d-none d-lg-flex align-items-center justify-content-center"
                        onClick={() =>
                            setCollapsed(!collapsed)
                        }
                        style={{
                            width: "42px",
                            height: "42px",
                            padding: 0
                        }}
                        aria-label="Toggle sidebar"
                    >

                        <i className="bi bi-list fs-4"></i>

                    </button>


                    {/* ==================================
                        MOBILE TOGGLE
                    ================================== */}

                    <button
                        type="button"
                        className="btn btn-outline-light me-2 d-lg-none d-flex align-items-center justify-content-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sidebar"
                        aria-controls="sidebar"
                        aria-label="Open sidebar"
                        style={{
                            width: "42px",
                            height: "42px",
                            padding: 0
                        }}
                    >

                        <i className="bi bi-list fs-4"></i>

                    </button>


                    {/* ==================================
                        BRAND
                    ================================== */}

                    <Link
                        className="navbar-brand fw-bold mb-0"
                        to={getDashboardPath()}
                    >

                        School Management System

                    </Link>

                </div>


                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <div className="d-flex align-items-center">


                    {/* ==================================
                        PROFILE
                    ================================== */}

                    <Link
                        to={getProfilePath()}
                        className="text-decoration-none text-white"
                    >

                        <div className="d-flex align-items-center">


                            {/* ==================================
                                PROFILE IMAGE
                            ================================== */}

                            {profileImage ? (

                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="rounded-circle border border-white"
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    className="rounded-circle bg-light text-primary d-flex justify-content-center align-items-center"
                                    style={{
                                        width: "38px",
                                        height: "38px"
                                    }}
                                >

                                    <i className="bi bi-person-fill"></i>

                                </div>

                            )}


                            {/* ==================================
                                NAME + ROLE
                            ================================== */}

                            <div
                                className="ms-2 d-none d-sm-block"
                                style={{
                                    lineHeight: "1.1"
                                }}
                            >

                                <div className="fw-semibold">

                                    {profileName}

                                </div>

                                <small
                                    className="text-white opacity-75"
                                    style={{
                                        fontSize: "10px"
                                    }}
                                >

                                    {user?.role?.toUpperCase()}

                                </small>

                            </div>

                        </div>

                    </Link>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;