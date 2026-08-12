import api from "./api";

// ==========================================
// Teacher Dashboard - My Students
// ==========================================

export const getMyStudents = async () => {

    try {

        const response = await api.get(
            "/teachers/students"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get My Students Error:",
            error
        );

        throw error;

    }

};