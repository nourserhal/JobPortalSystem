import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (step !== 2 || seconds <= 0) return;

        const timer = setTimeout(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [seconds, step]);

    async function handleSendCode(e) {
        if (e) e.preventDefault();

        if (!email.trim()) {
            alert("Please enter your email");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5234/api/Login/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            if (response.ok) {
                alert("Reset code sent to your email");
                setStep(2);
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

    async function handleResetPassword(e) {
        e.preventDefault();

        if (!code.trim() || !newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5234/api/Login/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                        newPassword,
                    }),
                }
            );

            if (response.ok) {
                alert("Password reset successfully");
                navigate("/");
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
                <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>

                {step === 1 ? (
                    <form onSubmit={handleSendCode}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button type="submit">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <p>
                            OTP sent to:
                            <br />
                            <strong>{email}</strong>
                        </p>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                        <button type="submit">
                            Reset Password
                        </button>
<br /><br />
                        <button
                            type="button"
                            disabled={seconds > 0}
                            onClick={() => handleSendCode()}
                        >
                            {seconds > 0
                                ? `Resend code in ${seconds}s`
                                : "Resend code"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;