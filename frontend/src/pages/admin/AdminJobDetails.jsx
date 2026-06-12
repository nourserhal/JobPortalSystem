import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

function AdminJobDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = "http://localhost:5234/api/jobs";
    const CATEGORIES_API = "http://localhost:5234/api/JobCategories";

    const [job, setJob] = useState(null);
    const [categories, setCategories] = useState([]);

    const [showRejectBox, setShowRejectBox] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const [showCategorySelect, setShowCategorySelect] = useState(false);
    const [replacementCategory, setReplacementCategory] = useState("");

    useEffect(() => {
        fetchJob();
        fetchCategories();
    }, []);

    async function fetchJob() {
        const response = await fetch(API_URL);
        const data = await response.json();
        const selectedJob = data.find((item) => item.id === Number(id));
        setJob(selectedJob);
    }

    async function fetchCategories() {
        const response = await fetch(CATEGORIES_API);
        const data = await response.json();
        setCategories(data);
    }

    async function updateJobCategory(newCategory, requestedCategoryValue) {
        const updatedJob = {
            ...job,
            category: newCategory,
            requestedCategory: requestedCategoryValue,
        };

        const response = await fetch(`${API_URL}/${job.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedJob),
        });

        if (response.ok) {
            alert("Job category updated");
            fetchJob();
            setShowCategorySelect(false);
            setReplacementCategory("");
        } else {
            alert("Failed to update category");
        }
    }

    async function approveRequestedCategory() {
        if (!job.requestedCategory) return;

        const response = await fetch(CATEGORIES_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: job.requestedCategory,
            }),
        });

        if (response.ok) {
            await updateJobCategory(job.requestedCategory, null);
            alert("Requested category approved and added.");
        } else {
            alert("Failed to approve requested category.");
        }
    }

    function rejectRequestedCategory() {
        setShowCategorySelect(true);
    }

    async function updateStatus(status) {
        if (status === "Active" && job.category === "Other" && job.requestedCategory) {
            alert("You must approve the requested category or assign an existing category before approving this job.");
            return;
        }

        const response = await fetch(`${API_URL}/${job.id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status,
                rejectionReason: null,
            }),
        });

        if (response.ok) {
            alert(`Job changed to ${status}`);
            navigate("/admin/dashboard");
        }
    }

    async function rejectJob() {
        const finalReason =
            rejectionReason === "Other" ? customReason : rejectionReason;

        if (!finalReason || finalReason.trim() === "") {
            alert("Please select or type a rejection reason.");
            return;
        }

        const response = await fetch(`${API_URL}/${job.id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "Rejected",
                rejectionReason: finalReason,
            }),
        });

        if (response.ok) {
            alert("Job rejected");
            navigate("/admin/dashboard");
        } else {
            alert("Failed to reject job");
        }
    }

    if (!job) {
        return (
            <AdminLayout activePage="manageJobs">
                <p>Loading job details...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="manageJobs">
            <div className="job-details-page">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="job-details-card">
                    <div className="job-details-header">
                        <div>
                            <h1>{job.title || "Untitled Job"}</h1>
                            <p>{job.company || "Unknown company"}</p>
                        </div>

                        <span className={`status-badge ${job.status?.toLowerCase()}`}>
                            {job.status || "No status"}
                        </span>
                    </div>

                    <div className="job-details-tags">
                        <span>📍 {job.location || "No location"}</span>
                        <span>💼 {job.type || "No type"}</span>
                        <span>🏷️ {job.category || "No category"}</span>
                    </div>

                    {job.requestedCategory && (
                        <div className="admin-rejection-box">
                            <h3>Requested Category</h3>
                            <p>{job.requestedCategory}</p>

                            <div className="admin-review-actions">
                                <button
                                    className="approve-btn"
                                    onClick={approveRequestedCategory}
                                >
                                    Approve Category
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={rejectRequestedCategory}
                                >
                                    Reject Category
                                </button>
                            </div>

                            {showCategorySelect && (
                                <div className="reject-reason-box">
                                    <select
                                        value={replacementCategory}
                                        onChange={(e) =>
                                            setReplacementCategory(e.target.value)
                                        }
                                    >
                                        <option value="">Choose existing category</option>

                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="approve-btn"
                                        onClick={() => {
                                            if (!replacementCategory) {
                                                alert("Please choose a category.");
                                                return;
                                            }

                                            updateJobCategory(replacementCategory, null);
                                        }}
                                    >
                                        Save Category
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="job-details-salary">
                        <h3>Salary Range</h3>
                        <p>${job.salaryMin || 0} - ${job.salaryMax || 0}</p>
                    </div>

                    <div className="job-details-section">
                        <h3>Job Description</h3>
                        <p>{job.description || "No description provided."}</p>
                    </div>

                    <div className="job-details-section">
                        <h3>Requirements</h3>
                        <p>{job.requirements || "No requirements provided."}</p>
                    </div>

                    <div className="job-details-section">
                        <h3>Skills</h3>
                        <p>{job.skills || "No skills provided."}</p>
                    </div>

                    {job.status === "Rejected" && job.rejectionReason && (
                        <div className="admin-rejection-box">
                            <h3>Current Rejection Reason</h3>
                            <p>{job.rejectionReason}</p>
                        </div>
                    )}

                    <div className="admin-review-box">
                        <h3>Admin Review</h3>

                        <div className="admin-review-actions">
                            {job.status === "Pending" && (
                                <>
                                    <button
                                        className="approve-btn"
                                        onClick={() => updateStatus("Active")}
                                    >
                                        Approve Job
                                    </button>

                                    <button
                                        className="reject-btn"
                                        onClick={() => setShowRejectBox(true)}
                                    >
                                        Reject Job
                                    </button>
                                </>
                            )}

                            {job.status === "Active" && (
                                <>
                                    <button
                                        className="approve-btn"
                                        onClick={() => updateStatus("Closed")}
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="reject-btn"
                                        onClick={() => updateStatus("Pending")}
                                    >
                                        Set Pending
                                    </button>
                                </>
                            )}

                            {job.status === "Closed" && (
                                <>
                                    <button
                                        className="approve-btn"
                                        onClick={() => updateStatus("Active")}
                                    >
                                        Activate
                                    </button>

                                    <button
                                        className="reject-btn"
                                        onClick={() => updateStatus("Pending")}
                                    >
                                        Set Pending
                                    </button>
                                </>
                            )}

                            {job.status === "Rejected" && (
                                <button
                                    className="approve-btn"
                                    onClick={() => updateStatus("Pending")}
                                >
                                    Resubmit Review
                                </button>
                            )}
                        </div>

                        {showRejectBox && (
                            <div className="reject-reason-box">
                                <select
                                    value={rejectionReason}
                                    onChange={(e) => {
                                        setRejectionReason(e.target.value);
                                        setCustomReason("");
                                    }}
                                >
                                    <option value="">Select reason</option>
                                    <option value="Spam">Spam</option>
                                    <option value="Duplicate Job">Duplicate Job</option>
                                    <option value="Incomplete Information">
                                        Incomplete Information
                                    </option>
                                    <option value="Fake Job">Fake Job</option>
                                    <option value="Wrong Category">Wrong Category</option>
                                    <option value="Other">Other</option>
                                </select>

                                {rejectionReason === "Other" && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom reason"
                                        value={customReason}
                                        onChange={(e) =>
                                            setCustomReason(e.target.value)
                                        }
                                    />
                                )}

                                <button className="reject-btn" onClick={rejectJob}>
                                    Confirm Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminJobDetails;