import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";

function AdminUserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = "http://localhost:5234/api/User";

    const [user, setUser] = useState(null);
    const [showBlockBox, setShowBlockBox] = useState(false);
    const [blockReason, setBlockReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        const response = await fetch(API_URL);
        const data = await response.json();

        const selectedUser = data.find((item) => item.id === Number(id));
        setUser(selectedUser);
    }

    async function blockUser() {
        const finalReason =
            blockReason === "Other" ? customReason : blockReason;

        if (!finalReason || finalReason.trim() === "") {
            alert("Please select or type a block reason.");
            return;
        }

        const updatedUser = {
            ...user,
            isBlocked: true,
            blockReason: finalReason,
        };

        const response = await fetch(`${API_URL}/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            alert("User blocked");
            navigate("/admin/users");
        } else {
            alert("Failed to block user");
        }
    }

    async function unblockUser() {
        const updatedUser = {
            ...user,
            isBlocked: false,
            blockReason: null,
        };

        const response = await fetch(`${API_URL}/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            alert("User unblocked");
            navigate("/admin/users");
        } else {
            alert("Failed to unblock user");
        }
    }

    function openResume() {
        if (!user?.cvName) {
            alert("No CV uploaded.");
            return;
        }

        window.open(`http://localhost:5234/uploads/${user.cvName}`, "_blank");
    }

    function getCleanFileName(fileName) {
        if (!fileName) return "";

        const parts = fileName.split("_");

        if (parts.length > 1) {
            parts.shift();
            return parts.join("_");
        }

        return fileName;
    }

    if (!user) {
        return (
            <AdminLayout activePage="users">
                <p>Loading user details...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="users">
            <div className="company-profile-card">
                <div className="profile-card-header">
                    <h2>User Details</h2>

                    <button
                        className="edit-profile-btn"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>

                <div className="profile-view">
                    <div className="profile-columns">
                        <div>
                            <h3>Account Information</h3>

                            <div className="profile-info-row">
                                <div className="big-avatar">
                                    {(user.fullName ||
                                        user.companyName ||
                                        user.email ||
                                        "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h4>
                                        {user.role === "employer"
                                            ? user.companyName || "Employer"
                                            : user.fullName || "User"}
                                    </h4>

                                    <p>{user.email}</p>
                                    <p>Role: {user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3>Status</h3>

                            <div className="about-company-box">
                                <p>
                                    <strong>Blocked:</strong>{" "}
                                    {user.isBlocked ? "Yes" : "No"}
                                    <br />

                                    <strong>Block Reason:</strong>{" "}
                                    {user.blockReason || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {user.role === "jobseeker" && (
                        <div className="about-company-box">
                            <h3>Jobseeker Information</h3>

                            <p>
                                <strong>Full Name:</strong>{" "}
                                {user.fullName || "N/A"}
                                <br />

                                <strong>Location:</strong>{" "}
                                {user.location || "N/A"}
                                <br />

                                <strong>Skills:</strong>{" "}
                                {user.skills || "N/A"}
                                <br />

                                <strong>Experience:</strong>{" "}
                                {user.experience || "N/A"}
                                <br />

                                <strong>CV:</strong>{" "}
                                {user.cvName ? (
                                    <button
                                        className="resume-link-btn"
                                        onClick={openResume}
                                    >
                                        📄 {getCleanFileName(user.cvName)}
                                    </button>
                                ) : (
                                    "No CV uploaded"
                                )}
                            </p>
                        </div>
                    )}

                    {user.role === "employer" && (
                        <div className="about-company-box">
                            <h3>Employer / Company Information</h3>

                            <p>
                                <strong>HR Name:</strong>{" "}
                                {user.hrName || "N/A"}
                                <br />

                                <strong>Company Name:</strong>{" "}
                                {user.companyName || "N/A"}
                                <br />

                                <strong>Website:</strong>{" "}
                                {user.companyWebsite || "N/A"}
                                <br />

                                <strong>Industry:</strong>{" "}
                                {user.industry || "N/A"}
                                <br />

                                <strong>Company Location:</strong>{" "}
                                {user.companyLocation || "N/A"}
                            </p>
                        </div>
                    )}

                    <div className="admin-review-box">
                        <h3>Admin Action</h3>

                        {!user.isBlocked ? (
                            <>
                                <button
                                    className="reject-btn"
                                    onClick={() => setShowBlockBox(true)}
                                >
                                    Block Account
                                </button>

                                {showBlockBox && (
                                    <div className="reject-reason-box">
                                        <select
                                            value={blockReason}
                                            onChange={(e) => {
                                                setBlockReason(e.target.value);
                                                setCustomReason("");
                                            }}
                                        >
                                            <option value="">
                                                Select block reason
                                            </option>
                                            <option value="Fake account">
                                                Fake account
                                            </option>
                                            <option value="Spam">
                                                Spam
                                            </option>
                                            <option value="Suspicious activity">
                                                Suspicious activity
                                            </option>
                                            <option value="Violates platform rules">
                                                Violates platform rules
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>

                                        {blockReason === "Other" && (
                                            <input
                                                type="text"
                                                placeholder="Enter custom reason"
                                                value={customReason}
                                                onChange={(e) =>
                                                    setCustomReason(e.target.value)
                                                }
                                            />
                                        )}

                                        <button
                                            className="reject-btn"
                                            onClick={blockUser}
                                        >
                                            Confirm Block
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                className="approve-btn"
                                onClick={unblockUser}
                            >
                                Unblock Account
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminUserDetails;