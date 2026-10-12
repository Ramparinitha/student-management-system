import {
    User,
    BookOpen,
    CalendarCheck,
    FileText,
    BarChart3,
    LogOut,
    GraduationCap,
    ClipboardList,
    Search,
    RefreshCw,
    CheckCircle,
    XCircle,
    Award,
    ChevronRight,
    Clock,
    TrendingUp
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function StudentDashboard() {

    const navigate = useNavigate();

    const name =
        localStorage.getItem("name") ||
        "Student";

    const email =
        localStorage.getItem("email") ||
        "";

    const [activeSection, setActiveSection] =
        useState("dashboard");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [dashboard, setDashboard] =
        useState(null);

    const [profile, setProfile] =
        useState(null);

    const [courses, setCourses] =
        useState([]);

    const [enrollments, setEnrollments] =
        useState([]);

    const [searchText, setSearchText] =
        useState("");

    const [studentId, setStudentId] =
        useState(null);


    useEffect(() => {
        loadStudentData(true);
    }, []);


    /* ========================= */
    /* CHANGE SECTION */
    /* ========================= */

    function changeSection(section) {

        setActiveSection(section);
        setError("");
        setSuccess("");
    }


    /* ========================= */
    /* LOAD PROFILE */
    /* ========================= */

    async function loadProfile() {

        try {

            const profileData =
                await apiRequest(
                    "/student-profile/me"
                );

            setProfile(profileData);

            const detectedStudentId =
                profileData?.studentId;

            if (detectedStudentId) {
                setStudentId(detectedStudentId);
            }

            return true;

        } catch (err) {

            console.error(
                "Profile loading failed:",
                err
            );

            setProfile(null);

            return false;
        }
    }


    /* ========================= */
    /* LOAD DASHBOARD */
    /* ========================= */

    async function loadDashboard() {

        try {

            const dashboardData =
                await apiRequest(
                    "/student-profile/me/dashboard"
                );

            setDashboard(
                dashboardData
            );

            return true;

        } catch (err) {

            console.error(
                "Dashboard loading failed:",
                err
            );

        

            setDashboard(null);

            return false;
        }
    }


    /* ========================= */
    /* LOAD COURSES */
    /* ========================= */

    async function loadCourses() {

        try {

            const courseData =
                await apiRequest(
                    "/courses/status/ACTIVE"
                );

            setCourses(
                Array.isArray(courseData)
                    ? courseData
                    : []
            );

        } catch (err) {

            console.error(
                "Course loading failed:",
                err
            );

            setCourses([]);
        }
    }


    /* ========================= */
    /* LOAD ENROLLMENTS */
    /* ========================= */

    async function loadEnrollments() {

        try {

            const enrollmentData =
                await apiRequest(
                    "/enrollments"
                );

            setEnrollments(
                Array.isArray(enrollmentData)
                    ? enrollmentData
                    : []
            );

        } catch (err) {

            console.error(
                "Enrollment loading failed:",
                err
            );

            setEnrollments([]);
        }
    }


    /* ========================= */
    /* LOAD STUDENT DATA */
    /* ========================= */

    async function loadStudentData(
        initialLoad = false
    ) {

        if (initialLoad) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setError("");
        setSuccess("");

        const profileLoaded =
            await loadProfile();

        const dashboardLoaded =
            await loadDashboard();

        await Promise.all([
            loadCourses(),
            loadEnrollments()
        ]);


        if (
            !profileLoaded &&
            !dashboardLoaded
        ) {

            setError(
                "Unable to load student information. Please try again."
            );
        }


        if (initialLoad) {
            setLoading(false);
        } else {
            setRefreshing(false);
        }
    }


    /* ========================= */
    /* REFRESH */
    /* ========================= */

    async function refreshData() {

        await loadStudentData(false);

        setSuccess(
            "Student information refreshed successfully."
        );
    }


    /* ========================= */
    /* ENROLL COURSE */
    /* ========================= */

    async function enrollInCourse(courseId) {

        if (!studentId) {

            setError(
                "Student profile is not linked correctly. Please contact the administrator."
            );

            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await apiRequest(
                `/enrollments?studentId=${studentId}&courseId=${courseId}`,
                "POST"
            );

            await loadEnrollments();
            await loadDashboard();

            setSuccess(
                "Course enrolled successfully."
            );

        } catch (err) {

            console.error(
                "Course enrollment failed:",
                err
            );

            setError(
                err.message ||
                "Unable to enroll in the course."
            );

        } finally {

            setActionLoading(false);
        }
    }


    /* ========================= */
    /* DROP COURSE */
    /* ========================= */

    async function dropCourse(
        enrollmentId
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to drop this course?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccess("");

            await apiRequest(
                `/enrollments/${enrollmentId}/drop`,
                "PUT"
            );

            await loadEnrollments();
            await loadDashboard();

            setSuccess(
                "Course dropped successfully."
            );

        } catch (err) {

            console.error(
                "Course drop failed:",
                err
            );

            setError(
                err.message ||
                "Unable to drop the course."
            );

        } finally {

            setActionLoading(false);
        }
    }


    /* ========================= */
    /* LOGOUT */
    /* ========================= */

    function logout() {

        localStorage.clear();

        navigate("/login", {
            replace: true
        });
    }


    /* ========================= */
    /* ENROLLMENT DATA */
    /* ========================= */


    /* ========================= */
    /* DASHBOARD DATA */
    /* ========================= */

    const attendancePercentage =
        Number(
            dashboard?.attendancePercentage ??
            0
        );


    const attendanceRecords =
        dashboard?.attendance ||
        dashboard?.attendanceRecords ||
        dashboard?.attendances ||
        [];


    const exams =
        dashboard?.exams ||
        dashboard?.examinations ||
        [];
        /* ========================= */
/* DATA HELPERS */
/* ========================= */

function getEnrollmentCourse(enrollment) {

    if (enrollment?.course) {
        return enrollment.course;
    }

    const courseId =
        enrollment?.courseId;

    if (!courseId) {
        return null;
    }

    return courses.find(
        course =>
            Number(course.courseId) ===
            Number(courseId)
    ) || null;
}


function getExamCourse(exam) {

    if (exam?.course) {
        return exam.course;
    }

    const courseId =
        exam?.courseId;

    if (!courseId) {
        return null;
    }

    return courses.find(
        course =>
            Number(course.courseId) ===
            Number(courseId)
    ) || null;
}


function getResultExam(result) {

    if (result?.examination) {
        return result.examination;
    }

    const examId =
        result?.examId;

    if (!examId) {
        return null;
    }

    return exams.find(
        exam =>
            Number(
                exam.examId ??
                exam.examinationId
            ) === Number(examId)
    ) || null;
}


/* ========================= */
/* ENROLLMENT DATA */
/* ========================= */

const enrolledCourseIds =
    enrollments
        .filter(
            enrollment =>
                String(
                    enrollment.status || ""
                ).toUpperCase() === "ENROLLED"
        )
        .map(enrollment => {

            const course =
                getEnrollmentCourse(enrollment);

            return course?.courseId;
        })
        .filter(Boolean);


const availableCourses =
    courses.filter(course => {

        const search =
            searchText
                .trim()
                .toLowerCase();

        const matchesSearch =
            !search ||
            course.courseName
                ?.toLowerCase()
                .includes(search) ||
            course.courseCode
                ?.toLowerCase()
                .includes(search);

        const alreadyEnrolled =
            enrolledCourseIds.some(
                id =>
                    Number(id) ===
                    Number(course.courseId)
            );

        return (
            matchesSearch &&
            !alreadyEnrolled
        );
    });


const activeEnrollments =
    enrollments.filter(
        enrollment =>
            String(
                enrollment.status || ""
            ).toUpperCase() === "ENROLLED"
    );


    const results =
        dashboard?.results ||
        [];


    const upcomingExams =
        Array.isArray(exams)
            ? exams.length
            : 0;


    /* ========================= */
    /* SAFE RESULT DATA */
    /* ========================= */

    const safeResults =
        Array.isArray(results)
            ? results.filter(
                result =>
                    result !== null &&
                    result !== undefined
            )
            : [];


    const safeExams =
        Array.isArray(exams)
            ? exams.filter(
                exam =>
                    exam !== null &&
                    exam !== undefined
            )
            : [];


    /* ========================= */
    /* LOADING SCREEN */
    /* ========================= */

    if (loading) {

        return (

            <div className="dashboard-page">

                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "15px"
                    }}
                >

                    <RefreshCw
                        size={38}
                        className="spin"
                    />

                    <h2>
                        Loading Student Portal...
                    </h2>

                    <p>
                        Please wait while we load your academic information.
                    </p>

                </div>

            </div>
        );
    }


    /* ========================= */
    /* MAIN PAGE */
    /* ========================= */

    return (

        <div className="dashboard-page">


            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <aside className="sidebar">

                <div className="sidebar-brand">

                    <div className="sidebar-logo">

                        <GraduationCap
                            size={26}
                        />

                    </div>

                    <div>

                        <strong>
                            SIMS
                        </strong>

                        <span>
                            Student Portal
                        </span>

                    </div>

                </div>


                <nav className="sidebar-nav">

                    <div className="nav-section">
                        MAIN
                    </div>


                    <NavButton
                        active={
                            activeSection ===
                            "dashboard"
                        }
                        icon={<BarChart3 size={19} />}
                        text="Dashboard"
                        onClick={() =>
                            changeSection(
                                "dashboard"
                            )
                        }
                    />


                    <NavButton
                        active={
                            activeSection ===
                            "profile"
                        }
                        icon={<User size={19} />}
                        text="My Profile"
                        onClick={() =>
                            changeSection(
                                "profile"
                            )
                        }
                    />


                    <NavButton
                        active={
                            activeSection ===
                            "courses"
                        }
                        icon={<BookOpen size={19} />}
                        text="My Courses"
                        onClick={() =>
                            changeSection(
                                "courses"
                            )
                        }
                    />


                    <div className="nav-section">
                        ACADEMICS
                    </div>


                    <NavButton
                        active={
                            activeSection ===
                            "attendance"
                        }
                        icon={
                            <CalendarCheck size={19} />
                        }
                        text="Attendance"
                        onClick={() =>
                            changeSection(
                                "attendance"
                            )
                        }
                    />


                    <NavButton
                        active={
                            activeSection ===
                            "examinations"
                        }
                        icon={
                            <ClipboardList size={19} />
                        }
                        text="Examinations"
                        onClick={() =>
                            changeSection(
                                "examinations"
                            )
                        }
                    />


                    <NavButton
                        active={
                            activeSection ===
                            "results"
                        }
                        icon={
                            <FileText size={19} />
                        }
                        text="Results"
                        onClick={() =>
                            changeSection(
                                "results"
                            )
                        }
                    />

                </nav>


                <button
                    className="logout-button"
                    onClick={logout}
                >

                    <LogOut size={19} />

                    Logout

                </button>

            </aside>


            {/* ========================= */}
            {/* MAIN */}
            {/* ========================= */}

            <main className="dashboard-main">


                {/* TOPBAR */}

                <header className="topbar">

                    <div>

                        <p className="topbar-label">
                            STUDENT PORTAL
                        </p>

                        <h1>
                            {getPageTitle(
                                activeSection
                            )}
                        </h1>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "18px"
                        }}
                    >

                        <button
                            onClick={refreshData}
                            disabled={refreshing}
                            title="Refresh"
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "10px",
                                border:
                                    "1px solid #e2e8f0",
                                background: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor:
                                    refreshing
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >

                            <RefreshCw
                                size={18}
                                className={
                                    refreshing
                                        ? "spin"
                                        : ""
                                }
                            />

                        </button>


                        <div className="profile-mini">

                            <div className="profile-avatar">

                                {name
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                            <div>

                                <strong>
                                    {name}
                                </strong>

                                <span>
                                    Student
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                {/* ALERTS */}

                {error && (

                    <div className="portal-alert error">

                        <XCircle size={20} />

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>
                )}


                {success && (

                    <div className="portal-alert success">

                        <CheckCircle size={20} />

                        <span>
                            {success}
                        </span>

                        <button
                            onClick={() =>
                                setSuccess("")
                            }
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* ========================= */}
                {/* DASHBOARD */}
                {/* ========================= */}

                {activeSection ===
                    "dashboard" && (

                    <>

                        <section className="welcome-banner student-banner">

                            <div>

                                <span>
                                    STUDENT PORTAL
                                </span>

                                <h2>
                                    Welcome, {name} 👋
                                </h2>

                                <p>
                                    Keep track of your courses,
                                    attendance, examinations
                                    and academic results.
                                </p>

                                <button
                                    onClick={() =>
                                        changeSection(
                                            "courses"
                                        )
                                    }
                                    style={{
                                        marginTop: "18px",
                                        padding:
                                            "10px 17px",
                                        border: "none",
                                        borderRadius:
                                            "9px",
                                        cursor:
                                            "pointer",
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: "7px"
                                    }}
                                >
                                    Browse Courses
                                    <ChevronRight
                                        size={16}
                                    />
                                </button>

                            </div>

                            <GraduationCap
                                size={90}
                            />

                        </section>


                        <section className="stats-grid">

                            <DashboardCard
                                icon={
                                    <CalendarCheck />
                                }
                                title="Attendance"
                                value={
                                    `${attendancePercentage.toFixed(1)}%`
                                }
                                subtitle="Overall attendance"
                            />


                            <DashboardCard
                                icon={
                                    <BookOpen />
                                }
                                title="Courses"
                                value={
                                    activeEnrollments.length
                                }
                                subtitle="Currently enrolled"
                            />


                            <DashboardCard
                                icon={
                                    <FileText />
                                }
                                title="Results"
                                value={
                                    safeResults.length
                                }
                                subtitle="Available results"
                            />


                            <DashboardCard
                                icon={
                                    <ClipboardList />
                                }
                                title="Exams"
                                value={
                                    upcomingExams
                                }
                                subtitle="Scheduled"
                            />

                        </section>


                        <section className="content-card">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        Academic Overview
                                    </h2>

                                    <p>
                                        Quickly access your academic information.
                                    </p>

                                </div>

                            </div>


                            <div className="student-overview-grid">

                                <OverviewItem
                                    icon={<User />}
                                    title="My Profile"
                                    text="View your personal and academic information."
                                    onClick={() =>
                                        changeSection(
                                            "profile"
                                        )
                                    }
                                />


                                <OverviewItem
                                    icon={<BookOpen />}
                                    title="My Courses"
                                    text="Browse courses and manage your enrollment."
                                    onClick={() =>
                                        changeSection(
                                            "courses"
                                        )
                                    }
                                />


                                <OverviewItem
                                    icon={
                                        <CalendarCheck />
                                    }
                                    title="Attendance"
                                    text="Monitor your attendance and daily records."
                                    onClick={() =>
                                        changeSection(
                                            "attendance"
                                        )
                                    }
                                />


                                <OverviewItem
                                    icon={<Award />}
                                    title="Results"
                                    text="Check your marks and examination grades."
                                    onClick={() =>
                                        changeSection(
                                            "results"
                                        )
                                    }
                                />

                            </div>

                        </section>

                    </>
                )}


                {/* ========================= */}
                {/* PROFILE */}
                {/* ========================= */}

                {activeSection ===
                    "profile" && (

                    <section className="content-card">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    My Profile
                                </h2>

                                <p>
                                    Your personal and academic information.
                                </p>

                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "18px",
                                padding: "22px",
                                marginBottom: "25px",
                                borderRadius: "14px",
                                background:
                                    "linear-gradient(135deg,#f8fafc,#eef2ff)"
                            }}
                        >

                            <div
                                className="profile-avatar"
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    fontSize: "24px"
                                }}
                            >
                                {(
                                    profile?.name ||
                                    name
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>

                                <h2
                                    style={{
                                        margin:
                                            "0 0 5px"
                                    }}
                                >
                                    {profile?.name ||
                                        name}
                                </h2>

                                <p
                                    style={{
                                        margin: 0,
                                        color:
                                            "#64748b"
                                    }}
                                >
                                    {profile?.email ||
                                        email}
                                </p>

                            </div>

                        </div>


                        <div className="profile-details-grid">

                            <ProfileField
                                label="Student ID"
                                value={
                                    profile?.studentId ||
                                    studentId ||
                                    "—"
                                }
                            />

                            <ProfileField
                                label="Name"
                                value={
                                    profile?.name ||
                                    name
                                }
                            />

                            <ProfileField
                                label="Email"
                                value={
                                    profile?.email ||
                                    email ||
                                    "—"
                                }
                            />

                            <ProfileField
                                label="Phone"
                                value={
                                    profile?.phone ||
                                    "—"
                                }
                            />

                            <ProfileField
                                label="Department"
                                value={
                                    profile?.department
                                        ?.departmentName ||
                                    profile?.departmentName ||
                                    "—"
                                }
                            />

                            <ProfileField
                                label="Status"
                                value={
                                    profile?.status ||
                                    "—"
                                }
                            />

                            <ProfileField
                                label="Registration Date"
                                value={
                                    profile?.registrationDate ||
                                    "—"
                                }
                            />

                        </div>

                    </section>
                )}


                {/* ========================= */}
                {/* COURSES */}
                {/* ========================= */}

                {activeSection ===
                    "courses" && (

                    <>

                        <section className="content-card">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        Available Courses
                                    </h2>

                                    <p>
                                        Browse active courses and enroll yourself.
                                    </p>

                                </div>

                                <span className="section-count">
                                    {availableCourses.length} available
                                </span>

                            </div>


                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginBottom: "25px"
                                }}
                            >

                                <div
                                    style={{
                                        flex: 1,
                                        position:
                                            "relative"
                                    }}
                                >

                                    <Search
                                        size={19}
                                        style={{
                                            position:
                                                "absolute",
                                            left: "14px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            color:
                                                "#64748b"
                                        }}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search courses by name or code..."
                                        value={searchText}
                                        onChange={e =>
                                            setSearchText(
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            padding:
                                                "12px 15px 12px 42px",
                                            borderRadius:
                                                "10px",
                                            border:
                                                "1px solid #d1d5db",
                                            fontSize:
                                                "14px",
                                            boxSizing:
                                                "border-box"
                                        }}
                                    />

                                </div>


                                <button
                                    onClick={
                                        refreshData
                                    }
                                    disabled={
                                        refreshing ||
                                        actionLoading
                                    }
                                    title="Refresh courses"
                                    style={{
                                        width: "48px",
                                        border:
                                            "1px solid #e2e8f0",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "#ffffff",
                                        cursor:
                                            "pointer",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center"
                                    }}
                                >

                                    <RefreshCw
                                        size={18}
                                        className={
                                            refreshing
                                                ? "spin"
                                                : ""
                                        }
                                    />

                                </button>

                            </div>


                            {availableCourses.length ===
                            0 ? (

                                <EmptyState
                                    icon={
                                        <BookOpen
                                            size={35}
                                        />
                                    }
                                    title={
                                        searchText
                                            ? "No matching courses"
                                            : "No courses available"
                                    }
                                    text={
                                        searchText
                                            ? "Try another course name or course code."
                                            : "There are currently no courses available for enrollment."
                                    }
                                />

                            ) : (

                                <div className="data-table-wrapper">

                                    <table className="data-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Course
                                                </th>

                                                <th>
                                                    Code
                                                </th>

                                                <th>
                                                    Credits
                                                </th>

                                                <th>
                                                    Department
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {availableCourses.map(
                                                course => (

                                                    <tr
                                                        key={
                                                            course.courseId
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
                                                                course.credits
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                course
                                                                    .department
                                                                    ?.departmentName ||
                                                                "—"
                                                            }
                                                        </td>

                                                        <td>

                                                            <span className="status-badge active">
                                                                ACTIVE
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <button
                                                                onClick={() =>
                                                                    enrollInCourse(
                                                                        course.courseId
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                                style={{
                                                                    padding:
                                                                        "8px 14px",
                                                                    border:
                                                                        "none",
                                                                    borderRadius:
                                                                        "8px",
                                                                    cursor:
                                                                        "pointer",
                                                                    display:
                                                                        "inline-flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap:
                                                                        "5px"
                                                                }}
                                                            >

                                                                <CheckCircle
                                                                    size={16}
                                                                />

                                                                Enroll

                                                            </button>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </section>


                        <section className="content-card">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        My Enrolled Courses
                                    </h2>

                                    <p>
                                        Courses currently registered under your account.
                                    </p>

                                </div>

                                <span className="section-count">
                                    {activeEnrollments.length} enrolled
                                </span>

                            </div>


                            {activeEnrollments.length ===
                            0 ? (

                                <EmptyState
                                    icon={
                                        <BookOpen
                                            size={35}
                                        />
                                    }
                                    title="No enrolled courses"
                                    text="You have not enrolled in any courses yet."
                                />

                            ) : (

                                <div className="data-table-wrapper">

                                    <table className="data-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Course
                                                </th>

                                                <th>
                                                    Code
                                                </th>

                                                <th>
                                                    Credits
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

    {activeEnrollments.map(enrollment => {

        const course =
            getEnrollmentCourse(enrollment);

        return (
            <tr
                key={
                    enrollment.enrollmentId
                }
            >

                <td>

                    <strong>
                        {
                            course?.courseName ||
                            "—"
                        }
                    </strong>

                </td>

                <td>
                    {
                        course?.courseCode ||
                        "—"
                    }
                </td>

                <td>
                    {
                        course?.credits ??
                        "—"
                    }
                </td>

                <td>

                    <span className="status-badge active">
                        {enrollment.status}
                    </span>

                </td>

                <td>

                    <button
                        onClick={() =>
                            dropCourse(
                                enrollment.enrollmentId
                            )
                        }
                        disabled={
                            actionLoading
                        }
                        style={{
                            padding:
                                "8px 14px",
                            border:
                                "none",
                            borderRadius:
                                "8px",
                            cursor:
                                "pointer",
                            display:
                                "inline-flex",
                            alignItems:
                                "center",
                            gap: "5px"
                        }}
                    >

                        <XCircle
                            size={16}
                        />

                        Drop

                    </button>

                </td>

            </tr>
        );

    })}

</tbody>
                                    </table>

                                </div>
                            )}

                        </section>

                    </>
                )}


                {/* ========================= */}
                {/* ATTENDANCE */}
                {/* ========================= */}

                {activeSection ===
                    "attendance" && (

                    <section className="content-card">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Attendance
                                </h2>

                                <p>
                                    Monitor your attendance performance.
                                </p>

                            </div>

                        </div>


                        <div
                            style={{
                                padding: "28px",
                                marginBottom: "25px",
                                borderRadius: "16px",
                                background:
                                    "linear-gradient(135deg,#f8fafc,#eef2ff)",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: "18px"
                                }}
                            >

                                <div
                                    style={{
                                        width: "58px",
                                        height: "58px",
                                        borderRadius:
                                            "14px",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        background:
                                            "#ffffff"
                                    }}
                                >

                                    <CalendarCheck
                                        size={30}
                                    />

                                </div>

                                <div>

                                    <span
                                        style={{
                                            color:
                                                "#64748b"
                                        }}
                                    >
                                        Overall Attendance
                                    </span>

                                    <h2
                                        style={{
                                            margin:
                                                "5px 0 0"
                                        }}
                                    >
                                        {attendancePercentage.toFixed(2)}%
                                    </h2>

                                </div>

                            </div>


                            <TrendingUp
                                size={42}
                            />

                        </div>


                        {Array.isArray(
                            attendanceRecords
                        ) &&
                        attendanceRecords.length >
                            0 ? (

                            <div className="data-table-wrapper">

                                <table className="data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Course
                                            </th>

                                            <th>
                                                Attendance
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {attendanceRecords.map(
                                            (
                                                record,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        record.attendanceId ||
                                                        index
                                                    }
                                                >

                                                    <td>
    {
        record.attendanceDate ||
        record.date ||
        "—"
    }
</td>

                                                    <td>
                                                        {
                                                            record
                                                                .course
                                                                ?.courseName ||
                                                            record.courseName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>

                                                        {record.present ===
                                                        true ? (

                                                            <span className="status-badge active">
                                                                Present
                                                            </span>

                                                        ) : (

                                                            <span className="status-badge">
                                                                Absent
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <EmptyState
                                icon={
                                    <CalendarCheck
                                        size={35}
                                    />
                                }
                                title="No attendance records"
                                text="Attendance records will appear here when they are added."
                            />

                        )}

                    </section>
                )}


                {/* ========================= */}
                {/* EXAMINATIONS */}
                {/* ========================= */}

                {activeSection ===
                    "examinations" && (

                    <section className="content-card">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Examinations
                                </h2>

                                <p>
                                    View your scheduled examinations.
                                </p>

                            </div>

                            <span className="section-count">
                                {safeExams.length} exams
                            </span>

                        </div>


                        {safeExams.length > 0 ? (

                            <div className="data-table-wrapper">

                                <table className="data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Examination
                                            </th>

                                            <th>
                                                Course
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Details
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {safeExams.map(
                                            (
                                                exam,
                                                index
                                            ) => (

                                                <tr
                                                    key={
                                                        exam.examinationId ||
                                                        exam.examId ||
                                                        index
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            {
                                                                exam.examName ||
                                                                exam.examinationName ||
                                                                "Examination"
                                                            }
                                                        </strong>

                                                    </td>

                                                    <td>
                                                        {
                                                            exam
                                                                .course
                                                                ?.courseName ||
                                                            exam.courseName ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            exam.examDate ||
                                                            exam.date ||
                                                            "—"
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            exam.description ||
                                                            exam.details ||
                                                            "—"
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <EmptyState
                                icon={
                                    <ClipboardList
                                        size={35}
                                    />
                                }
                                title="No examinations"
                                text="Your examination schedule will appear here."
                            />

                        )}

                    </section>
                )}


                {/* ========================= */}
                {/* RESULTS */}
                {/* ========================= */}

                {activeSection ===
                    "results" && (

                    <section className="content-card">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Results
                                </h2>

                                <p>
                                    View your examination marks and grades.
                                </p>

                            </div>

                            <span className="section-count">
                                {safeResults.length} results
                            </span>

                        </div>


                        {safeResults.length > 0 ? (

                            <div className="data-table-wrapper">

                                <table className="data-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Course
                                            </th>

                                            <th>
                                                Examination
                                            </th>

                                            <th>
                                                Marks
                                            </th>

                                            <th>
                                                Grade
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                       {safeResults.map(
    (result, index) => {

        const exam =
            getResultExam(result);

        const course =
            exam?.course ||
            getExamCourse(exam);

        return (
            <tr
                key={
                    result.resultId ||
                    index
                }
            >

                <td>

                    <strong>
                        {
                            course?.courseName ||
                            result.courseName ||
                            "—"
                        }
                    </strong>

                    <small
                        style={{
                            display: "block",
                            color: "#64748b",
                            marginTop: "4px"
                        }}
                    >
                        {
                            course?.courseCode ||
                            "—"
                        }
                    </small>

                </td>

                <td>
                    {
                        exam?.examName ||
                        exam?.examinationName ||
                        result.examName ||
                        "—"
                    }
                </td>

                <td>
                    {
                        result.marks ??
                        result.mark ??
                        "—"
                    }

                    {
                        result.marks !== undefined ||
                        result.mark !== undefined
                            ? "/50"
                            : ""
                    }
                </td>

                <td>

                    <span className="status-badge active">

                        {
                            result.grade ||
                            "—"
                        }

                    </span>

                </td>

            </tr>
        );
    }
)}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <EmptyState
                                icon={
                                    <Award
                                        size={35}
                                    />
                                }
                                title="No results available"
                                text="Your examination results will appear here when published."
                            />

                        )}

                    </section>
                )}

            </main>

        </div>
    );
}


/* ============================= */
/* NAV BUTTON */
/* ============================= */

function NavButton({
    active,
    icon,
    text,
    onClick
}) {

    return (

        <button
            className={
                active
                    ? "nav-item active"
                    : "nav-item"
            }
            onClick={onClick}
        >

            {icon}

            {text}

        </button>
    );
}


/* ============================= */
/* PAGE TITLE */
/* ============================= */

function getPageTitle(section) {
    const titles = {
        dashboard: "Dashboard",
        profile: "My Profile",
        courses: "My Courses",
        attendance: "Attendance",
        examinations: "Examinations",
        results: "Results"
    };

    return titles[section] || "Dashboard";
}


/* ============================= */
/* DASHBOARD CARD */
/* ============================= */

function DashboardCard({
    icon,
    title,
    value,
    subtitle
}) {

    return (

        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {subtitle}
                </small>

            </div>

        </div>
    );
}


/* ============================= */
/* OVERVIEW ITEM */
/* ============================= */

function OverviewItem({
    icon,
    title,
    text,
    onClick
}) {

    return (

        <button
            className="quick-action"
            onClick={onClick}
            style={{
                textAlign: "left",
                width: "100%",
                border: "none",
                cursor: "pointer"
            }}
        >

            <div className="quick-icon">
                {icon}
            </div>

            <div style={{ flex: 1 }}>

                <h3>
                    {title}
                </h3>

                <p>
                    {text}
                </p>

            </div>

            <ChevronRight
                size={18}
            />

        </button>
    );
}


/* ============================= */
/* PROFILE FIELD */
/* ============================= */

function ProfileField({
    label,
    value
}) {

    return (

        <div
            style={{
                padding: "18px",
                borderRadius: "12px",
                background: "#f8fafc",
                border:
                    "1px solid #e5e7eb"
            }}
        >

            <span
                style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom:
                        "7px",
                    textTransform:
                        "uppercase",
                    letterSpacing:
                        "0.5px"
                }}
            >
                {label}
            </span>

            <strong
                style={{
                    fontSize: "15px",
                    wordBreak:
                        "break-word"
                }}
            >
                {value}
            </strong>

        </div>
    );
}


/* ============================= */
/* EMPTY STATE */
/* ============================= */

function EmptyState({
    icon,
    title,
    text
}) {

    return (

        <div
            style={{
                padding:
                    "55px 20px",
                textAlign:
                    "center",
                color:
                    "#64748b"
            }}
        >

            <div
                style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 18px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "#f1f5f9"
                }}
            >

                {icon}

            </div>

            <h3
                style={{
                    marginBottom:
                        "8px",
                    color:
                        "#1e293b"
                }}
            >
                {title}
            </h3>

            <p>
                {text}
            </p>

        </div>
    );
}


export default StudentDashboard;