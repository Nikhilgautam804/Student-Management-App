import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {

    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));

    // Not Logged In

    if (!token || !user) {

        return <Navigate to="/login" replace />;

    }

    // Wrong Role

    if (roles && !roles.includes(user.role)) {

        return <Navigate to="/" replace />;

    }

    // Correct User

    return children;

}

export default ProtectedRoute;