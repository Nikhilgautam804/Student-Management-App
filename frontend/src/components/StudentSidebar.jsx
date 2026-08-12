import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function StudentSidebar({ collapsed }) {

    const navigate = useNavigate();


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully.");

        navigate("/login");

    };


    // ==========================================
    // Student Menu
    // ==========================================

    const menuItems = [

        {
            name: "Dashboard",
            path: "/student",
            icon: "bi-speedometer2"
        },

        {
            name: "My Attendance",
            path: "/student/attendance",
            icon: "bi-calendar-check-fill"
        },

        {
            name: "My Marks",
            path: "/student/marks",
            icon: "bi-clipboard-data-fill"
        },

        {
            name: "My Profile",
            path: "/student/profile",
            icon: "bi-person-circle"
        }

    ];


    return (

        <>

            {/* =====================================================
                DESKTOP SIDEBAR
                NORMAL DOCUMENT FLOW
            ===================================================== */}

            <aside

                className="bg-dark text-white d-none d-lg-flex flex-column shadow"

                style={{

                    /*
                     * IMPORTANT
                     * No fixed
                     * No sticky
                     * No top/left/bottom
                     *
                     * Sidebar stays inside app-body.
                     */

                    position: "relative",

                    flex: "0 0 auto",

                    width: collapsed
                        ? "80px"
                        : "260px",

                    minWidth: collapsed
                        ? "80px"
                        : "260px",

                    minHeight: "calc(100vh - 56px)",

                    padding: collapsed
                        ? "1rem 0.6rem"
                        : "1.5rem",

                    transition:
                        "width 0.3s ease, min-width 0.3s ease, padding 0.3s ease",

                    overflowY: "auto",

                    overflowX: "hidden"

                }}

            >

                {/* =================================================
                    LOGO / BRAND
                ================================================= */}

                <div

                    className="text-center"

                    style={{
                        flexShrink: 0
                    }}

                >

                    <div

                        className="bg-primary rounded-circle shadow d-flex justify-content-center align-items-center mx-auto"

                        style={{

                            width: collapsed
                                ? "50px"
                                : "65px",

                            height: collapsed
                                ? "50px"
                                : "65px",

                            transition:
                                "all 0.3s ease"

                        }}

                    >

                        <i

                            className={`bi bi-mortarboard-fill ${
                                collapsed
                                    ? "fs-4"
                                    : "fs-3"
                            } text-white`}

                        ></i>

                    </div>


                    {!collapsed && (

                        <>

                            <h4 className="fw-bold mt-3 mb-0">

                                School MS

                            </h4>

                            <small className="text-light opacity-75">

                                Student Portal

                            </small>

                        </>

                    )}

                </div>


                {/* =================================================
                    SEPARATOR
                ================================================= */}

                <hr

                    className="border-secondary opacity-50"

                    style={{
                        flexShrink: 0
                    }}

                />


                {/* =================================================
                    DESKTOP MENU
                ================================================= */}

                <ul

                    className="nav nav-pills flex-column gap-2"

                    style={{
                        flex: "1 1 auto"
                    }}

                >

                    {menuItems.map((item) => (

                        <li

                            key={item.path}

                            className={`nav-item ${
                                collapsed
                                    ? "text-center"
                                    : ""
                            }`}

                        >

                            <NavLink

                                to={item.path}

                                end={
                                    item.path === "/student"
                                }

                                title={
                                    collapsed
                                        ? item.name
                                        : ""
                                }

                                className={({ isActive }) =>

                                    `nav-link rounded-3 py-3 d-flex align-items-center ${
                                        collapsed
                                            ? "justify-content-center px-2"
                                            : "px-3"
                                    } ${
                                        isActive
                                            ? "active fw-bold"
                                            : "text-white"
                                    }`

                                }

                            >

                                <i

                                    className={`${item.icon} fs-5 ${
                                        collapsed
                                            ? ""
                                            : "me-3"
                                    }`}

                                ></i>


                                {!collapsed && (

                                    <span>

                                        {item.name}

                                    </span>

                                )}

                            </NavLink>

                        </li>

                    ))}

                </ul>


                {/* =================================================
                    DESKTOP LOGOUT
                ================================================= */}

                <div

                    style={{
                        flexShrink: 0
                    }}

                >

                    <hr className="border-secondary opacity-50" />


                    <button

                        type="button"

                        className={`btn btn-outline-danger rounded-pill py-2 ${
                            collapsed
                                ? "px-3 d-flex mx-auto"
                                : "w-100"
                        }`}

                        onClick={handleLogout}

                        title={
                            collapsed
                                ? "Logout"
                                : ""
                        }

                    >

                        <i

                            className={`bi bi-box-arrow-right fs-5 ${
                                collapsed
                                    ? ""
                                    : "me-2"
                            }`}

                        ></i>


                        {!collapsed && "Logout"}

                    </button>

                </div>

            </aside>


            {/* =====================================================
                MOBILE SIDEBAR
                BOOTSTRAP OFFCANVAS
            ===================================================== */}

            <div

                className="offcanvas offcanvas-start bg-dark text-white"

                tabIndex="-1"

                id="sidebar"

                aria-labelledby="studentSidebarLabel"

                style={{

                    width: "280px",

                    maxWidth: "85vw",

                    zIndex: 1060

                }}

            >

                {/* =================================================
                    MOBILE HEADER
                ================================================= */}

                <div className="offcanvas-header">

                    <div>

                        <h4

                            id="studentSidebarLabel"

                            className="fw-bold mb-0"

                        >

                            School MS

                        </h4>

                        <small className="text-light opacity-75">

                            Student Portal

                        </small>

                    </div>


                    <button

                        type="button"

                        className="btn-close btn-close-white"

                        data-bs-dismiss="offcanvas"

                        aria-label="Close"

                    ></button>

                </div>


                {/* =================================================
                    MOBILE BODY
                ================================================= */}

                <div

                    className="offcanvas-body d-flex flex-column"

                    style={{
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}

                >

                    {/* Mobile Menu */}

                    <ul className="nav nav-pills flex-column gap-2">

                        {menuItems.map((item) => (

                            <li

                                key={item.path}

                                className="nav-item"

                            >

                                <NavLink
    to={item.path}
    end={item.path === "/student"}
    className={({ isActive }) =>
        `nav-link rounded-3 px-3 py-3 d-flex align-items-center ${
            isActive
                ? "active fw-bold"
                : "text-white"
        }`
    }
>
    <i className={`${item.icon} fs-5 me-3`}></i>

    {item.name}
</NavLink>

                            </li>

                        ))}

                    </ul>


                    {/* =================================================
                        MOBILE LOGOUT
                    ================================================= */}

                    <div className="mt-auto">

                        <hr className="border-secondary opacity-50" />


                        <button

                            type="button"

                            className="btn btn-outline-danger rounded-pill py-2 w-100"

                            onClick={handleLogout}

                        >

                            <i className="bi bi-box-arrow-right fs-5 me-2"></i>

                            Logout

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default StudentSidebar;