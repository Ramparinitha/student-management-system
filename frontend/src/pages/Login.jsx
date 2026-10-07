
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    GraduationCap,
    Mail,
    Lock,
    ArrowRight,
    Loader2
} from "lucide-react";

import { apiRequest } from "../api";

function Login() {

    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event) {

        event.preventDefault();

        setError("");

        if (!identifier || !password) {
            setError("Please enter your Student ID or Admin Email and password.");
            return;
        }

        try {

            setLoading(true);

            const data = await apiRequest(
                "/users/login",
                "POST",
                {
                    identifier,
                    password
                }
            );

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "userId",
                data.userId
            );

            localStorage.setItem(
                "name",
                data.name
            );

            localStorage.setItem(
                "email",
                data.email
            );

            localStorage.setItem(
                "role",
                data.role
            );

            if (data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/student");
            }

        } catch (err) {

            setError(
                err.message ||
                "Invalid Student ID/email or password."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="auth-page">

            <div className="auth-background-shape shape-one"></div>
            <div className="auth-background-shape shape-two"></div>

            <div className="auth-container">

                <div className="auth-brand">

                    <div className="brand-logo">
                        <GraduationCap size={34} />
                    </div>

                    <div>
                        <h1>VIT-AP</h1>

                        <p>
                            Student Information Management System (SIMS)
                        </p>
                    </div>

                </div>

                <div className="auth-card">

                    <div className="auth-header">

                        <span className="welcome-label">
                            WELCOME BACK
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Access your academic information,
                            courses and university services.
                        </p>

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label>
                                Student ID or Admin Email
                            </label>

                            <div className="input-wrapper">

                                <Mail size={19} />

                                <input
                                    type="text"
                                    placeholder="Enter Student ID or Admin Email"
                                    value={identifier}
                                    onChange={(e) =>
                                        setIdentifier(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="username"
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <Lock size={19} />

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                />

                            </div>

                        </div>

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="spin"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={19} />
                                </>
                            )}

                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    <p className="register-text">

                        New student?

                        <Link to="/register">
                            Create an account
                        </Link>

                    </p>

                </div>

                <p className="auth-footer">
                    VIT-AP • Student Information Management System
                </p>

            </div>

        </div>
    );
}

export default Login;

