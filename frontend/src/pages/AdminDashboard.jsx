import React, { useEffect, useMemo, useState } from "react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Building2,
    CalendarCheck,
    ClipboardList,
    GraduationCap,
    UserPlus,
    LogOut,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Save,
    RefreshCw,
    Activity,
    ChevronRight,
    ShieldCheck,
    UserCheck,
    BookMarked,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp
} from "lucide-react";

import { apiRequest } from "../api";

export default function AdminDashboard() {

    // =========================================================
    // NAVIGATION
    // =========================================================

    const [activePage, setActivePage] = useState("dashboard");

    // =========================================================
    // CORE DATA
    // =========================================================

    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    // =========================================================
    // ACADEMIC DATA
    // =========================================================

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [examinations, setExaminations] = useState([]);
    const [results, setResults] = useState([]);

    // =========================================================
    // LOADING / MESSAGES
    // =========================================================

    const [loading, setLoading] = useState(false);
    const [academicLoading, setAcademicLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================================================
    // SEARCH
    // =========================================================

    const [studentSearchText, setStudentSearchText] = useState("");
    const [departmentSearchText, setDepartmentSearchText] = useState("");
    const [courseSearchText, setCourseSearchText] = useState("");
    const [enrollmentSearchText, setEnrollmentSearchText] = useState("");

    const [attendanceSearchText, setAttendanceSearchText] = useState("");
    const [attendanceStudentId, setAttendanceStudentId] =
    useState("");
    const [examinationSearchText, setExaminationSearchText] = useState("");
    const [resultSearchText, setResultSearchText] = useState("");

    // =========================================================
    // MODALS
    // =========================================================

    const [showStudentForm, setShowStudentForm] = useState(false);
    const [showDepartmentForm, setShowDepartmentForm] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

    const [showAttendanceForm, setShowAttendanceForm] = useState(false);
    const [showExaminationForm, setShowExaminationForm] = useState(false);
    const [showResultForm, setShowResultForm] = useState(false);

    // =========================================================
    // EDITING
    // =========================================================

    const [editingStudent, setEditingStudent] = useState(null);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingEnrollment, setEditingEnrollment] = useState(null);

    const [editingAttendance, setEditingAttendance] = useState(null);
    const [editingExamination, setEditingExamination] = useState(null);
    const [editingResult, setEditingResult] = useState(null);

    // =========================================================
    // FORMS
    // =========================================================

    const [studentForm, setStudentForm] = useState({
        name: "",
        email: "",
        phone: "",
        departmentId: "",
        status: "ACTIVE"
    });

    const [departmentForm, setDepartmentForm] = useState({
        departmentName: "",
        departmentCode: "",
        status: "ACTIVE"
    });

    const [courseForm, setCourseForm] = useState({
        courseName: "",
        courseCode: "",
        credits: "",
        departmentId: "",
        status: "ACTIVE"
    });

    const [enrollmentForm, setEnrollmentForm] = useState({
        studentId: "",
        courseId: ""
    });

    const [attendanceForm, setAttendanceForm] = useState({
        studentId: "",
        courseId: "",
        attendanceDate: "",
        present: "true"
    });

    const [examinationForm, setExaminationForm] = useState({
        courseId: "",
        examName: "",
        examType: "",
        examDate: "",
        status: "SCHEDULED"
    });

    const [resultForm, setResultForm] = useState({
        studentId: "",
        examId: "",
        marks: ""
    });

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadDashboardData();
        loadAcademicData();
    }, []);

    // =========================================================
    // CORE DATA LOADING
    // =========================================================

    async function loadDashboardData() {

        try {
            setLoading(true);
            setError("");

            const [
                studentsData,
                departmentsData,
                coursesData,
                enrollmentsData
            ] = await Promise.all([
                apiRequest("/students"),
                apiRequest("/departments"),
                apiRequest("/courses"),
                apiRequest("/enrollments")
            ]);

            setStudents(Array.isArray(studentsData) ? studentsData : []);
            setDepartments(
                Array.isArray(departmentsData) ? departmentsData : []
            );
            setCourses(Array.isArray(coursesData) ? coursesData : []);
            setEnrollments(
                Array.isArray(enrollmentsData) ? enrollmentsData : []
            );

        } catch (err) {
            setError(err.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    // =========================================================
    // ACADEMIC DATA LOADING
    // =========================================================

    async function loadAcademicData() {

        try {
            setAcademicLoading(true);

            const resultsData = await Promise.allSettled([
                apiRequest("/attendance"),
                apiRequest("/examinations"),
                apiRequest("/results")
            ]);

            if (resultsData[0].status === "fulfilled") {
                setAttendanceRecords(
                    Array.isArray(resultsData[0].value)
                        ? resultsData[0].value
                        : []
                );
            }

            if (resultsData[1].status === "fulfilled") {
                setExaminations(
                    Array.isArray(resultsData[1].value)
                        ? resultsData[1].value
                        : []
                );
            }

            if (resultsData[2].status === "fulfilled") {
                setResults(
                    Array.isArray(resultsData[2].value)
                        ? resultsData[2].value
                        : []
                );
            }

        } catch (err) {
            setError(err.message || "Failed to load academic data.");
        } finally {
            setAcademicLoading(false);
        }
    }

    // =========================================================
    // REFRESH EVERYTHING
    // =========================================================

   

    // =========================================================
    // HELPERS
    // =========================================================

    function clearMessages() {
        setMessage("");
        setError("");
    }

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(`${value}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString();
    }

    function getDepartmentName(departmentId) {

        const department = departments.find(
            d => Number(d.departmentId) === Number(departmentId)
        );

        return department?.departmentName || "—";
    }

    function getStudent(studentId) {

        return students.find(
            s => Number(s.studentId) === Number(studentId)
        );
    }

    function getCourse(courseId) {

        return courses.find(
            c => Number(c.courseId) === Number(courseId)
        );
    }

    function getExamination(examId) {

        return examinations.find(
            e => Number(e.examId) === Number(examId)
        );
    }

    function getStudentFromRecord(record) {

        if (record?.student) {
            return record.student;
        }

        return getStudent(record?.studentId);
    }

    function getCourseFromRecord(record) {

        if (record?.course) {
            return record.course;
        }

        return getCourse(record?.courseId);
    }

    function getExaminationFromRecord(record) {

        if (record?.examination) {
            return record.examination;
        }

        return getExamination(record?.examId);
    }

    function getStudentName(record) {

        const student = getStudentFromRecord(record);

        return student?.name || "Unknown Student";
    }

    function getStudentIdFromRecord(record) {

        const student = getStudentFromRecord(record);

        return student?.studentId || record?.studentId || "—";
    }

    function getCourseName(record) {

        const course = getCourseFromRecord(record);

        return course?.courseName || "Unknown Course";
    }

    function getCourseCode(record) {

        const course = getCourseFromRecord(record);

        return course?.courseCode || "—";
    }

    function getCourseIdFromRecord(record) {

        const course = getCourseFromRecord(record);

        return course?.courseId || record?.courseId;
    }

    function getExamName(record) {

        const examination = getExaminationFromRecord(record);

        return examination?.examName || "Unknown Examination";
    }

    function getExamIdFromRecord(record) {

        const examination = getExaminationFromRecord(record);

        return examination?.examId || record?.examId;
    }

    // =========================================================
    // ACTIVE ENROLLMENTS
    // =========================================================

    const activeEnrollments = useMemo(() => {

        return enrollments.filter(
            enrollment =>
                String(enrollment.status || "").toUpperCase() === "ENROLLED"
        );

    }, [enrollments]);

    function isStudentEnrolledInCourse(studentId, courseId) {

        return activeEnrollments.some(enrollment => {

            const enrollmentStudentId =
                enrollment.student?.studentId ??
                enrollment.studentId;

            const enrollmentCourseId =
                enrollment.course?.courseId ??
                enrollment.courseId;

            return (
                Number(enrollmentStudentId) === Number(studentId) &&
                Number(enrollmentCourseId) === Number(courseId)
            );
        });
    }

    function getStudentEnrolledCourses(studentId) {

        return activeEnrollments
            .filter(enrollment => {

                const enrollmentStudentId =
                    enrollment.student?.studentId ??
                    enrollment.studentId;

                return Number(enrollmentStudentId) === Number(studentId);
            })
            .map(enrollment => {

                const course =
                    enrollment.course ||
                    getCourse(enrollment.courseId);

                return course;
            })
            .filter(Boolean);
    }

    // =========================================================
    // STUDENT CRUD
    // =========================================================

    function openAddStudent() {

        clearMessages();

        setEditingStudent(null);

        setStudentForm({
            name: "",
            email: "",
            phone: "",
            departmentId: "",
            status: "ACTIVE"
        });

        setShowStudentForm(true);
    }

    function openEditStudent(student) {

        clearMessages();

        setEditingStudent(student);

        setStudentForm({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            departmentId:
                student.department?.departmentId ||
                student.departmentId ||
                "",
            status: student.status || "ACTIVE"
        });

        setShowStudentForm(true);
    }

    async function saveStudent(event) {

    event.preventDefault();

    try {

        clearMessages();

        const departmentId =
            Number(studentForm.departmentId);

        if (!departmentId) {
            setError("Please select a department.");
            return;
        }

        const body = {
            name: studentForm.name,
            email: studentForm.email,
            phone: studentForm.phone,
            status: studentForm.status
        };

        if (editingStudent) {

            await apiRequest(
                `/students/${editingStudent.studentId}?departmentId=${departmentId}`,
                "PUT",
                body
            );

            setMessage(
                "Student updated successfully."
            );

        } else {

            await apiRequest(
                `/students?departmentId=${departmentId}`,
                "POST",
                body
            );

            setMessage(
                "Student added successfully."
            );
        }

        setShowStudentForm(false);

        await loadDashboardData();

    } catch (err) {

        setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to save student."
        );
    }
}

    async function deleteStudent(student) {

        if (
            !window.confirm(
                `Are you sure you want to delete student ${student.name}?`
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/students/${student.studentId}`,
                "DELETE"
            );

            setMessage("Student deleted successfully.");

            await loadDashboardData();

        } catch (err) {

            setError(err.message || "Failed to delete student.");
        }
    }

    // =========================================================
    // DEPARTMENT CRUD
    // =========================================================

    function openAddDepartment() {

        clearMessages();

        setEditingDepartment(null);

        setDepartmentForm({
            departmentName: "",
            departmentCode: "",
            status: "ACTIVE"
        });

        setShowDepartmentForm(true);
    }

    function openEditDepartment(department) {

        clearMessages();

        setEditingDepartment(department);

        setDepartmentForm({
            departmentName: department.departmentName || "",
            departmentCode: department.departmentCode || "",
            status: department.status || "ACTIVE"
        });

        setShowDepartmentForm(true);
    }

    async function saveDepartment(event) {

        event.preventDefault();

        try {

            clearMessages();

            const body = {
                departmentName: departmentForm.departmentName,
                departmentCode: departmentForm.departmentCode,
                status: departmentForm.status
            };

            if (editingDepartment) {

                await apiRequest(
                    `/departments/${editingDepartment.departmentId}`,
                    "PUT",
                    body
                );

                setMessage("Department updated successfully.");

            } else {

                await apiRequest(
                    "/departments",
                    "POST",
                    body
                );

                setMessage("Department added successfully.");
            }

            setShowDepartmentForm(false);

            await loadDashboardData();

        } catch (err) {

            setError(err.message || "Failed to save department.");
        }
    }

    async function deleteDepartment(department) {

        if (
            !window.confirm(
                `Are you sure you want to delete ${department.departmentName}?`
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/departments/${department.departmentId}`,
                "DELETE"
            );

            setMessage("Department deleted successfully.");

            await loadDashboardData();

        } catch (err) {

            setError(err.message || "Failed to delete department.");
        }
    }

    // =========================================================
    // COURSE CRUD
    // =========================================================

    function openAddCourse() {

        clearMessages();

        setEditingCourse(null);

        setCourseForm({
            courseName: "",
            courseCode: "",
            credits: "",
            departmentId: "",
            status: "ACTIVE"
        });

        setShowCourseForm(true);
    }

    function openEditCourse(course) {

        clearMessages();

        setEditingCourse(course);

        setCourseForm({
            courseName: course.courseName || "",
            courseCode: course.courseCode || "",
            credits: course.credits || "",
            departmentId:
                course.department?.departmentId ||
                course.departmentId ||
                "",
            status: course.status || "ACTIVE"
        });

        setShowCourseForm(true);
    }

    async function saveCourse(event) {

    event.preventDefault();

    try {

        clearMessages();

        const departmentId =
            Number(courseForm.departmentId);

        if (!departmentId) {
            setError("Please select a department.");
            return;
        }

        const body = {
            courseName: courseForm.courseName,
            courseCode: courseForm.courseCode,
            credits: Number(courseForm.credits),
            status: courseForm.status
        };

        if (editingCourse) {

            await apiRequest(
                `/courses/${editingCourse.courseId}?departmentId=${departmentId}`,
                "PUT",
                body
            );

            setMessage(
                "Course updated successfully."
            );

        } else {

            await apiRequest(
                `/courses?departmentId=${departmentId}`,
                "POST",
                body
            );

            setMessage(
                "Course added successfully."
            );
        }

        setShowCourseForm(false);

        await loadDashboardData();

    } catch (err) {

        setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to save course."
        );
    }
}
    async function deleteCourse(course) {

        if (
            !window.confirm(
                `Are you sure you want to delete ${course.courseName}?`
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/courses/${course.courseId}`,
                "DELETE"
            );

            setMessage("Course deleted successfully.");

            await loadDashboardData();

        } catch (err) {

            setError(err.message || "Failed to delete course.");
        }
    }

    // =========================================================
    // ENROLLMENT
    // =========================================================

    function openAddEnrollment() {

        clearMessages();

        setEditingEnrollment(null);

        setEnrollmentForm({
            studentId: "",
            courseId: ""
        });

        setShowEnrollmentForm(true);
    }

    async function saveEnrollment(event) {

    event.preventDefault();

    try {

        clearMessages();

        if (!enrollmentForm.studentId) {
            throw new Error("Please select a student.");
        }

        if (!enrollmentForm.courseId) {
            throw new Error("Please select a course.");
        }

        const studentId =
            Number(enrollmentForm.studentId);

        const courseId =
            Number(enrollmentForm.courseId);

        const selectedStudent =
            students.find(
                student =>
                    Number(student.studentId) ===
                    studentId
            );

        if (!selectedStudent) {
            throw new Error("Selected student was not found.");
        }

        if (
            String(selectedStudent.status).toUpperCase() !==
            "ACTIVE"
        ) {
            throw new Error(
                "Only active students can be enrolled."
            );
        }

        const selectedCourse =
            courses.find(
                course =>
                    Number(course.courseId) ===
                    courseId
            );

        if (!selectedCourse) {
            throw new Error("Selected course was not found.");
        }

        if (
            String(selectedCourse.status).toUpperCase() !==
            "ACTIVE"
        ) {
            throw new Error(
                "Only active courses can be selected."
            );
        }

        await apiRequest(
            `/enrollments?studentId=${studentId}&courseId=${courseId}`,
            "POST"
        );

        setMessage(
            "Student enrolled successfully."
        );

        setShowEnrollmentForm(false);

        setEnrollmentForm({
            studentId: "",
            courseId: ""
        });

        await loadDashboardData();

    } catch (err) {

        setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to enroll student."
        );
    }
}
    async function dropEnrollment(enrollment) {

        if (
            !window.confirm(
                "Are you sure you want to drop this enrollment?"
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/enrollments/${enrollment.enrollmentId}/drop`,
                "PUT"
            );

            setMessage("Enrollment dropped successfully.");

            await loadDashboardData();

        } catch (err) {

            setError(err.message || "Failed to drop enrollment.");
        }
    }

    // =========================================================
    // ATTENDANCE
    // =========================================================

    function openAddAttendance() {

        clearMessages();

        setEditingAttendance(null);

        setAttendanceForm({
            studentId: "",
            courseId: "",
            attendanceDate: new Date().toISOString().split("T")[0],
            present: "true"
        });

        setShowAttendanceForm(true);
    }

    function openEditAttendance(record) {

        clearMessages();

        setEditingAttendance(record);

        const studentId =
            record.student?.studentId ??
            record.studentId ??
            "";

        const courseId =
            record.course?.courseId ??
            record.courseId ??
            "";

        setAttendanceForm({
            studentId,
            courseId,
            attendanceDate: record.attendanceDate || "",
            present: record.present ? "true" : "false"
        });

        setShowAttendanceForm(true);
    }

    async function saveAttendance(event) {

        event.preventDefault();

        try {

            clearMessages();

            if (!attendanceForm.studentId) {
                throw new Error("Please select a student.");
            }

            if (!attendanceForm.courseId) {
                throw new Error("Please select a course.");
            }

            if (!attendanceForm.attendanceDate) {
                throw new Error("Please select an attendance date.");
            }

            if (
                !isStudentEnrolledInCourse(
                    attendanceForm.studentId,
                    attendanceForm.courseId
                )
            ) {
                throw new Error(
                    "The selected student is not actively enrolled in this course."
                );
            }

            const body = {
                attendanceDate: attendanceForm.attendanceDate,
                present: attendanceForm.present === "true"
            };

            if (editingAttendance) {

                await apiRequest(
                    `/attendance/${editingAttendance.attendanceId}`,
                    "PUT",
                    body
                );

                setMessage("Attendance updated successfully.");

            } else {

                await apiRequest(
                    `/attendance?studentId=${Number(
                        attendanceForm.studentId
                    )}&courseId=${Number(attendanceForm.courseId)}`,
                    "POST",
                    body
                );

                setMessage("Attendance marked successfully.");
            }

            setShowAttendanceForm(false);

            await loadAcademicData();

        } catch (err) {

            setError(err.message || "Failed to save attendance.");
        }
    }

    async function deleteAttendance(record) {

        if (
            !window.confirm(
                "Are you sure you want to delete this attendance record?"
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/attendance/${record.attendanceId}`,
                "DELETE"
            );

            setMessage("Attendance deleted successfully.");

            await loadAcademicData();

        } catch (err) {

            setError(err.message || "Failed to delete attendance.");
        }
    }

    // =========================================================
    // EXAMINATION
    // =========================================================

    function openAddExamination() {

        clearMessages();

        setEditingExamination(null);

        setExaminationForm({
            courseId: "",
            examName: "",
            examType: "",
            examDate: "",
            status: "SCHEDULED"
        });

        setShowExaminationForm(true);
    }

    function openEditExamination(exam) {

        clearMessages();

        setEditingExamination(exam);

        setExaminationForm({
            courseId:
                exam.course?.courseId ||
                exam.courseId ||
                "",
            examName: exam.examName || "",
            examType: exam.examType || "",
            examDate: exam.examDate || "",
            status: exam.status || "SCHEDULED"
        });

        setShowExaminationForm(true);
    }

    async function saveExamination(event) {

        event.preventDefault();

        try {

            clearMessages();

            if (!examinationForm.courseId) {
                throw new Error("Please select a course.");
            }

            if (!examinationForm.examName.trim()) {
                throw new Error("Exam name is required.");
            }

            if (!examinationForm.examType.trim()) {
                throw new Error("Exam type is required.");
            }

            if (!examinationForm.examDate) {
    throw new Error("Exam date is required.");
}

const examDateTime =
    new Date(`${examinationForm.examDate}T00:00:00`);

const minimumDateTime =
    new Date(Date.now() + 24 * 60 * 60 * 1000);

if (examDateTime < minimumDateTime) {
    throw new Error(
        "Examination must be scheduled at least 24 hours in advance."
    );
}

const selectedCourse = getCourse(
    examinationForm.courseId
);

            if (
                selectedCourse &&
                String(selectedCourse.status).toUpperCase() !==
                    "ACTIVE"
            ) {
                throw new Error(
                    "Examination can only be created for an active course."
                );
            }

            const body = {
                examName: examinationForm.examName,
                examType: examinationForm.examType,
                examDate: examinationForm.examDate,
                status: examinationForm.status
            };

            if (editingExamination) {

                await apiRequest(
                    `/examinations/${editingExamination.examId}?courseId=${Number(
                        examinationForm.courseId
                    )}`,
                    "PUT",
                    body
                );

                setMessage(
                    "Examination updated successfully."
                );

            } else {

                await apiRequest(
                    `/examinations?courseId=${Number(
                        examinationForm.courseId
                    )}`,
                    "POST",
                    body
                );

                setMessage(
                    "Examination created successfully."
                );
            }

            setShowExaminationForm(false);

            await loadAcademicData();

        } catch (err) {

            setError(
                err.message ||
                    "Failed to save examination."
            );
        }
    }

    async function deleteExamination(exam) {

        if (
            !window.confirm(
                `Are you sure you want to delete "${exam.examName}"?`
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/examinations/${exam.examId}`,
                "DELETE"
            );

            setMessage(
                "Examination deleted successfully."
            );

            await loadAcademicData();

        } catch (err) {

            setError(
                err.message ||
                    "Failed to delete examination."
            );
        }
    }

    // =========================================================
    // RESULTS
    // =========================================================

    function openAddResult() {

        clearMessages();

        setEditingResult(null);

        setResultForm({
            studentId: "",
            examId: "",
            marks: ""
        });

        setShowResultForm(true);
    }

    function openEditResult(result) {

        clearMessages();

        setEditingResult(result);

        const studentId =
            result.student?.studentId ??
            result.studentId ??
            "";

        const examId =
            result.examination?.examId ??
            result.examId ??
            "";

        setResultForm({
            studentId,
            examId,
            marks:
                result.marks !== null &&
                result.marks !== undefined
                    ? String(result.marks)
                    : ""
        });

        setShowResultForm(true);
    }

    async function saveResult(event) {

        event.preventDefault();

        try {

            clearMessages();

            if (!resultForm.studentId) {
                throw new Error("Please select a student.");
            }

            if (!resultForm.examId) {
                throw new Error("Please select an examination.");
            }

            if (
                resultForm.marks === "" ||
                resultForm.marks === null
            ) {
                throw new Error("Marks are required.");
            }

            const marks = Number(resultForm.marks);

            if (Number.isNaN(marks)) {
                throw new Error("Marks must be a valid number.");
            }

            if (marks < 0 || marks > 50) {
                throw new Error(
                    "Marks must be between 0 and 50."
                );
            }

            const selectedExam = getExamination(
                resultForm.examId
            );

            const examCourseId =
                selectedExam?.course?.courseId ??
                selectedExam?.courseId;

            if (!examCourseId) {
                throw new Error(
                    "Selected examination has no valid course."
                );
            }

            if (
                !isStudentEnrolledInCourse(
                    resultForm.studentId,
                    examCourseId
                )
            ) {
                throw new Error(
                    "The selected student is not actively enrolled in the examination course."
                );
            }

            const body = {
                marks
            };

            if (editingResult) {

                await apiRequest(
                    `/results/${editingResult.resultId}`,
                    "PUT",
                    body
                );

                setMessage(
                    "Result updated successfully."
                );

            } else {

                await apiRequest(
                    `/results?studentId=${Number(
                        resultForm.studentId
                    )}&examId=${Number(resultForm.examId)}`,
                    "POST",
                    body
                );

                setMessage(
                    "Result added successfully."
                );
            }

            setShowResultForm(false);

            await loadAcademicData();

        } catch (err) {

            setError(
                err.message ||
                    "Failed to save result."
            );
        }
    }

    async function deleteResult(result) {

        if (
            !window.confirm(
                "Are you sure you want to delete this result?"
            )
        ) {
            return;
        }

        try {

            clearMessages();

            await apiRequest(
                `/results/${result.resultId}`,
                "DELETE"
            );

            setMessage(
                "Result deleted successfully."
            );

            await loadAcademicData();

        } catch (err) {

            setError(
                err.message ||
                    "Failed to delete result."
            );
        }
    }

    // =========================================================
    // FILTERED DATA
    // =========================================================

    const filteredStudents = students.filter(student => {

        const search = studentSearchText.toLowerCase();

        return (
            student.name?.toLowerCase().includes(search) ||
            student.email?.toLowerCase().includes(search) ||
            String(student.studentId).includes(search)
        );
    });

    const filteredDepartments = departments.filter(department => {

        const search =
            departmentSearchText.toLowerCase();

        return (
            department.departmentName
                ?.toLowerCase()
                .includes(search) ||
            department.departmentCode
                ?.toLowerCase()
                .includes(search)
        );
    });

    const filteredCourses = courses.filter(course => {

        const search = courseSearchText.toLowerCase();

        return (
            course.courseName
                ?.toLowerCase()
                .includes(search) ||
            course.courseCode
                ?.toLowerCase()
                .includes(search)
        );
    });

    const filteredEnrollments = enrollments.filter(
        enrollment => {

            const search =
                enrollmentSearchText.toLowerCase();

            const studentName =
                enrollment.student?.name ||
                getStudent(
                    enrollment.studentId
                )?.name ||
                "";

            const courseName =
                enrollment.course?.courseName ||
                getCourse(
                    enrollment.courseId
                )?.courseName ||
                "";

            return (
                studentName
                    .toLowerCase()
                    .includes(search) ||
                courseName
                    .toLowerCase()
                    .includes(search) ||
                String(
                    enrollment.enrollmentId
                ).includes(search)
            );
        }
    );

    const filteredAttendance = attendanceRecords.filter(
        record => {

            const search =
                attendanceSearchText.toLowerCase();

            return (
                getStudentName(record)
                    .toLowerCase()
                    .includes(search) ||
                getCourseName(record)
                    .toLowerCase()
                    .includes(search) ||
                getCourseCode(record)
                    .toLowerCase()
                    .includes(search) ||
                String(
                    getStudentIdFromRecord(record)
                ).includes(search) ||
                String(record.attendanceDate || "")
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    const filteredExaminations = examinations.filter(
        exam => {

            const search =
                examinationSearchText.toLowerCase();

            const course =
                exam.course ||
                getCourse(exam.courseId);

            return (
                exam.examName
                    ?.toLowerCase()
                    .includes(search) ||
                exam.examType
                    ?.toLowerCase()
                    .includes(search) ||
                course?.courseName
                    ?.toLowerCase()
                    .includes(search) ||
                course?.courseCode
                    ?.toLowerCase()
                    .includes(search)
            );
        }
    );

    const filteredResults = results.filter(result => {

        const search =
            resultSearchText.toLowerCase();

        return (
            getStudentName(result)
                .toLowerCase()
                .includes(search) ||
            getExamName(result)
                .toLowerCase()
                .includes(search) ||
            getCourseName(
                getExaminationFromRecord(result) || {}
            )
                .toLowerCase()
                .includes(search) ||
            String(result.grade || "")
                .toLowerCase()
                .includes(search) ||
            String(result.resultStatus || "")
                .toLowerCase()
                .includes(search)
        );
    });

    // =========================================================
    // RESULT EXAM FILTER
    // =========================================================

    const resultAvailableExaminations =
        resultForm.studentId
            ? examinations.filter(exam => {

                  const courseId =
                      exam.course?.courseId ??
                      exam.courseId;

                  return isStudentEnrolledInCourse(
                      resultForm.studentId,
                      courseId
                  );
              })
            : [];

    // =========================================================
    // ATTENDANCE COURSE FILTER
    // =========================================================

    const attendanceAvailableCourses =
        attendanceForm.studentId
            ? getStudentEnrolledCourses(
                  attendanceForm.studentId
              )
            : [];

    // =========================================================
    // DASHBOARD COUNTS
    // =========================================================

    const activeStudentsCount =
        students.filter(
            student =>
                String(student.status).toUpperCase() ===
                "ACTIVE"
        ).length;

    const activeCoursesCount =
        courses.filter(
            course =>
                String(course.status).toUpperCase() ===
                "ACTIVE"
        ).length;

    const activeEnrollmentsCount =
        enrollments.filter(
            enrollment =>
                String(enrollment.status).toUpperCase() ===
                "ENROLLED"
        ).length;

    const presentAttendanceCount =
        attendanceRecords.filter(
            record => record.present === true
        ).length;

    const scheduledExamsCount =
        examinations.filter(
            exam =>
                String(exam.status).toUpperCase() ===
                "SCHEDULED"
        ).length;

    const passedResultsCount =
        results.filter(
            result =>
                String(result.resultStatus).toUpperCase() ===
                "PASS"
        ).length;

    // =========================================================
    // NAVIGATION
    // =========================================================

    function changeSection(section) {

        setActivePage(section);

        clearMessages();

        if (section === "attendance") {
            loadAcademicData();
        }

        if (section === "examinations") {
            loadAcademicData();
        }

        if (section === "results") {
            loadAcademicData();
        }
    }

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    }

    // =========================================================
    // RENDER DASHBOARD
    // =========================================================

    function renderDashboard() {

        return (
            <PageContainer
                eyebrow="ADMIN CONTROL CENTER"
                title="Dashboard"
                subtitle="Monitor and manage the Student Information Management System."
            >

                <div className="stats-grid">

                    <StatCard
                        icon={Users}
                        label="Total Students"
                        value={students.length}
                    />

                    <StatCard
                        icon={UserCheck}
                        label="Active Students"
                        value={activeStudentsCount}
                    />

                    <StatCard
                        icon={BookOpen}
                        label="Active Courses"
                        value={activeCoursesCount}
                    />

                    <StatCard
                        icon={Building2}
                        label="Departments"
                        value={departments.length}
                    />

                    <StatCard
                        icon={BookMarked}
                        label="Active Enrollments"
                        value={activeEnrollmentsCount}
                    />

                    <StatCard
                        icon={CalendarCheck}
                        label="Attendance Records"
                        value={attendanceRecords.length}
                    />

                    <StatCard
                        icon={ClipboardList}
                        label="Examinations"
                        value={examinations.length}
                    />

                    <StatCard
                        icon={GraduationCap}
                        label="Results"
                        value={results.length}
                    />

                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h3>Quick Actions</h3>
                                <p>
                                    Frequently used management actions
                                </p>
                            </div>

                            <TrendingUp size={20} />

                        </div>

                        <div className="quick-actions">

                            <QuickAction
                                icon={UserPlus}
                                label="Add Student"
                                onClick={openAddStudent}
                            />

                            <QuickAction
                                icon={BookOpen}
                                label="Add Course"
                                onClick={openAddCourse}
                            />

                            <QuickAction
                                icon={CalendarCheck}
                                label="Mark Attendance"
                                onClick={openAddAttendance}
                            />

                            <QuickAction
                                icon={ClipboardList}
                                label="Create Examination"
                                onClick={openAddExamination}
                            />

                            <QuickAction
                                icon={GraduationCap}
                                label="Add Result"
                                onClick={openAddResult}
                            />

                        </div>

                    </div>

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // STUDENTS PAGE
    // =========================================================

    function renderStudents() {

        return (
            <PageContainer
                eyebrow="STUDENT MANAGEMENT"
                title="Students"
                subtitle="Add, update, search and manage student records."
            >

                <Toolbar
                    searchValue={studentSearchText}
                    onSearchChange={setStudentSearchText}
                    placeholder="Search students..."
                    onAdd={openAddStudent}
                    addLabel="Add Student"
                />

                <div className="table-wrapper">

                    {filteredStudents.length === 0 ? (

                        <EmptyState
                            icon={Users}
                            title="No students found"
                            message="There are no student records matching your search."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map(student => (

                                    <tr key={student.studentId}>

                                        <td>
                                            #{student.studentId}
                                        </td>

                                        <td>
                                            <strong>
                                                {student.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {student.email}
                                        </td>

                                        <td>
                                            {student.phone || "—"}
                                        </td>

                                        <td>
                                            {student.department?.departmentName ||
                                                getDepartmentName(
                                                    student.departmentId
                                                )}
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={
                                                    student.status
                                                }
                                            />
                                        </td>

                                        <td>
                                            <ActionButtons
                                                onEdit={() =>
                                                    openEditStudent(
                                                        student
                                                    )
                                                }
                                                onDelete={() =>
                                                    deleteStudent(
                                                        student
                                                    )
                                                }
                                            />
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // DEPARTMENTS PAGE
    // =========================================================

    function renderDepartments() {

        return (
            <PageContainer
                eyebrow="ACADEMIC STRUCTURE"
                title="Departments"
                subtitle="Manage university departments."
            >

                <Toolbar
                    searchValue={departmentSearchText}
                    onSearchChange={
                        setDepartmentSearchText
                    }
                    placeholder="Search departments..."
                    onAdd={openAddDepartment}
                    addLabel="Add Department"
                />

                <div className="table-wrapper">

                    {filteredDepartments.length === 0 ? (

                        <EmptyState
                            icon={Building2}
                            title="No departments found"
                            message="No departments match your search."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Department</th>
                                    <th>Code</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredDepartments.map(
                                    department => (

                                        <tr
                                            key={
                                                department.departmentId
                                            }
                                        >

                                            <td>
                                                #
                                                {
                                                    department.departmentId
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        department.departmentName
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    department.departmentCode
                                                }
                                            </td>

                                            <td>
                                                <StatusBadge
                                                    status={
                                                        department.status
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <ActionButtons
                                                    onEdit={() =>
                                                        openEditDepartment(
                                                            department
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        deleteDepartment(
                                                            department
                                                        )
                                                    }
                                                />
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // COURSES PAGE
    // =========================================================

    function renderCourses() {

        return (
            <PageContainer
                eyebrow="COURSE MANAGEMENT"
                title="Courses"
                subtitle="Manage courses, credits and department assignments."
            >

                <Toolbar
                    searchValue={courseSearchText}
                    onSearchChange={setCourseSearchText}
                    placeholder="Search courses..."
                    onAdd={openAddCourse}
                    addLabel="Add Course"
                />

                <div className="table-wrapper">

                    {filteredCourses.length === 0 ? (

                        <EmptyState
                            icon={BookOpen}
                            title="No courses found"
                            message="No courses match your search."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Course</th>
                                    <th>Code</th>
                                    <th>Credits</th>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredCourses.map(course => (

                                    <tr
                                        key={course.courseId}
                                    >

                                        <td>
                                            #{course.courseId}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    course.courseName
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {course.courseCode}
                                        </td>

                                        <td>
                                            {course.credits}
                                        </td>

                                        <td>
                                            {
                                                course.department
                                                    ?.departmentName ||
                                                getDepartmentName(
                                                    course.departmentId
                                                )
                                            }
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={
                                                    course.status
                                                }
                                            />
                                        </td>

                                        <td>
                                            <ActionButtons
                                                onEdit={() =>
                                                    openEditCourse(
                                                        course
                                                    )
                                                }
                                                onDelete={() =>
                                                    deleteCourse(
                                                        course
                                                    )
                                                }
                                            />
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // ENROLLMENTS PAGE
    // =========================================================

    function renderEnrollments() {

        return (
            <PageContainer
                eyebrow="COURSE ENROLLMENT"
                title="Enrollments"
                subtitle="Manage student course enrollments."
            >

                <Toolbar
                    searchValue={enrollmentSearchText}
                    onSearchChange={
                        setEnrollmentSearchText
                    }
                    placeholder="Search enrollments..."
                    onAdd={openAddEnrollment}
                    addLabel="Enroll Student"
                />

                <div className="table-wrapper">

                    {filteredEnrollments.length === 0 ? (

                        <EmptyState
                            icon={BookMarked}
                            title="No enrollments found"
                            message="No enrollment records match your search."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Enrollment Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredEnrollments.map(
                                    enrollment => {

                                        const student =
                                            enrollment.student ||
                                            getStudent(
                                                enrollment.studentId
                                            );

                                        const course =
                                            enrollment.course ||
                                            getCourse(
                                                enrollment.courseId
                                            );

                                        return (
                                            <tr
                                                key={
                                                    enrollment.enrollmentId
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        enrollment.enrollmentId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            student?.name ||
                                                            "Unknown"
                                                        }
                                                    </strong>
                                                    <small>
                                                        ID:{" "}
                                                        {
                                                            student?.studentId ||
                                                            enrollment.studentId
                                                        }
                                                    </small>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            course?.courseName ||
                                                            "Unknown"
                                                        }
                                                    </strong>
                                                    <small>
                                                        {
                                                            course?.courseCode ||
                                                            "—"
                                                        }
                                                    </small>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        enrollment.enrollmentDate
                                                    )}
                                                </td>

                                                <td>
                                                    <StatusBadge
                                                        status={
                                                            enrollment.status
                                                        }
                                                    />
                                                </td>

                                                <td>

                                                    {String(
                                                        enrollment.status
                                                    ).toUpperCase() ===
                                                    "ENROLLED" ? (

                                                        <button
                                                            className="icon-btn danger"
                                                            title="Drop enrollment"
                                                            onClick={() =>
                                                                dropEnrollment(
                                                                    enrollment
                                                                )
                                                            }
                                                        >
                                                            <XCircle
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>

                                                    ) : (

                                                        <span>
                                                            —
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // ATTENDANCE PAGE
    // =========================================================
function renderAttendance() {
    const selectedStudent =
        students.find(
            student =>
                String(student.studentId) ===
                String(attendanceStudentId)
        );

    const studentAttendance =
        attendanceStudentId
            ? attendanceRecords.filter(
                  record =>
                      String(
                          getStudentIdFromRecord(record)
                      ) ===
                      String(attendanceStudentId)
              )
            : [];

    /* ========================= */
    /* OVERALL ATTENDANCE */
    /* ========================= */

    const totalClasses =
        studentAttendance.length;

    const presentCount =
        studentAttendance.filter(
            record =>
                record.present === true
        ).length;

    const absentCount =
        studentAttendance.filter(
            record =>
                record.present === false
        ).length;

    const attendancePercentage =
        totalClasses > 0
            ? (
                  (presentCount /
                      totalClasses) *
                  100
              ).toFixed(1)
            : "0.0";

    /* ========================= */
    /* SUBJECT-WISE SUMMARY */
    /* ========================= */

    const coursesMap = {};

    studentAttendance.forEach(record => {
        const courseId =
            record.course?.courseId ||
            record.courseId;

        const courseName =
            getCourseName(record);

        const courseCode =
            getCourseCode(record);

        const key =
            courseId ||
            `${courseName}-${courseCode}`;

        if (!coursesMap[key]) {
            coursesMap[key] = {
                courseId,
                courseName,
                courseCode,
                total: 0,
                present: 0,
                absent: 0
            };
        }

        coursesMap[key].total++;

        if (record.present === true) {
            coursesMap[key].present++;
        } else {
            coursesMap[key].absent++;
        }
    });

    const subjectAttendance =
        Object.values(coursesMap).map(
            course => {
                const percentage =
                    course.total > 0
                        ? (
                              (course.present /
                                  course.total) *
                              100
                          ).toFixed(1)
                        : "0.0";

                return {
                    ...course,
                    percentage
                };
            }
        );

    /* ========================= */
    /* SEARCH INDIVIDUAL RECORDS */
    /* ========================= */

    const search =
        attendanceSearchText
            .trim()
            .toLowerCase();

    const filteredAttendanceRecords =
        [...studentAttendance]
            .sort((a, b) => {
                const dateA =
                    a.attendanceDate ||
                    a.date ||
                    "";

                const dateB =
                    b.attendanceDate ||
                    b.date ||
                    "";

                return dateB.localeCompare(
                    dateA
                );
            })
            .filter(record => {
                if (!search) {
                    return true;
                }

                const courseName =
                    getCourseName(record) ||
                    "";

                const courseCode =
                    getCourseCode(record) ||
                    "";

                const date =
                    record.attendanceDate ||
                    record.date ||
                    "";

                const status =
                    record.present === true
                        ? "present"
                        : "absent";

                return `${courseName} ${courseCode} ${date} ${status}`
                    .toLowerCase()
                    .includes(search);
            });

    return (
        <PageContainer
            eyebrow="ATTENDANCE MANAGEMENT"
            title="Attendance"
            subtitle="Mark, review and manage individual student attendance records."
        >

            {/* ========================= */}
            {/* TOOLBAR */}
            {/* ========================= */}

            <div className="page-toolbar">

                <div
                    className="form-group"
                    style={{
                        minWidth: "280px"
                    }}
                >
                    <label>
                        Select Student
                    </label>

                    <select
                        value={
                            attendanceStudentId ||
                            ""
                        }
                        onChange={event => {
                            setAttendanceStudentId(
                                event.target.value
                            );

                            setAttendanceSearchText(
                                ""
                            );
                        }}
                    >
                        <option value="">
                            Select an enrolled student
                        </option>

                        {students
                            .filter(
                                student =>
                                    student.status ===
                                    "ACTIVE"
                            )
                            .map(student => (
                                <option
                                    key={
                                        student.studentId
                                    }
                                    value={
                                        student.studentId
                                    }
                                >
                                    {student.name} -
                                    {" "}
                                    ID:{" "}
                                    {
                                        student.studentId
                                    }
                                </option>
                            ))}
                    </select>
                </div>

                {attendanceStudentId && (
                    <div
                        className="search-box"
                        style={{
                            flex: 1,
                            minWidth: "240px"
                        }}
                    >
                        <Search size={18} />

                        <input
                            type="text"
                            value={
                                attendanceSearchText
                            }
                            onChange={event =>
                                setAttendanceSearchText(
                                    event.target.value
                                )
                            }
                            placeholder="Search course, date or status..."
                        />
                    </div>
                )}

                <button
                    className="primary-btn"
                    onClick={openAddAttendance}
                >
                    <Plus size={17} />
                    Mark Attendance
                </button>

            </div>


            {/* ========================= */}
            {/* SELECTED STUDENT */}
            {/* ========================= */}

            {attendanceStudentId && (
                <>

                    {/* ========================= */}
                    {/* SUMMARY CARDS */}
                    {/* ========================= */}

                    <div className="academic-summary-grid">

                        <StatCard
                            icon={CalendarCheck}
                            label="Total Classes"
                            value={
                                totalClasses
                            }
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="Present"
                            value={
                                presentCount
                            }
                        />

                        <StatCard
                            icon={XCircle}
                            label="Absent"
                            value={
                                absentCount
                            }
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="Attendance"
                            value={`${attendancePercentage}%`}
                        />

                    </div>


                    {/* ========================= */}
                    {/* SUBJECT SUMMARY */}
                    {/* ========================= */}

                    <div
                        style={{
                            marginTop: "28px",
                            marginBottom: "12px"
                        }}
                    >
                        <h3>
                            Subject Summary
                        </h3>

                        <p
                            style={{
                                color: "#64748b",
                                marginTop: "4px"
                            }}
                        >
                            Attendance performance by course.
                        </p>
                    </div>

                    <div className="table-wrapper">

                        {academicLoading ? (

                            <LoadingState />

                        ) : subjectAttendance.length === 0 ? (

                            <EmptyState
                                icon={CalendarCheck}
                                title="No attendance records"
                                message={
                                    selectedStudent
                                        ? `No attendance records found for ${selectedStudent.name}.`
                                        : "No attendance records found."
                                }
                            />

                        ) : (

                            <table className="student-table">

                                <thead>
                                    <tr>

                                        <th>
                                            Subject
                                        </th>

                                        <th>
                                            Course Code
                                        </th>

                                        <th>
                                            Total Classes
                                        </th>

                                        <th>
                                            Present
                                        </th>

                                        <th>
                                            Absent
                                        </th>

                                        <th>
                                            Attendance
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {subjectAttendance.map(
                                        course => (

                                            <tr
                                                key={
                                                    course.courseId ||
                                                    course.courseCode
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            course.courseName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        course.courseCode
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        course.total
                                                    }
                                                </td>

                                                <td>
                                                    <span className="academic-status present">

                                                        <CheckCircle2
                                                            size={15}
                                                        />

                                                        {
                                                            course.present
                                                        }

                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="academic-status absent">

                                                        <XCircle
                                                            size={15}
                                                        />

                                                        {
                                                            course.absent
                                                        }

                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            course.percentage
                                                        }%
                                                    </strong>
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>


                    {/* ========================= */}
                    {/* INDIVIDUAL RECORDS */}
                    {/* ========================= */}

                    <div
                        style={{
                            marginTop: "32px",
                            marginBottom: "12px"
                        }}
                    >
                        <h3>
                            Attendance Records
                        </h3>

                        <p
                            style={{
                                color: "#64748b",
                                marginTop: "4px"
                            }}
                        >
                            View and manage each attendance entry.
                        </p>
                    </div>

                    <div className="table-wrapper">

                        {filteredAttendanceRecords.length === 0 ? (

                            <EmptyState
                                icon={CalendarCheck}
                                title="No matching records"
                                message={
                                    search
                                        ? "No attendance records match your search."
                                        : "No individual attendance records found."
                                }
                            />

                        ) : (

                            <table className="student-table">

                                <thead>
                                    <tr>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th>
                                            Course Code
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredAttendanceRecords.map(
                                        (record, index) => {

                                            const attendanceDate =
                                                record.attendanceDate ||
                                                record.date ||
                                                "—";

                                            const courseName =
                                                getCourseName(
                                                    record
                                                ) ||
                                                "—";

                                            const courseCode =
                                                getCourseCode(
                                                    record
                                                ) ||
                                                "—";

                                            const isPresent =
                                                record.present ===
                                                true;

                                            return (
                                                <tr
                                                    key={
                                                        record.attendanceId ||
                                                        `${attendanceDate}-${courseCode}-${index}`
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            attendanceDate
                                                        }
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                courseName
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            courseCode
                                                        }
                                                    </td>

                                                    <td>

                                                        {isPresent ? (

                                                            <span className="academic-status present">

                                                                <CheckCircle2
                                                                    size={15}
                                                                />

                                                                Present

                                                            </span>

                                                        ) : (

                                                            <span className="academic-status absent">

                                                                <XCircle
                                                                    size={15}
                                                                />

                                                                Absent

                                                            </span>

                                                        )}

                                                    </td>

                                                    <td>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "8px"
                                                            }}
                                                        >

                                                            <button
                                                                type="button"
                                                                className="secondary-btn"
                                                                onClick={() =>
                                                                    openEditAttendance(
                                                                        record
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="danger-btn"
                                                                onClick={() =>
                                                                    deleteAttendance(
                                                                        record
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        )}

                    </div>

                </>
            )}


            {/* ========================= */}
            {/* NO STUDENT SELECTED */}
            {/* ========================= */}

            {!attendanceStudentId && (

                <EmptyState
                    icon={CalendarCheck}
                    title="Select a student"
                    message="Choose a student above to view and manage attendance."
                />

            )}

        </PageContainer>
    );
}

    // =========================================================
    // EXAMINATION PAGE
    // =========================================================

    function renderExaminations() {

        return (
            <PageContainer
                eyebrow="EXAMINATION MANAGEMENT"
                title="Examinations"
                subtitle="Create and manage student examinations."
            >

                <div className="page-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            value={
                                examinationSearchText
                            }
                            onChange={event =>
                                setExaminationSearchText(
                                    event.target.value
                                )
                            }
                            placeholder="Search examinations..."
                        />

                    </div>

                    <button
                        className="primary-btn"
                        onClick={openAddExamination}
                    >
                        <Plus size={17} />
                        Create Examination
                    </button>

                </div>

                <div className="academic-summary-grid">

                    <StatCard
                        icon={ClipboardList}
                        label="Total Exams"
                        value={
                            examinations.length
                        }
                    />

                    <StatCard
                        icon={Clock}
                        label="Scheduled"
                        value={
                            examinations.filter(
                                exam =>
                                    String(
                                        exam.status
                                    ).toUpperCase() ===
                                    "SCHEDULED"
                            ).length
                        }
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Completed"
                        value={
                            examinations.filter(
                                exam =>
                                    String(
                                        exam.status
                                    ).toUpperCase() ===
                                    "COMPLETED"
                            ).length
                        }
                    />

                </div>

                <div className="table-wrapper">

                    {academicLoading ? (

                        <LoadingState />

                    ) : filteredExaminations.length === 0 ? (

                        <EmptyState
                            icon={ClipboardList}
                            title="No examinations found"
                            message="Create an examination to start managing academic assessments."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Examination</th>
                                    <th>Course</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredExaminations.map(
                                    exam => {

                                        const course =
                                            exam.course ||
                                            getCourse(
                                                exam.courseId
                                            );

                                        return (
                                            <tr
                                                key={
                                                    exam.examId
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        exam.examId
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            exam.examName
                                                        }
                                                    </strong>
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            course?.courseName ||
                                                            "Unknown"
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            course?.courseCode ||
                                                            "—"
                                                        }
                                                    </small>

                                                </td>

                                                <td>
                                                    {
                                                        exam.examType ||
                                                        "—"
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        exam.examDate
                                                    )}
                                                </td>

                                                <td>
                                                    <StatusBadge
                                                        status={
                                                            exam.status
                                                        }
                                                    />
                                                </td>

                                                <td>

                                                    <ActionButtons
                                                        onEdit={() =>
                                                            openEditExamination(
                                                                exam
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            deleteExamination(
                                                                exam
                                                            )
                                                        }
                                                    />

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // RESULTS PAGE
    // =========================================================

    function renderResults() {

        return (
            <PageContainer
                eyebrow="RESULT MANAGEMENT"
                title="Results & Marks"
                subtitle="Enter and manage student examination results."
            >

                <div className="page-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            type="text"
                            value={
                                resultSearchText
                            }
                            onChange={event =>
                                setResultSearchText(
                                    event.target.value
                                )
                            }
                            placeholder="Search results..."
                        />

                    </div>

                    <button
                        className="primary-btn"
                        onClick={openAddResult}
                    >
                        <Plus size={17} />
                        Add Result
                    </button>

                </div>

                <div className="academic-summary-grid">

                    <StatCard
                        icon={GraduationCap}
                        label="Total Results"
                        value={results.length}
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Passed"
                        value={passedResultsCount}
                    />

                    <StatCard
                        icon={XCircle}
                        label="Failed"
                        value={
                            results.filter(
                                result =>
                                    String(
                                        result.resultStatus
                                    ).toUpperCase() ===
                                    "FAIL"
                            ).length
                        }
                    />

                </div>

                <div className="table-wrapper">

                    {academicLoading ? (

                        <LoadingState />

                    ) : filteredResults.length === 0 ? (

                        <EmptyState
                            icon={GraduationCap}
                            title="No results found"
                            message="Results will appear here after marks are entered."
                        />

                    ) : (

                        <table className="student-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Examination</th>
                                    <th>Course</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredResults.map(
                                    result => {

                                        const exam =
                                            result.examination ||
                                            getExamination(
                                                result.examId
                                            );

                                        const course =
                                            exam?.course ||
                                            getCourse(
                                                exam?.courseId
                                            );

                                        return (
                                            <tr
                                                key={
                                                    result.resultId
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        result.resultId
                                                    }
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            getStudentName(
                                                                result
                                                            )
                                                        }
                                                    </strong>

                                                    <small>
                                                        ID:{" "}
                                                        {
                                                            getStudentIdFromRecord(
                                                                result
                                                            )
                                                        }
                                                    </small>

                                                </td>

                                                <td>
                                                    {
                                                        exam?.examName ||
                                                        "Unknown"
                                                    }
                                                </td>

                                                <td>

                                                    <strong>
                                                        {
                                                            course?.courseName ||
                                                            "Unknown"
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            course?.courseCode ||
                                                            "—"
                                                        }
                                                    </small>

                                                </td>

                                                <td>

                                                    <span className="marks-value">
                                                        {
                                                            result.marks
                                                        }
                                                        /50
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="grade-badge">
                                                        {
                                                            result.grade ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    {String(
                                                        result.resultStatus
                                                    ).toUpperCase() ===
                                                    "PASS" ? (

                                                        <span className="academic-status present">
                                                            <CheckCircle2
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                            PASS
                                                        </span>

                                                    ) : (

                                                        <span className="academic-status absent">
                                                            <XCircle
                                                                size={
                                                                    15
                                                                }
                                                            />
                                                            FAIL
                                                        </span>

                                                    )}

                                                </td>

                                                <td>

                                                    <ActionButtons
                                                        onEdit={() =>
                                                            openEditResult(
                                                                result
                                                            )
                                                        }
                                                        onDelete={() =>
                                                            deleteResult(
                                                                result
                                                            )
                                                        }
                                                    />

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // COMING SOON
    // =========================================================

    function renderComingSoon(
        title,
        subtitle,
        Icon
    ) {

        return (
            <PageContainer
                eyebrow="SIMS MODULE"
                title={title}
                subtitle={subtitle}
            >

                <div className="coming-soon-card">

                    <div className="coming-soon-icon">
                        <Icon size={40} />
                    </div>

                    <h2>{title}</h2>

                    <p>
                        This module is being prepared for
                        the Student Information Management
                        System.
                    </p>

                </div>

            </PageContainer>
        );
    }

    // =========================================================
    // PAGE ROUTER
    // =========================================================

    function renderPage() {

        switch (activePage) {

            case "dashboard":
                return renderDashboard();

            case "students":
                return renderStudents();

            case "departments":
                return renderDepartments();

            case "courses":
                return renderCourses();

            case "enrollments":
                return renderEnrollments();

            case "attendance":
                return renderAttendance();

            case "examinations":
                return renderExaminations();

            case "results":
                return renderResults();

            default:
                return renderDashboard();
        }
    }

    // =========================================================
    // MAIN RETURN
    // =========================================================

    return (

        <div className="admin-layout">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">

                <div className="admin-brand">

                    <div className="brand-logo">
                        S
                    </div>

                    <div>
                        <strong>SIMS</strong>
                        <span>
                            Student Management
                        </span>
                    </div>

                </div>

                <div className="sidebar-divider" />

                <div className="admin-user">

                    <div className="admin-avatar">
                        <ShieldCheck size={20} />
                    </div>

                    <div>

                        <strong>
                            Administrator
                        </strong>

                        <span>
                            System Admin
                        </span>

                    </div>

                </div>

                <nav className="admin-nav">

                    <div className="nav-section-title">
                        MAIN
                    </div>

                    <NavButton
                        active={
                            activePage === "dashboard"
                        }
                        icon={LayoutDashboard}
                        label="Dashboard"
                        onClick={() =>
                            changeSection(
                                "dashboard"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "students"
                        }
                        icon={Users}
                        label="Students"
                        onClick={() =>
                            changeSection(
                                "students"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "departments"
                        }
                        icon={Building2}
                        label="Departments"
                        onClick={() =>
                            changeSection(
                                "departments"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "courses"
                        }
                        icon={BookOpen}
                        label="Courses"
                        onClick={() =>
                            changeSection(
                                "courses"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "enrollments"
                        }
                        icon={BookMarked}
                        label="Enrollments"
                        onClick={() =>
                            changeSection(
                                "enrollments"
                            )
                        }
                    />

                    <div className="nav-section-title">
                        ACADEMICS
                    </div>

                    <NavButton
                        active={
                            activePage === "attendance"
                        }
                        icon={CalendarCheck}
                        label="Attendance"
                        onClick={() =>
                            changeSection(
                                "attendance"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "examinations"
                        }
                        icon={ClipboardList}
                        label="Examinations"
                        onClick={() =>
                            changeSection(
                                "examinations"
                            )
                        }
                    />

                    <NavButton
                        active={
                            activePage === "results"
                        }
                        icon={GraduationCap}
                        label="Results & Marks"
                        onClick={() =>
                            changeSection(
                                "results"
                            )
                        }
                    />

                </nav>

                <div className="sidebar-footer">

                    <div className="security-note">

                        <ShieldCheck size={16} />

                        <span>
                            JWT Secured
                        </span>

                    </div>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        <LogOut size={17} />
                        Logout
                    </button>

                </div>

            </aside>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-main">

                {message && (

                    <div className="global-message success">

                        <CheckCircle2 size={18} />

                        <span>
                            {message}
                        </span>

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}

                {error && (

                    <div className="global-message error">

                        <AlertCircle size={18} />

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}

                {renderPage()}

            </main>

            {/* =================================================
                STUDENT MODAL
            ================================================= */}

            {showStudentForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveStudent}
                    >

                        <ModalHeader
                            title={
                                editingStudent
                                    ? "Edit Student"
                                    : "Add Student"
                            }
                            subtitle={
                                editingStudent
                                    ? "Update student information."
                                    : "Create a new student record."
                            }
                            onClose={() =>
                                setShowStudentForm(false)
                            }
                        />

                        <div className="student-form">

                            <div className="form-row">

                                <FormInput
                                    label="Student Name"
                                    value={
                                        studentForm.name
                                    }
                                    onChange={event =>
                                        setStudentForm({
                                            ...studentForm,
                                            name:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="Enter student name"
                                    required
                                />

                                <FormInput
                                    label="Email"
                                    type="email"
                                    value={
                                        studentForm.email
                                    }
                                    onChange={event =>
                                        setStudentForm({
                                            ...studentForm,
                                            email:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="student@example.com"
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <FormInput
                                    label="Phone"
                                    value={
                                        studentForm.phone
                                    }
                                    onChange={event =>
                                        setStudentForm({
                                            ...studentForm,
                                            phone:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="10 digit phone number"
                                    required
                                />

                                <FormSelect
                                    label="Department"
                                    value={
                                        studentForm.departmentId
                                    }
                                    onChange={event =>
                                        setStudentForm({
                                            ...studentForm,
                                            departmentId:
                                                event.target
                                                    .value
                                        })
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label:
                                                "Select Department"
                                        },
                                        ...departments.map(
                                            department => ({
                                                value:
                                                    department.departmentId,
                                                label:
                                                    `${department.departmentName} (${department.departmentCode})`
                                            })
                                        )
                                    ]}
                                    required
                                />

                            </div>

                            <FormSelect
                                label="Status"
                                value={
                                    studentForm.status
                                }
                                onChange={event =>
                                    setStudentForm({
                                        ...studentForm,
                                        status:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "ACTIVE",
                                        label: "Active"
                                    },
                                    {
                                        value: "INACTIVE",
                                        label: "Inactive"
                                    }
                                ]}
                            />

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowStudentForm(false)
                            }
                            submitLabel={
                                editingStudent
                                    ? "Update Student"
                                    : "Add Student"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                DEPARTMENT MODAL
            ================================================= */}

            {showDepartmentForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveDepartment}
                    >

                        <ModalHeader
                            title={
                                editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"
                            }
                            subtitle="Manage department information."
                            onClose={() =>
                                setShowDepartmentForm(false)
                            }
                        />

                        <div className="student-form">

                            <FormInput
                                label="Department Name"
                                value={
                                    departmentForm.departmentName
                                }
                                onChange={event =>
                                    setDepartmentForm({
                                        ...departmentForm,
                                        departmentName:
                                            event.target
                                                .value
                                    })
                                }
                                placeholder="Computer Science and Engineering"
                                required
                            />

                            <FormInput
                                label="Department Code"
                                value={
                                    departmentForm.departmentCode
                                }
                                onChange={event =>
                                    setDepartmentForm({
                                        ...departmentForm,
                                        departmentCode:
                                            event.target
                                                .value
                                    })
                                }
                                placeholder="CSE"
                                required
                            />

                            <FormSelect
                                label="Status"
                                value={
                                    departmentForm.status
                                }
                                onChange={event =>
                                    setDepartmentForm({
                                        ...departmentForm,
                                        status:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "ACTIVE",
                                        label: "Active"
                                    },
                                    {
                                        value: "INACTIVE",
                                        label: "Inactive"
                                    }
                                ]}
                            />

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowDepartmentForm(
                                    false
                                )
                            }
                            submitLabel={
                                editingDepartment
                                    ? "Update Department"
                                    : "Add Department"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                COURSE MODAL
            ================================================= */}

            {showCourseForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveCourse}
                    >

                        <ModalHeader
                            title={
                                editingCourse
                                    ? "Edit Course"
                                    : "Add Course"
                            }
                            subtitle="Manage course details and department assignment."
                            onClose={() =>
                                setShowCourseForm(false)
                            }
                        />

                        <div className="student-form">

                            <div className="form-row">

                                <FormInput
                                    label="Course Name"
                                    value={
                                        courseForm.courseName
                                    }
                                    onChange={event =>
                                        setCourseForm({
                                            ...courseForm,
                                            courseName:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="Data Structures"
                                    required
                                />

                                <FormInput
                                    label="Course Code"
                                    value={
                                        courseForm.courseCode
                                    }
                                    onChange={event =>
                                        setCourseForm({
                                            ...courseForm,
                                            courseCode:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="CSE201"
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <FormInput
                                    label="Credits"
                                    type="number"
                                    min="1"
                                    value={
                                        courseForm.credits
                                    }
                                    onChange={event =>
                                        setCourseForm({
                                            ...courseForm,
                                            credits:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="4"
                                    required
                                />

                                <FormSelect
                                    label="Department"
                                    value={
                                        courseForm.departmentId
                                    }
                                    onChange={event =>
                                        setCourseForm({
                                            ...courseForm,
                                            departmentId:
                                                event.target
                                                    .value
                                        })
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label:
                                                "Select Department"
                                        },
                                        ...departments.map(
                                            department => ({
                                                value:
                                                    department.departmentId,
                                                label:
                                                    `${department.departmentName} (${department.departmentCode})`
                                            })
                                        )
                                    ]}
                                    required
                                />

                            </div>

                            <FormSelect
                                label="Status"
                                value={
                                    courseForm.status
                                }
                                onChange={event =>
                                    setCourseForm({
                                        ...courseForm,
                                        status:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "ACTIVE",
                                        label: "Active"
                                    },
                                    {
                                        value: "INACTIVE",
                                        label: "Inactive"
                                    }
                                ]}
                            />

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowCourseForm(false)
                            }
                            submitLabel={
                                editingCourse
                                    ? "Update Course"
                                    : "Add Course"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                ENROLLMENT MODAL
            ================================================= */}

            {showEnrollmentForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveEnrollment}
                    >

                        <ModalHeader
                            title="Enroll Student"
                            subtitle="Assign a student to a course."
                            onClose={() =>
                                setShowEnrollmentForm(
                                    false
                                )
                            }
                        />

                        <div className="student-form">

                            <FormSelect
                                label="Student"
                                value={
                                    enrollmentForm.studentId
                                }
                                onChange={event =>
                                    setEnrollmentForm({
                                        ...enrollmentForm,
                                        studentId:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "",
                                        label:
                                            "Select Student"
                                    },
                                    ...students
                                        .filter(
                                            student =>
                                                String(
                                                    student.status
                                                ).toUpperCase() ===
                                                "ACTIVE"
                                        )
                                        .map(student => ({
                                            value:
                                                student.studentId,
                                            label:
                                                `${student.name} (#${student.studentId})`
                                        }))
                                ]}
                                required
                            />

                            <FormSelect
                                label="Course"
                                value={
                                    enrollmentForm.courseId
                                }
                                onChange={event =>
                                    setEnrollmentForm({
                                        ...enrollmentForm,
                                        courseId:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "",
                                        label:
                                            "Select Course"
                                    },
                                    ...courses
                                        .filter(
                                            course =>
                                                String(
                                                    course.status
                                                ).toUpperCase() ===
                                                "ACTIVE"
                                        )
                                        .map(course => ({
                                            value:
                                                course.courseId,
                                            label:
                                                `${course.courseName} (${course.courseCode})`
                                        }))
                                ]}
                                required
                            />

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowEnrollmentForm(
                                    false
                                )
                            }
                            submitLabel="Enroll Student"
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                ATTENDANCE MODAL
            ================================================= */}

            {showAttendanceForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveAttendance}
                    >

                        <ModalHeader
                            title={
                                editingAttendance
                                    ? "Edit Attendance"
                                    : "Mark Attendance"
                            }
                            subtitle={
                                editingAttendance
                                    ? "Update the attendance record."
                                    : "Attendance can only be marked for active enrollments."
                            }
                            onClose={() =>
                                setShowAttendanceForm(
                                    false
                                )
                            }
                        />

                        <div className="student-form">

                            {!editingAttendance && (

                                <>

                                    <FormSelect
                                        label="Student"
                                        value={
                                            attendanceForm.studentId
                                        }
                                        onChange={event =>
                                            setAttendanceForm({
                                                ...attendanceForm,
                                                studentId:
                                                    event
                                                        .target
                                                        .value,
                                                courseId:
                                                    ""
                                            })
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label:
                                                    "Select Student"
                                            },
                                            ...students
                                                .filter(
                                                    student =>
                                                        String(
                                                            student.status
                                                        ).toUpperCase() ===
                                                        "ACTIVE"
                                                )
                                                .map(
                                                    student => ({
                                                        value:
                                                            student.studentId,
                                                        label:
                                                            `${student.name} (#${student.studentId})`
                                                    })
                                                )
                                        ]}
                                        required
                                    />

                                    <FormSelect
                                        label="Course"
                                        value={
                                            attendanceForm.courseId
                                        }
                                        onChange={event =>
                                            setAttendanceForm({
                                                ...attendanceForm,
                                                courseId:
                                                    event
                                                        .target
                                                        .value
                                            })
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label:
                                                    attendanceForm.studentId
                                                        ? "Select Enrolled Course"
                                                        : "Select Student First"
                                            },
                                            ...attendanceAvailableCourses
                                                .filter(
                                                    course =>
                                                        String(
                                                            course.status
                                                        ).toUpperCase() ===
                                                        "ACTIVE"
                                                )
                                                .map(
                                                    course => ({
                                                        value:
                                                            course.courseId,
                                                        label:
                                                            `${course.courseName} (${course.courseCode})`
                                                    })
                                                )
                                        ]}
                                        required
                                    />

                                </>

                            )}

                            {editingAttendance && (

                                <div className="locked-selection">

                                    <strong>
                                        Student
                                    </strong>

                                    <span>
                                        {
                                            getStudentName(
                                                editingAttendance
                                            )
                                        }{" "}
                                        (#
                                        {
                                            getStudentIdFromRecord(
                                                editingAttendance
                                            )
                                        }
                                        )
                                    </span>

                                    <strong>
                                        Course
                                    </strong>

                                    <span>
                                        {
                                            getCourseName(
                                                editingAttendance
                                            )
                                        }{" "}
                                        (
                                        {
                                            getCourseCode(
                                                editingAttendance
                                            )
                                        }
                                        )
                                    </span>

                                </div>

                            )}

                            <div className="form-row">

                                <FormInput
                                    label="Attendance Date"
                                    type="date"
                                    value={
                                        attendanceForm.attendanceDate
                                    }
                                    onChange={event =>
                                        setAttendanceForm({
                                            ...attendanceForm,
                                            attendanceDate:
                                                event.target
                                                    .value
                                        })
                                    }
                                    required
                                />

                                <FormSelect
                                    label="Attendance"
                                    value={
                                        attendanceForm.present
                                    }
                                    onChange={event =>
                                        setAttendanceForm({
                                            ...attendanceForm,
                                            present:
                                                event.target
                                                    .value
                                        })
                                    }
                                    options={[
                                        {
                                            value: "true",
                                            label: "Present"
                                        },
                                        {
                                            value: "false",
                                            label: "Absent"
                                        }
                                    ]}
                                />

                            </div>

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowAttendanceForm(
                                    false
                                )
                            }
                            submitLabel={
                                editingAttendance
                                    ? "Update Attendance"
                                    : "Mark Attendance"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                EXAMINATION MODAL
            ================================================= */}

            {showExaminationForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveExamination}
                    >

                        <ModalHeader
                            title={
                                editingExamination
                                    ? "Edit Examination"
                                    : "Create Examination"
                            }
                            subtitle="Create an academic examination for an active course."
                            onClose={() =>
                                setShowExaminationForm(
                                    false
                                )
                            }
                        />

                        <div className="student-form">

                            <FormSelect
                                label="Course"
                                value={
                                    examinationForm.courseId
                                }
                                onChange={event =>
                                    setExaminationForm({
                                        ...examinationForm,
                                        courseId:
                                            event.target
                                                .value
                                    })
                                }
                                options={[
                                    {
                                        value: "",
                                        label:
                                            "Select Active Course"
                                    },
                                    ...courses
                                        .filter(
                                            course =>
                                                String(
                                                    course.status
                                                ).toUpperCase() ===
                                                "ACTIVE"
                                        )
                                        .map(course => ({
                                            value:
                                                course.courseId,
                                            label:
                                                `${course.courseName} (${course.courseCode})`
                                        }))
                                ]}
                                required
                            />

                            <div className="form-row">

                                <FormInput
                                    label="Exam Name"
                                    value={
                                        examinationForm.examName
                                    }
                                    onChange={event =>
                                        setExaminationForm({
                                            ...examinationForm,
                                            examName:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="Midterm Examination"
                                    required
                                />

                                <FormInput
                                    label="Exam Type"
                                    value={
                                        examinationForm.examType
                                    }
                                    onChange={event =>
                                        setExaminationForm({
                                            ...examinationForm,
                                            examType:
                                                event.target
                                                    .value
                                        })
                                    }
                                    placeholder="Midterm"
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <FormInput
    label="Exam Date"
    type="date"
    min={
        new Date(
            Date.now() + 24 * 60 * 60 * 1000
        )
            .toISOString()
            .split("T")[0]
    }
    value={
        examinationForm.examDate
    }
    onChange={event =>
        setExaminationForm({
            ...examinationForm,
            examDate:
                event.target.value
        })
    }
    required
/>

                                <FormSelect
                                    label="Status"
                                    value={
                                        examinationForm.status
                                    }
                                    onChange={event =>
                                        setExaminationForm({
                                            ...examinationForm,
                                            status:
                                                event.target
                                                    .value
                                        })
                                    }
                                    options={[
                                        {
                                            value:
                                                "SCHEDULED",
                                            label:
                                                "Scheduled"
                                        },
                                        {
                                            value:
                                                "COMPLETED",
                                            label:
                                                "Completed"
                                        },
                                        {
                                            value:
                                                "CANCELLED",
                                            label:
                                                "Cancelled"
                                        }
                                    ]}
                                />

                            </div>

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowExaminationForm(
                                    false
                                )
                            }
                            submitLabel={
                                editingExamination
                                    ? "Update Examination"
                                    : "Create Examination"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

            {/* =================================================
                RESULT MODAL
            ================================================= */}

            {showResultForm && (

                <ModalOverlay>

                    <form
                        className="student-modal"
                        onSubmit={saveResult}
                    >

                        <ModalHeader
                            title={
                                editingResult
                                    ? "Edit Result"
                                    : "Add Result"
                            }
                            subtitle="Enter marks. Grade and pass/fail status are calculated by the backend."
                            onClose={() =>
                                setShowResultForm(
                                    false
                                )
                            }
                        />

                        <div className="student-form">

                            {!editingResult && (

                                <>

                                    <FormSelect
                                        label="Student"
                                        value={
                                            resultForm.studentId
                                        }
                                        onChange={event =>
                                            setResultForm({
                                                ...resultForm,
                                                studentId:
                                                    event
                                                        .target
                                                        .value,
                                                examId:
                                                    ""
                                            })
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label:
                                                    "Select Student"
                                            },
                                            ...students
                                                .filter(
                                                    student =>
                                                        String(
                                                            student.status
                                                        ).toUpperCase() ===
                                                        "ACTIVE"
                                                )
                                                .map(
                                                    student => ({
                                                        value:
                                                            student.studentId,
                                                        label:
                                                            `${student.name} (#${student.studentId})`
                                                    })
                                                )
                                        ]}
                                        required
                                    />

                                    <FormSelect
                                        label="Examination"
                                        value={
                                            resultForm.examId
                                        }
                                        onChange={event =>
                                            setResultForm({
                                                ...resultForm,
                                                examId:
                                                    event
                                                        .target
                                                        .value
                                            })
                                        }
                                        options={[
                                            {
                                                value: "",
                                                label:
                                                    resultForm.studentId
                                                        ? "Select Examination"
                                                        : "Select Student First"
                                            },
                                            ...resultAvailableExaminations.map(
                                                exam => {

                                                    const course =
                                                        exam.course ||
                                                        getCourse(
                                                            exam.courseId
                                                        );

                                                    return {
                                                        value:
                                                            exam.examId,
                                                        label:
                                                            `${exam.examName} — ${course?.courseCode || "Course"}`
                                                    };
                                                }
                                            )
                                        ]}
                                        required
                                    />

                                </>

                            )}

                            {editingResult && (

                                <div className="locked-selection">

                                    <strong>
                                        Student
                                    </strong>

                                    <span>
                                        {
                                            getStudentName(
                                                editingResult
                                            )
                                        }{" "}
                                        (#
                                        {
                                            getStudentIdFromRecord(
                                                editingResult
                                            )
                                        }
                                        )
                                    </span>

                                    <strong>
                                        Examination
                                    </strong>

                                    <span>
                                        {
                                            getExamName(
                                                editingResult
                                            )
                                        }
                                    </span>

                                </div>

                            )}

                            <FormInput
                                label="Marks"
                                type="number"
                                min="0"
                                max="50"
                                step="1"
                                value={
                                    resultForm.marks
                                }
                                onChange={event =>
                                    setResultForm({
                                        ...resultForm,
                                        marks:
                                            event.target
                                                .value
                                    })
                                }
                                placeholder="Enter marks out of 50"
                                required
                            />

                            <div className="result-info-box">

                                <GraduationCap size={18} />

                                <span>
                                    Grade and PASS/FAIL
                                    status will be
                                    automatically
                                    calculated from the
                                    marks.
                                </span>

                            </div>

                        </div>

                        <ModalActions
                            onCancel={() =>
                                setShowResultForm(
                                    false
                                )
                            }
                            submitLabel={
                                editingResult
                                    ? "Update Result"
                                    : "Add Result"
                            }
                        />

                    </form>

                </ModalOverlay>

            )}

        </div>
    );
}


// =============================================================
// REUSABLE COMPONENTS
// =============================================================

function PageContainer({
    eyebrow,
    title,
    subtitle,
    children
}) {

    return (

        <div className="admin-content">

            <div className="page-heading">

                <div>

                    <div className="page-eyebrow">
                        {eyebrow}
                    </div>

                    <h1>
                        {title}
                    </h1>

                    <p>
                        {subtitle}
                    </p>

                </div>

            </div>

            {children}

        </div>
    );
}


// =============================================================

function StatCard({
    icon: Icon,
    label,
    value
}) {

    return (

        <div className="stat-card">

            <div className="stat-icon">
                <Icon size={21} />
            </div>

            <div className="stat-content">

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
}


// =============================================================

function QuickAction({
    icon: Icon,
    label,
    onClick
}) {

    return (

        <button
            className="quick-action"
            onClick={onClick}
        >

            <div className="quick-action-icon">
                <Icon size={19} />
            </div>

            <span>
                {label}
            </span>

            <ChevronRight size={17} />

        </button>
    );
}


// =============================================================

function OverviewRow({
    icon: Icon,
    label,
    value
}) {

    return (

        <div className="overview-row">

            <div className="overview-left">

                <div className="overview-icon">
                    <Icon size={17} />
                </div>

                <span>
                    {label}
                </span>

            </div>

            <strong>
                {value}
            </strong>

        </div>
    );
}


// =============================================================

function NavButton({
    active,
    icon: Icon,
    label,
    onClick
}) {

    return (

        <button
            className={
                `nav-item ${active ? "active" : ""}`
            }
            onClick={onClick}
        >

            <Icon size={18} />

            <span>
                {label}
            </span>

            {active && (
                <ChevronRight
                    size={16}
                    className="nav-arrow"
                />
            )}

        </button>
    );
}


// =============================================================

function Toolbar({
    searchValue,
    onSearchChange,
    placeholder,
    onAdd,
    addLabel
}) {

    return (

        <div className="page-toolbar">

            <div className="search-box">

                <Search size={18} />

                <input
                    type="text"
                    value={searchValue}
                    onChange={event =>
                        onSearchChange(
                            event.target.value
                        )
                    }
                    placeholder={placeholder}
                />

            </div>

            <button
                className="primary-btn"
                onClick={onAdd}
            >
                <Plus size={17} />
                {addLabel}
            </button>

        </div>
    );
}


// =============================================================

function EmptyState({
    icon: Icon,
    title,
    message
}) {

    return (

        <div className="empty-state">

            <div className="empty-state-icon">
                <Icon size={28} />
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {message}
            </p>

        </div>
    );
}


// =============================================================

function LoadingState() {

    return (

        <div className="empty-state">

            <RefreshCw
                size={30}
                className="loading-spin"
            />

            <h3>
                Loading...
            </h3>

            <p>
                Please wait while the data is loaded.
            </p>

        </div>
    );
}


// =============================================================

function StatusBadge({
    status
}) {

    const normalized =
        String(status || "")
            .toUpperCase();

    let className = "status-badge";

    if (
        normalized === "ACTIVE" ||
        normalized === "ENROLLED" ||
        normalized === "COMPLETED" ||
        normalized === "PASS"
    ) {
        className += " active";
    }

    if (
        normalized === "INACTIVE" ||
        normalized === "DROPPED" ||
        normalized === "CANCELLED" ||
        normalized === "FAIL"
    ) {
        className += " inactive";
    }

    if (
        normalized === "SCHEDULED"
    ) {
        className += " scheduled";
    }

    return (

        <span className={className}>
            {status || "—"}
        </span>
    );
}


// =============================================================

function ActionButtons({
    onEdit,
    onDelete
}) {

    return (

        <div className="action-buttons">

            <button
                className="icon-btn"
                title="Edit"
                onClick={onEdit}
            >
                <Edit size={16} />
            </button>

            <button
                className="icon-btn danger"
                title="Delete"
                onClick={onDelete}
            >
                <Trash2 size={16} />
            </button>

        </div>
    );
}


// =============================================================

function ModalOverlay({
    children
}) {

    return (

        <div className="modal-overlay">
            {children}
        </div>
    );
}


// =============================================================

function ModalHeader({
    title,
    subtitle,
    onClose
}) {

    return (

        <div className="modal-header">

            <div>

                <h2>
                    {title}
                </h2>

                <p>
                    {subtitle}
                </p>

            </div>

            <button
                type="button"
                className="modal-close"
                onClick={onClose}
            >
                <X size={19} />
            </button>

        </div>
    );
}


// =============================================================

function FormInput({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    min,
    max,
    step
}) {

    return (

        <div className="form-group">

            <label>
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
            />

        </div>
    );
}


// =============================================================

function FormSelect({
    label,
    value,
    onChange,
    options,
    required = false
}) {

    return (

        <div className="form-group">

            <label>
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                required={required}
            >

                {options.map(
                    (option, index) => (

                        <option
                            key={
                                `${option.value}-${index}`
                            }
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    )
                )}

            </select>

        </div>
    );
}


// =============================================================

function ModalActions({
    onCancel,
    submitLabel
}) {

    return (

        <div className="modal-actions">

            <button
                type="button"
                className="secondary-btn"
                onClick={onCancel}
            >
                Cancel
            </button>

            <button
                type="submit"
                className="primary-btn"
            >
                <Save size={17} />
                {submitLabel}
            </button>

        </div>
    );
}