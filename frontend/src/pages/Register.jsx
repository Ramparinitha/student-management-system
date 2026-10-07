import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap,
    User,
    Mail,
    Phone,
    Lock,
    Building2,
    ArrowLeft,
    ArrowRight,
    Loader2,
    CheckCircle
} from "lucide-react";
import api from "../api";

export default function Register() {

    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        departmentId: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [error, setError] = useState("");
    const [studentId, setStudentId] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await api.get("/departments");
            setDepartments(response.data);
        } catch (err) {
            setError("Unable to load departments.");
        } finally {
            setLoadingDepartments(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!formData.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (!formData.departmentId) {
            setError("Please select your department.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/users/register/student",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                    departmentId: Number(formData.departmentId)
                }
            );

            setStudentId(response.data.studentId);
            setSuccess(true);

        } catch (err) {

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data) {
                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Registration failed."
                );
            } else {
                setError(
                    "Cannot connect to backend. Please make sure the server is running."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">

                <div className="auth-card">

                    <div className="auth-logo">
                        <div className="logo-icon">
                            <GraduationCap size={30} />
                        </div>

                        <div>
                            <h1>SIMS</h1>
                            <p>Student Information Management System</p>
                        </div>
                    </div>

                    <div className="success-container">

                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>

                        <h2>Registration Successful!</h2>

                        <p className="success-text">
                            Your student account has been created successfully.
                        </p>

                        <div className="student-id-card">

                            <span>Your Student ID</span>

                            <strong>{studentId}</strong>

                            <p>
                                Save this ID. You will use it to log in to
                                your student account.
                            </p>

                        </div>

                        <button
                            className="auth-button"
                            onClick={() => navigate("/login")}
                        >
                            Continue to Login
                            <ArrowRight size={18} />
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <button
                    className="back-button"
                    onClick={() => navigate("/login")}
                    type="button"
                >
                    <ArrowLeft size={18} />
                    Back to Login
                </button>

                <div className="auth-logo">

                    <div className="logo-icon">
                        <GraduationCap size={30} />
                    </div>

                    <div>
                        <h1>SIMS</h1>
                        <p>Student Information Management System</p>
                    </div>

                </div>

                <div className="auth-heading">

                    <h2>Create Student Account</h2>

                    <p>
                        Register as a student to access your academic information.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Full Name</label>

                        <div className="input-wrapper">

                            <User size={18} />

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Email Address</label>

                        <div className="input-wrapper">

                            <Mail size={18} />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Phone Number</label>

                        <div className="input-wrapper">

                            <Phone size={18} />

                            <input
                                type="text"
                                name="phone"
                                placeholder="10-digit phone number"
                                maxLength="10"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <div className="input-wrapper">

                            <Lock size={18} />

                            <input
                                type="password"
                                name="password"
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Department</label>

                        <div className="input-wrapper">

                            <Building2 size={18} />

                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                disabled={loading || loadingDepartments}
                            >

                                <option value="">
                                    {loadingDepartments
                                        ? "Loading departments..."
                                        : "Select your department"}
                                </option>

                                {departments.map((department) => (
                                    <option
                                        key={department.departmentId}
                                        value={department.departmentId}
                                    >
                                        {department.departmentName}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading || loadingDepartments}
                    >

                        {loading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="spin"
                                />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Student Account
                                <ArrowRight size={18} />
                            </>
                        )}

                    </button>

                </form>

                <div className="auth-footer">

                    Already have an account?

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}