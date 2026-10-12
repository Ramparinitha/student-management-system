
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== role) {
        if (userRole === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }

        if (userRole === "STUDENT") {
            return <Navigate to="/student" replace />;
        }

        if (userRole === "FACULTY") {
            return <Navigate to="/faculty" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/faculty"
                    element={
                        <ProtectedRoute role="FACULTY">
                            <FacultyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
