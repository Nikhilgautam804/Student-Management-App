import api from "./api";

// ==================================================
// GET MY STUDENTS
// ==================================================

export const getMyStudents = async () => {

    const response = await api.get(
        "/teachers/students"
    );

    return response.data;

};