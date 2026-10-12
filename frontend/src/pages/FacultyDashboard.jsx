
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  LogOut,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";
import { apiRequest } from "../api";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.value)) return response.value;
  return [];
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 760
  );

  const [students, setStudents] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [records, setRecords] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [resultsError, setResultsError] = useState("");
  const [message, setMessage] = useState("");

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(getToday());
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [remarks, setRemarks] = useState("");

  const [examinations, setExaminations] = useState([]);
  const [marksStudentId, setMarksStudentId] = useState("");
  const [marksExamId, setMarksExamId] = useState("");
  const [marksValue, setMarksValue] = useState("");
  const [marksSaving, setMarksSaving] = useState(false);
  const [marksMessage, setMarksMessage] = useState("");
  const [marksError, setMarksError] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Students", icon: Users },
    { name: "Courses", icon: BookOpen },
    { name: "Attendance", icon: ClipboardCheck },
    { name: "Results", icon: FileText },
  ];

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentResponse, courseResponse, attendanceResponse] =
        await Promise.all([
          apiRequest("/students"),
          apiRequest("/courses"),
          apiRequest("/attendance"),
        ]);

      setStudents(
        getList(studentResponse).filter(
          (student) => student.status === "ACTIVE"
        )
      );

      setActiveCourses(
        getList(courseResponse).filter(
          (course) => course.status === "ACTIVE"
        )
      );

      setRecords(getList(attendanceResponse));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadResults = useCallback(async () => {
    setResultsLoading(true);
    setResultsError("");

    try {
      const response = await apiRequest("/results");
      setResults(getList(response));
    } catch (err) {
      setResultsError(getErrorMessage(err));
    } finally {
      setResultsLoading(false);
    }
  }, []);

  const loadStudentCourses = useCallback(async (selectedStudentId) => {
    setCourseId("");
    setEnrolledCourses([]);
    setError("");

    if (!selectedStudentId) return;

    setCoursesLoading(true);

    try {
      const response = await apiRequest(
        `/enrollments/student/${encodeURIComponent(selectedStudentId)}`
      );

      const enrollments = getList(response);

      const uniqueCourses = Array.from(
        new Map(
          enrollments
            .filter(
              (enrollment) =>
                enrollment.status === "ENROLLED" &&
                enrollment.course?.status === "ACTIVE"
            )
            .map((enrollment) => {
              const course = enrollment.course;
              const id = course.id ?? course.courseId;

              return [id, { ...course, id }];
            })
            .filter(([id]) => id != null)
        ).values()
      );

      setEnrolledCourses(uniqueCourses);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 760;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    setError("");
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!studentId || !courseId || !attendanceDate || !attendanceStatus) {
      setError("Please select a student, course, date, and status.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        attendanceDate,
        present: attendanceStatus === "PRESENT",
        remarks,
      };

      const endpoint =
        `/attendance?studentId=${encodeURIComponent(studentId)}` +
        `&courseId=${encodeURIComponent(courseId)}`;

      console.log("Attendance endpoint:", endpoint);
      console.log("Attendance payload:", payload);

      const result = await apiRequest(endpoint, "POST", payload);

      console.log("Attendance response:", result);

      setMessage("Attendance marked successfully.");
      setStudentId("");
      setCourseId("");
      setEnrolledCourses([]);
      setAttendanceDate(getToday());
      setAttendanceStatus("PRESENT");
      setRemarks("");

      await loadDashboard();
    } catch (err) {
      console.error(
        "Attendance submission failed:",
        err.response?.data || err
      );
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle =
    activePage === "Dashboard" ? "Faculty Dashboard" : activePage;

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    background: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px",
    fontSize: "14px",
    background: "#ffffff",
    marginTop: "6px",
  };

  const renderAttendance = () => (
    <div style={{ display: "grid", gap: "22px" }}>
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Mark Attendance</h2>

        <form onSubmit={handleAttendanceSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <label>
              Student *
              <select
                required
                value={studentId}
                onChange={(event) => {
                  const value = event.target.value;
                  setStudentId(value);
                  loadStudentCourses(value);
                }}
                style={inputStyle}
              >
                <option value="">Select student</option>
                {students.map((student, index) => {
                  const id = student.id ?? student.studentId;
                  return (
                    <option key={id ?? index} value={id ?? ""}>
                      {student.name} ({student.studentId ?? id})
                    </option>
                  );
                })}
              </select>
            </label>

            <label>
              Course *
              <select
                required
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                style={inputStyle}
                disabled={
                  !studentId ||
                  coursesLoading ||
                  enrolledCourses.length === 0
                }
              >
                <option value="">
                  {!studentId
                    ? "Select a student first"
                    : coursesLoading
                      ? "Loading courses..."
                      : enrolledCourses.length === 0
                        ? "No enrolled courses available"
                        : "Select course"}
                </option>

                {enrolledCourses.map((course, index) => (
                  <option
                    key={course.id ?? index}
                    value={course.id ?? ""}
                  >
                    {course.courseName ?? course.name ?? "Course"} (
                    {course.courseCode ?? course.code ?? "N/A"})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Attendance Date *
              <input
                type="date"
                required
                max={getToday()}
                value={attendanceDate}
                onChange={(event) =>
                  setAttendanceDate(event.target.value)
                }
                style={inputStyle}
              />
            </label>

            <label>
              Status *
              <select
                required
                value={attendanceStatus}
                onChange={(event) =>
                  setAttendanceStatus(event.target.value)
                }
                style={inputStyle}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              Remarks
              <input
                type="text"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Optional remarks"
                style={inputStyle}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || coursesLoading}
            style={{
              ...buttonStyle,
              marginTop: "20px",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Mark Attendance"}
          </button>
        </form>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>Attendance Records</h2>
          <button
            type="button"
            onClick={loadDashboard}
            style={{
              ...buttonStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {records.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No attendance records found.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "18px" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Course</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id ?? index}>
                    <td style={tdStyle}>
                      {record.student?.name ??
                        record.studentName ??
                        record.studentId ??
                        "-"}
                    </td>
                    <td style={tdStyle}>
                      {record.course?.courseName ??
                        record.courseName ??
                        record.courseId ??
                        "-"}
                    </td>
                    <td style={tdStyle}>
                      {record.attendanceDate ?? record.date ?? "-"}
                    </td>
                    <td style={tdStyle}>
                      {record.status ??
                        (record.present === true
                          ? "PRESENT"
                          : record.present === false
                            ? "ABSENT"
                            : "-")}
                    </td>
                    <td style={tdStyle}>{record.remarks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );

  const loadMarkEntryOptions = useCallback(async () => {
    setMarksError("");

    try {
      const [studentResponse, examResponse] = await Promise.all([
        apiRequest("/students"),
        apiRequest("/examinations"),
      ]);

      setStudents(
        getList(studentResponse).filter(
          (student) =>
            String(student.status || "").toUpperCase() === "ACTIVE"
        )
      );

      setExaminations(
        getList(examResponse).filter(
          (exam) =>
            String(exam.status || "").toUpperCase() === "COMPLETED"
        )
      );
    } catch (err) {
      setMarksError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    if (activePage === "Results") {
      loadResults();
      loadMarkEntryOptions();
    }
  }, [activePage, loadResults, loadMarkEntryOptions]);

  const handleMarksSubmit = async (event) => {
    event.preventDefault();
    setMarksError("");
    setMarksMessage("");

    if (!marksStudentId || !marksExamId || marksValue === "") {
      setMarksError("Select a student, examination, and enter marks.");
      return;
    }

    const numericMarks = Number(marksValue);
    if (!Number.isInteger(numericMarks) || numericMarks < 0 || numericMarks > 50) {
      setMarksError("Marks must be a whole number between 0 and 50.");
      return;
    }

    setMarksSaving(true);
    try {
      await apiRequest(
        `/results?studentId=${encodeURIComponent(marksStudentId)}&examId=${encodeURIComponent(marksExamId)}`,
        "POST",
        { marks: numericMarks }
      );

      setMarksMessage("Marks saved successfully.");
      setMarksValue("");
      await loadResults();
    } catch (err) {
      setMarksError(getErrorMessage(err));
    } finally {
      setMarksSaving(false);
    }
  };

  const renderResults = () => (
    <section style={cardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Student Results</h2>
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            View examination marks and grades.
          </p>
        </div>

        <button
          type="button"
          onClick={loadResults}
          style={{
            ...buttonStyle,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <RefreshCw size={16} /> Refresh Results
        </button>
      </div>

      <form
        onSubmit={handleMarksSubmit}
        style={{
          marginTop: "24px",
          marginBottom: "24px",
          padding: "20px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          display: "grid",
          gap: "14px",
        }}
      >
        <h3 style={{ margin: 0 }}>Enter Student Marks</h3>

        <label style={{ display: "grid", gap: "6px" }}>
          Student
          <select
            value={marksStudentId}
            onChange={(event) => setMarksStudentId(event.target.value)}
            required
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="">Select a student</option>
            {students.map((student) => {
              const id = student.studentId ?? student.id;
              return (
                <option key={id} value={id}>
                  {student.name} (ID: {id})
                </option>
              );
            })}
          </select>
        </label>

        <label style={{ display: "grid", gap: "6px" }}>
          Examination
          <select
            value={marksExamId}
            onChange={(event) => setMarksExamId(event.target.value)}
            required
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="">Select an examination</option>
            {examinations.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName} â€” {exam.examType} (ID: {exam.examId})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: "6px" }}>
          Marks (0â€“50)
          <input
            type="number"
            min="0"
            max="50"
            step="1"
            value={marksValue}
            onChange={(event) => setMarksValue(event.target.value)}
            required
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </label>

        {marksError && (
          <p role="alert" style={{ color: "#dc2626", margin: 0 }}>
            {marksError}
          </p>
        )}
        {marksMessage && (
          <p role="status" style={{ color: "#15803d", margin: 0 }}>
            {marksMessage}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button type="submit" disabled={marksSaving} style={buttonStyle}>
            {marksSaving ? "Saving..." : "Save Marks"}
          </button>
          <button
            type="button"
            onClick={loadMarkEntryOptions}
            style={buttonStyle}
          >
            Reload Students & Exams
          </button>
        </div>
      </form>

      {resultsLoading && <p>Loading results...</p>}
      {resultsError && (
        <p style={{ color: "#dc2626" }}>{resultsError}</p>
      )}

      {!resultsLoading && !resultsError && results.length === 0 && (
        <p style={{ color: "#6b7280" }}>
          No results found, or the results endpoint returned no records.
        </p>
      )}

      {!resultsLoading && results.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: "18px" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>Examination</th>
                <th style={thStyle}>Marks</th>
                <th style={thStyle}>Grade</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id ?? index}>
                  <td style={tdStyle}>
                    {result.student?.studentId ?? result.studentId ?? "-"}
                  </td>
                  <td style={tdStyle}>
                    {result.student?.name ?? result.studentName ?? "-"}
                  </td>
                  <td style={tdStyle}>
                    {result.examName ??
                      result.examinationName ??
                      result.exam?.name ??
                      result.title ??
                      "-"}
                  </td>
                  <td style={tdStyle}>
                    {result.marksObtained ??
                      result.marks ??
                      result.score ??
                      "-"}
                    {result.totalMarks ? ` / ${result.totalMarks}` : ""}
                  </td>
                  <td style={tdStyle}>{result.grade ?? "-"}</td>
                  <td style={tdStyle}>
                    {result.resultStatus ?? result.status ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  const renderPage = () => {
    if (activePage === "Attendance") return renderAttendance();
    if (activePage === "Results") return renderResults();

    if (activePage === "Students") {
      return (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Active Students</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id ?? student.studentId ?? index}>
                    <td style={tdStyle}>
                      {student.studentId ?? student.id ?? "-"}
                    </td>
                    <td style={tdStyle}>{student.name ?? "-"}</td>
                    <td style={tdStyle}>{student.email ?? "-"}</td>
                    <td style={tdStyle}>{student.status ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePage === "Courses") {
      return (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Active Courses</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Course Code</th>
                  <th style={thStyle}>Course Name</th>
                  <th style={thStyle}>Credits</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeCourses.map((course, index) => (
                  <tr key={course.id ?? index}>
                    <td style={tdStyle}>
                      {course.courseCode ?? course.code ?? "-"}
                    </td>
                    <td style={tdStyle}>
                      {course.courseName ?? course.name ?? "-"}
                    </td>
                    <td style={tdStyle}>{course.credits ?? "-"}</td>
                    <td style={tdStyle}>{course.status ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    return (
      <div style={{ display: "grid", gap: "22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "18px",
          }}
        >
          {[
            {
              label: "Active Students",
              value: students.length,
              icon: Users,
              color: "#4f46e5",
            },
            {
              label: "Active Courses",
              value: activeCourses.length,
              icon: BookOpen,
              color: "#0891b2",
            },
            {
              label: "Attendance Records",
              value: records.length,
              icon: ClipboardCheck,
              color: "#059669",
            },
            {
              label: "Results Records",
              value: results.length,
              icon: FileText,
              color: "#d97706",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span style={{ color: "#6b7280" }}>{item.label}</span>
                  <Icon color={item.color} size={24} />
                </div>
                <h2 style={{ fontSize: "30px", margin: "16px 0 0" }}>
                  {item.value}
                </h2>
              </div>
            );
          })}
        </div>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Quick Actions</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "14px",
            }}
          >
            {[
              { label: "View Students", page: "Students", icon: Users },
              { label: "View Courses", page: "Courses", icon: BookOpen },
              {
                label: "Mark Attendance",
                page: "Attendance",
                icon: ClipboardCheck,
              },
              { label: "View Results", page: "Results", icon: FileText },
            ].map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.page}
                  type="button"
                  onClick={() => openPage(action.page)}
                  style={{
                    ...buttonStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    minHeight: "48px",
                  }}
                >
                  <Icon size={18} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            border: "none",
            zIndex: 20,
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: "250px",
          background: "#111827",
          color: "#ffffff",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          transform:
            isMobile && !sidebarOpen
              ? "translateX(-100%)"
              : "translateX(0)",
          transition: "transform 0.25s ease",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #374151",
          }}
        >
          <GraduationCap size={30} color="#a5b4fc" />
          <div>
            <strong style={{ fontSize: "18px" }}>SIMS</strong>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Faculty Portal
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              style={{
                marginLeft: "auto",
                background: "transparent",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={21} />
            </button>
          )}
        </div>

        <nav style={{ padding: "18px 12px", flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const selected = activePage === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => openPage(item.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "13px 14px",
                  marginBottom: "7px",
                  border: "none",
                  borderRadius: "9px",
                  background: selected ? "#4f46e5" : "transparent",
                  color: selected ? "#ffffff" : "#d1d5db",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: selected ? 700 : 500,
                }}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "12px",
            padding: "13px 14px",
            background: "#374151",
            color: "#ffffff",
            border: "none",
            borderRadius: "9px",
            cursor: "pointer",
          }}
        >
          <LogOut size={19} /> Logout
        </button>
      </aside>

      <main
        style={{
          marginLeft: isMobile ? 0 : "250px",
          minHeight: "100vh",
          transition: "margin-left 0.25s ease",
        }}
      >
        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isMobile && (
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "#eef2ff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px",
                  cursor: "pointer",
                }}
              >
                <Menu size={20} />
              </button>
            )}

            <div>
              <h1 style={{ margin: 0, fontSize: "23px" }}>{pageTitle}</h1>
              <p
                style={{
                  margin: "5px 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Student Information Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            style={{
              ...buttonStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={16} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <div style={{ padding: "24px" }}>
          {error && (
            <div
              role="alert"
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "12px 14px",
                borderRadius: "8px",
                marginBottom: "18px",
              }}
            >
              {error}
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
                style={{
                  float: "right",
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {message && (
            <div
              role="status"
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px 14px",
                borderRadius: "8px",
                marginBottom: "18px",
              }}
            >
              {message}
            </div>
          )}

          {renderPage()}
        </div>
      </main>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  fontSize: "14px",
};

const thStyle = {
  padding: "13px 12px",
  background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
  color: "#4b5563",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "13px 12px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
};



