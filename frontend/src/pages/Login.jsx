import { useState } from "react";
import api from "../services/api";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "student"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleLogin = async () => {
    try {

        const response = await api.post("/auth/login", formData);

        // Save JWT Token
        localStorage.setItem("token", response.data.token);

        // Save Logged In User
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        alert("Login Successful!");

        console.log(response.data);

        // Redirect according to role
        if (response.data.user.role === "admin") {
            window.location.href = "/admin";
        } else if (response.data.user.role === "teacher") {
            window.location.href = "/teacher";
        } else {
            window.location.href = "/student";
        }

    } catch (error) {

        console.log(error);

        alert(error.response?.data?.message || "Login Failed");

    }
};
    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                School Login
                            </h2>

                            <input
                                className="form-control mb-3"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <select
                                className="form-select mb-3"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="teacher">
                                    Teacher
                                </option>

                                <option value="student">
                                    Student
                                </option>

                            </select>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleLogin}
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;