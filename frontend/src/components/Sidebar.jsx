import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Sidebar({ collapsed }) {

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
    // Admin Menu
    // ==========================================

    const menuItems = [

        {
            name: "Dashboard",
            path: "/admin",
            icon: "bi-speedometer2"
        },

        {
            name: "Students",
            path: "/students",
            icon: "bi-people-fill"
        },

        {
            name: "Teachers",
            path: "/teachers",
            icon: "bi-person-workspace"
        },

        {
            name: "Classes",
            path: "/classes",
            icon: "bi-building"
        },

        {
            name: "Subjects",
            path: "/subjects",
            icon: "bi-book-fill"
        },

        {
            name: "Class Subjects",
            path: "/class-subjects",
            icon: "bi-journal-bookmark-fill"
        },

        {
            name: "Attendance",
            path: "/attendance",
            icon: "bi-calendar-check-fill"
        },

        {
            name: "Marks",
            path: "/marks",
            icon: "bi-clipboard-data-fill"
        },

        {
            name: "Exams",
            path: "/exams",
            icon: "bi-file-earmark-text-fill"
        },

        {
            name: "My Profile",
            path: "/admin/profile",
            icon: "bi-person-circle"
        }

    ];


    return (

        <>

            {/* ==================================================
                DESKTOP SIDEBAR
                NORMAL FLEX SIDEBAR
            ================================================== */}

            <aside

                className="bg-dark text-white shadow-lg d-none d-lg-flex flex-column"

                style={{

                    width: collapsed
                        ? "95px"
                        : "280px",

                    minHeight:
                        "calc(100vh - 56px)",

                    flexShrink: 0,

                    padding: collapsed
                        ? "1rem 0.5rem"
                        : "1.5rem",

                    transition:
                        "width 0.3s ease, padding 0.3s ease",

                    overflowY: "auto",

                    overflowX: "hidden"

                }}

            >

                {/* ==========================================
                    LOGO
                ========================================== */}

                <div
                    className="text-center"
                    style={{
                        flexShrink: 0
                    }}
                >

                    <div

                        className="bg-primary rounded-circle shadow d-flex justify-content-center align-items-center mx-auto"

                        style={{

                            width:
                                collapsed
                                    ? "55px"
                                    : "65px",

                            height:
                                collapsed
                                    ? "55px"
                                    : "65px",

                            transition:
                                "all .3s ease"

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

                            <h4
                                className="fw-bold mt-3 mb-0"
                            >
                                School MS
                            </h4>


                            <small
                                className="text-light opacity-75"
                            >
                                Administration
                            </small>

                        </>

                    )}

                </div>


                {/* ==========================================
                    SEPARATOR
                ========================================== */}

                <hr
                    className="border-secondary opacity-50"
                />


                {/* ==========================================
                    DESKTOP MENU
                ========================================== */}

                <ul

                    className="nav nav-pills flex-column gap-2"

                    style={{
                        flexShrink: 0
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
                                    item.path === "/admin"
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


                {/* ==========================================
                    LOGOUT
                ========================================== */}

                <div

                    className={`mt-auto pt-3 ${
                        collapsed
                            ? "text-center"
                            : ""
                    }`}

                >

                    <hr
                        className="border-secondary opacity-50"
                    />


                    <button

                        type="button"

                        className={`btn btn-outline-danger rounded-pill py-2 ${
                            collapsed
                                ? "px-3"
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


            {/* ==================================================
                MOBILE SIDEBAR
                OFFCANVAS
            ================================================== */}

            <div

                className="offcanvas offcanvas-start bg-dark text-white"

                tabIndex="-1"

                id="sidebar"

                aria-labelledby="sidebarLabel"

                style={{

                    width: "300px",

                    maxWidth: "85vw",

                    zIndex: 1060

                }}

            >

                {/* ==========================================
                    MOBILE HEADER
                ========================================== */}

                <div className="offcanvas-header">

                    <div>

                        <h4
                            id="sidebarLabel"
                            className="fw-bold mb-0"
                        >
                            School MS
                        </h4>

                        <small
                            className="text-light opacity-75"
                        >
                            Administration
                        </small>

                    </div>


                    <button

                        type="button"

                        className="btn-close btn-close-white"

                        data-bs-dismiss="offcanvas"

                        aria-label="Close"

                    ></button>

                </div>


                <div className="px-3">

                    <hr
                        className="border-secondary opacity-50"
                    />

                </div>


                {/* ==========================================
                    MOBILE BODY
                ========================================== */}

                <div

                    className="offcanvas-body d-flex flex-column"

                    style={{
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}

                >

                    <ul
                        className="nav nav-pills flex-column gap-2"
                    >

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


                    {/* ==========================================
                        MOBILE LOGOUT
                    ========================================== */}

                    <div className="mt-auto pt-4">

                        <hr
                            className="border-secondary opacity-50"
                        />


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

export default Sidebar;