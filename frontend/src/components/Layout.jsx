import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";

function Layout({ children }) {

    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    // ==========================================
    // Sidebar Width
    // ==========================================

    const getSidebarWidth = () => {

        if (user?.role === "admin") {
            return collapsed ? "95px" : "280px";
        }

        if (user?.role === "teacher") {
            return collapsed ? "80px" : "260px";
        }

        if (user?.role === "student") {
            return collapsed ? "80px" : "260px";
        }

        return "0px";
    };


    const sidebarWidth = getSidebarWidth();


    return (
        <div className="app-layout">

            {/* ==========================================
                NAVBAR
            ========================================== */}

            <Navbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />


            {/* ==========================================
                SIDEBAR + CONTENT
            ========================================== */}

            <div
                className="app-body"
                style={{
                    "--sidebar-width": sidebarWidth
                }}
            >

                {/* ==========================================
                    SIDEBAR
                ========================================== */}

                {user?.role === "admin" && (
                    <Sidebar
                        collapsed={collapsed}
                    />
                )}


                {user?.role === "teacher" && (
                    <TeacherSidebar
                        collapsed={collapsed}
                    />
                )}


                {user?.role === "student" && (
                    <StudentSidebar
                        collapsed={collapsed}
                    />
                )}


                {/* ==========================================
                    MAIN CONTENT
                ========================================== */}

                <main className="app-main">

                    <div className="app-content">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Layout;