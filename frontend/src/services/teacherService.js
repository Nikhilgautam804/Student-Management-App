import axios from "axios";

const API_URL = "http://localhost:5000/api/teachers";

export const getMyStudents = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/students`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};