import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ role }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("http://localhost:5234/api/Login/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    role,
                }),
            });

            if (response.ok) {
                const user = await response.json();

                localStorage.setItem("loggedInUser", JSON.stringify(user));

                alert("Login successfully");

                if (role === "jobseeker") navigate("/jobseeker/dashboard");
                if (role === "employer") navigate("/employer/dashboard");
                if (role === "admin") navigate("/admin/dashboard");
            } else {
                const error = await response.text();

                alert(error);

                if (error === "Please verify your email first") {
                    navigate("/verify-email", {
                        state: {
                            email,
                            role,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    if (!role) return <h2>Invalid route</h2>;

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ padding: "20px" }}>
                <h2>
                    {role
                        ? role.charAt(0).toUpperCase() + role.slice(1)
                        : ""}{" "}
                    Login
                </h2>

                <form onSubmit={handleLogin}>
                    <input
                        className="form-control mb-2"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                </form>
                <p className="mt-2">
                <Link to="/forgot-password">
                    Forgot Password?
                </Link>
            </p>

                {role && role !== "admin" && (
                    <p className="mt-3">
                        Don't have an account?{" "}
                        <Link to={`/${role}/register`}>Register</Link>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;