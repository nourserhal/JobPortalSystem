import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    const role = location.state?.role || "";
    const userData = location.state?.userData;

    const [code, setCode] = useState("");
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (!email) {
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setTimeout(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [seconds]);

    function goToDashboard() {
        if (role === "jobseeker") {
            navigate("/jobseeker/dashboard");
        } else if (role === "employer") {
            navigate("/employer/dashboard");
        } else {
            navigate("/");
        }
    }

    async function handleVerify(e) {
        e.preventDefault();

        if (!code) {
            alert("Please enter verification code");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5234/api/Register/verify-email",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, code }),
                }
            );

            if (response.ok) {
                alert("Email verified successfully");
                localStorage.setItem("user", JSON.stringify({
                    email: email,
                    role: role
                }));
                navigate(`/${role}/login`);
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    async function resendCode() {
        try {
            const response = await fetch(
                "http://localhost:5234/api/Register/resend-code",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                alert("New verification code sent");
                setSeconds(60);
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Verify Email</h2>

                <p>
                    Verification code sent to:
                    <br />
                    <strong>{email}</strong>
                </p>

                <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={() =>
                        navigate(`/${role}/register`, {
                            state: userData
                        })
                    }
                >
                    Wrong email? Go back
                </button>

                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={code.trim()}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <button type="submit" className="auth-submit-btn">
                        Verify Email
                    </button>
                </form>
<br />
                <button
                    type="button"
                    disabled={seconds > 0}
                    onClick={resendCode}
                >
                    {seconds > 0
                        ? `Resend code in ${seconds}s`
                        : "Resend code"}
                </button>
            </div>
        </div>
    );
}

export default VerifyEmail;