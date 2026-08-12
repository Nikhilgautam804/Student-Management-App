import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function Marks() {

    const [classSubjects, setClassSubjects] = useState([]);

    const [exams, setExams] = useState([]);

    const [students, setStudents] = useState([]);

    const [selectedClassSubject, setSelectedClassSubject] = useState("");

    const [selectedExam, setSelectedExam] = useState("");

    const [examDate, setExamDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [maxMarks, setMaxMarks] = useState("");
    const [marksExist, setMarksExist] = useState(false);
    
    const user = JSON.parse(localStorage.getItem("user"));
    const isTeacher = user?.role === "teacher";

    const fetchClassSubjects = async () => {

    try {

        setLoading(true);

        const response = await api.get(
    isTeacher
        ? "/class-subjects/my"
        : "/class-subjects"
);

        setClassSubjects(response.data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};

const fetchExams = async () => {

    try {

        setLoading(true);

        const response = await api.get("/exams");

        setExams(response.data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};
const loadStudents = async () => {

    if (!selectedClassSubject) {

        alert("Please select a Class Subject.");

        return;

    }

    if (!selectedExam) {

        alert("Please select an Exam.");

        return;

    }

    try {

        setLoading(true);

        // Load Students
        let studentResponse;

if (isTeacher) {

    const selectedAllocation = classSubjects.find(
        item => item.id === Number(selectedClassSubject)
    );

    studentResponse = await api.get(
        `/attendance/class/${selectedAllocation.class_id}/students`
    );

} else {

    studentResponse = await api.get(
        `/class-subjects/${selectedClassSubject}/students`
    );

}

        let studentsData = studentResponse.data;

        // Load Existing Marks
        const marksResponse = await api.get(
            `/marks/exam/${selectedExam}/class-subject/${selectedClassSubject}`
        );

        
    
    const existingMarks = marksResponse.data;
    setMarksExist(existingMarks.length > 0);

        // Merge Students + Marks
        const updatedStudents = studentsData.map((student) => {

            const mark = existingMarks.find(
                (m) => m.student_id === student.id
            );

            return {

                ...student,

                marks_obtained: mark
                    ? mark.marks_obtained
                    : ""

            };

        });

        setStudents(updatedStudents);

    } catch (error) {

        console.error(error);

        alert("Unable to load students.");

    } finally {

        setLoading(false);

    }

};
const saveMarks = async () => {

    // Validation
    if (!selectedClassSubject) {
        toast.warning("Please select a Class Subject.");
        return;
    }

    if (!selectedExam) {
        toast.warning("Please select an Exam.");
        return;
    }

    if (students.length === 0) {
        toast.warning("Please load students first.");
        return;
    }

    // Get selected exam
    const exam = exams.find(
        (exam) => exam.id === Number(selectedExam)
    );

    if (!exam) {
        toast.error("Selected exam not found.");
        return;
    }

    const maxMarks = exam.max_marks;

    // Validate marks
    for (const student of students) {

        if (
            student.marks_obtained === "" ||
            student.marks_obtained === null
        ) {
            toast.warning(
                `Please enter marks for ${student.full_name}`
            );
            return;
        }

        const marks = Number(student.marks_obtained);

        if (marks < 0) {
            toast.error(
                `Marks cannot be negative for ${student.full_name}`
            );
            return;
        }

        if (marks > maxMarks) {
            toast.error(
                `${student.full_name}'s marks cannot exceed ${maxMarks}`
            );
            return;
        }

    }

    // Request body
    const requestBody = {

        class_subject_id: Number(selectedClassSubject),

        exam_id: Number(selectedExam),

        marks: students.map(student => ({

            student_id: student.id,

            marks_obtained: Number(student.marks_obtained)

        }))

    };

    try {

        setLoading(true);

        const response = await api.post(
            "/marks",
            requestBody
        );

        toast.success(
    marksExist
        ? "Marks Updated Successfully"
        : "Marks Saved Successfully"
);

        // Reload students with saved marks
        loadStudents();

    } catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Unable to save marks."
        );

    } finally {

        setLoading(false);

    }

};
useEffect(() => {

    fetchClassSubjects();

    fetchExams();

}, []);

    return (

        <Layout>

                <div className="container mt-4">

                    <h2 className="mb-4">
                        Marks Management
                    </h2>

                    <div className="card shadow">

                        <div className="card-body">

                            <div className="row">

                                {/* Class Subject */}

                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Class Subject
                                    </label>

                                   <select
                                        className="form-select"
                                        value={selectedClassSubject}
                                        onChange={(e) =>
                                            setSelectedClassSubject(e.target.value)
                                        }
>
    <option value="">
        Select Class Subject
    </option>

    {classSubjects.map((item) => (
        <option
            key={item.id}
            value={item.id}
        >
            {item.class_name} - {item.section} - {item.subject_name}
        </option>
    ))}
</select>

                                </div>

                                {/* Exam */}

                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Exam
                                    </label>

                                    <select
    className="form-select"
    value={selectedExam}
    onChange={(e) => {

        setSelectedExam(e.target.value);

        const exam = exams.find(
    exam => exam.id === Number(e.target.value)
);

if (exam) {

    setExamDate(exam.exam_date.split("T")[0]);

    setMaxMarks(exam.max_marks);

}

    }}
>
    <option value="">
        Select Exam
    </option>

    {exams.map((exam) => (
        <option
            key={exam.id}
            value={exam.id}
        >
            {exam.exam_name}
        </option>
    ))}
</select>

                                </div>

                                {/* Date */}

                                <div className="col-md-4 mb-3">

                                    <label className="form-label">
                                        Exam Date
                                    </label>

                                    <input
    type="date"
    className="form-control"
    value={examDate}
    readOnly
/>

                                </div>
                                <div className="col-md-3 mb-3">

    <label className="form-label">

        Maximum Marks

    </label>

    <input
        type="text"
        className="form-control"
        value={maxMarks}
        readOnly
    />

</div>

                            </div>

                            <button
                                 className="btn btn-primary"
                                    onClick={loadStudents}
                            >
                                Load Students
                            </button>

                        </div>

                    </div>

                    {/* Students Table */}

                    <div className="card mt-4 shadow">

                        <div className="card-body">

                            <table className="table table-bordered table-hover">

                                <thead>

                                    <tr>

                                        <th>Roll No</th>

                                        <th>Student Name</th>

                                        <th>Marks</th>

                                    </tr>

                                </thead>

                                <tbody>

{
students.length === 0 ?

(
<tr>

<td
colSpan="3"
className="text-center"
>
No Students Loaded
</td>

</tr>
)

:

students.map((student) => (

<tr key={student.id}>

<td>{student.roll_no}</td>

<td>{student.full_name}</td>

<td>

<input

type="number"

className="form-control"

value={student.marks_obtained}

onChange={(e) => {

const updated = [...students];

const index = updated.findIndex(
(s) => s.id === student.id
);

updated[index].marks_obtained =
e.target.value;

setStudents(updated);

}}

placeholder="Enter Marks"

/>

</td>

</tr>

))
}

</tbody>

                            </table>

                           <button
    className="btn btn-success"
    onClick={saveMarks}
    disabled={loading}
>
    {
    loading
        ? "Saving..."
        : marksExist
            ? "Update Marks"
            : "Save Marks"
}
</button>

                        </div>

                    </div>

                </div>

            </Layout>

    );

}

export default Marks;