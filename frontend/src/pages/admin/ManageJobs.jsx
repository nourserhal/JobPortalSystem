import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
function ManageJobs() {
    const API_URL = "http://localhost:5234/api/jobs";

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.log(error);
            alert("Error fetching jobs");
        }
    }

    async function updateJobStatus(id) {
        let finalReason = null;

        if (selectedStatus === "Rejected") {
            finalReason =
                rejectionReason === "Other"
                    ? customReason
                    : rejectionReason;

            if (!finalReason || finalReason.trim() === "") {
                alert("Please select or type a rejection reason.");
                return;
            }
        }

        try {
            const response = await fetch(`${API_URL}/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: selectedStatus,
                    rejectionReason: finalReason,
                }),
            });

            if (response.ok) {
                alert(`Job changed to ${selectedStatus}`);

                setSelectedJobId(null);
                setSelectedStatus("");
                setRejectionReason("");
                setCustomReason("");

                fetchJobs();
            } else {
                alert("Failed to update job");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    async function deleteJob(id) {
        if (!window.confirm("Delete this job?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Job deleted");
                fetchJobs();
            } else {
                alert("Failed to delete job");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }
    function getCompetitionLevel(count) {
        if (count <= 5) {
            return {
                text: "Low Competition",
                className: "competition-low",
            };
        }

        if (count <= 15) {
            return {
                text: "Medium Competition",
                className: "competition-medium",
            };
        }

        return {
            text: "High Competition",
            className: "competition-high",
        };
    }

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title?.toLowerCase().includes(search.toLowerCase()) ||
            job.company?.toLowerCase().includes(search.toLowerCase()) ||
            job.location?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || job.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout activePage="manageJobs">
            <div className="admin-dashboard">
                <h1>Manage Jobs</h1>
                <p>View, approve, reject, close, activate, and remove job posts.</p>

                <div className="admin-panel">
                    <div className="admin-filters">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <p className="showing-text">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Competition Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No jobs found.</td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>
                                            <button
                                                className="table-link-btn"
                                                onClick={() => navigate(`/admin/jobs/${job.id}`)}
                                            >
                                                {job.title || "Untitled Job"}
                                            </button>
                                        </td>
                                        <td>{job.company}</td>
                                        <td>{job.location}</td>
                                        <td>{job.category}</td>

                                        <td>
                                            <span
                                                className={`status-badge ${job.status?.toLowerCase()}`}
                                            >
                                                {job.status}
                                            </span>

                                            {job.status === "Rejected" &&
                                                job.rejectionReason && (
                                                    <p className="rejection-reason">
                                                        Reason: {job.rejectionReason}
                                                    </p>
                                                )}
                                        </td>
                                        <td>
                                            {(() => {
                                                const competition = getCompetitionLevel(
                                                    job.applicantsCount || 0
                                                );

                                                return (
                                                    <span
                                                        className={`competition-badge ${competition.className}`}
                                                    >
                                                        {competition.text}
                                                    </span>
                                                );
                                            })()}
                                        </td>

                                        <td>
                                            <div className="admin-job-actions">
                                                <select
                                                    className="status-action-select"
                                                    value={
                                                        selectedJobId === job.id
                                                            ? selectedStatus
                                                            : ""
                                                    }
                                                    onChange={(e) => {
                                                        setSelectedJobId(job.id);
                                                        setSelectedStatus(e.target.value);

                                                        if (e.target.value !== "Rejected") {
                                                            setRejectionReason("");
                                                            setCustomReason("");
                                                        }
                                                    }}
                                                >
                                                    <option value="">Change status</option>
                                                        {job.status === "Pending" && (
                                                            <>
                                                                <option value="Active">Approve</option>
                                                                <option value="Rejected">Reject</option>
                                                            </>
                                                        )}

                                                        {job.status === "Active" && (
                                                            <>
                                                                <option value="Closed">Close</option>
                                                                <option value="Pending">Resubmit Review</option>
                                                            </>
                                                        )}

                                                        {job.status === "Closed" && (
                                                            <>
                                                                <option value="Active">Activate</option>
                                                                <option value="Pending">Set Pending</option>
                                                            </>
                                                        )}

                                                        {job.status === "Rejected" && (
                                                            <option value="Pending">
                                                                Set Pending
                                                            </option>
                                                        )}
                                                </select>

                                                {selectedJobId === job.id &&
                                                    selectedStatus === "Rejected" && (
                                                        <div className="reject-reason-box">
                                                            <select
                                                                value={rejectionReason}
                                                                onChange={(e) =>
                                                                    setRejectionReason(e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select reason</option>
                                                                <option value="Spam">Spam</option>
                                                                <option value="Duplicate Job">
                                                                    Duplicate Job
                                                                </option>
                                                                <option value="Incomplete Information">
                                                                    Incomplete Information
                                                                </option>
                                                                <option value="Fake Job">
                                                                    Fake Job
                                                                </option>
                                                                <option value="Wrong Category">
                                                                    Wrong Category
                                                                </option>
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
                                                        </div>
                                                    )}

                                                {selectedJobId === job.id && selectedStatus && (
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => updateJobStatus(job.id)}
                                                    >
                                                        Save
                                                    </button>
                                                )}

                                                <button
                                                    className="delete-action"
                                                    onClick={() => deleteJob(job.id)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ManageJobs;