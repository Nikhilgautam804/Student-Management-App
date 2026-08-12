import axios from "axios";


// ==================================================
// API BASE URL
// ==================================================

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
});


// ==================================================
// AUTOMATIC JWT
// ==================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) =>
        Promise.reject(error)

);


export default api;