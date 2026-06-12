import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

function ManageApplications() {
    const navigate = useNavigate();

    const API_URL = "http://localhost:5234/api/Applications";
    const USERS_API = "http://localhost:5234/api/User";

    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchApplications();
        fetchUsers();
    }, []);

    async function fetchApplications() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUsers() {
        try {
            const response = await fetch(USERS_API);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    function openResume(resumeUrl) {
        if (!resumeUrl) {
            alert("No resume uploaded.");
            return;
        }

        window.open(`http://localhost:5234/uploads/${resumeUrl}`, "_blank");
    }

    function goToApplicantProfile(app) {
        const appEmail = (app.applicantEmail || "").trim().toLowerCase();

        const applicant = users.find(
            (user) => (user.email || "").trim().toLowerCase() === appEmail
        );

        if (!applicant) {
            alert("This applicant account was deleted.");
            return;
        }

        navigate(`/admin/users/${applicant.id}`);
    }

    function goToJobDetails(app) {
        const jobId = app.jobId || app.job?.id;

        if (!jobId) {
            alert("Job details not found.");
            return;
        }

        navigate(`/admin/jobs/${jobId}`);
    }

    async function deleteApplication(id) {
        if (!window.confirm("Delete this application?")) return;

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Application deleted");
            fetchApplications();
        } else {
            alert("Failed to delete application");
        }
    }

    function generateSuggestions(value) {
        if (!value || value.trim().length < 1) {
            setSuggestions([]);
            return;
        }

        const keyword = value.toLowerCase();

        const results = applications
            .flatMap((app) => [
                app.applicantName,
                app.applicantEmail,
                app.job?.title,
                app.jobTitle,
            ])
            .filter(Boolean)
            .filter((item) =>
                item.toLowerCase().includes(keyword)
            )
            .filter((item, index, array) => array.indexOf(item) === index)
            .slice(0, 6);

        setSuggestions(results);
    }
    const filteredApplications = applications.filter((app) => {
        const jobTitle = app.job?.title || app.jobTitle || "";

        const matchesSearch =
            app.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
            app.applicantEmail?.toLowerCase().includes(search.toLowerCase()) ||
            jobTitle.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout activePage="applications">
            <div className="admin-dashboard">
                <h1>Manage Applications</h1>
                <p>Monitor all job applications across the platform.</p>

                <div className="admin-panel">
                    <div className="admin-filters">
                        <div className="admin-search-box">
                            <input
                                type="text"
                                placeholder="Search applicants or jobs..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    generateSuggestions(e.target.value);
                                }}
                            />

                            {suggestions.length > 0 && (
                                <div className="admin-search-suggestions">
                                    {suggestions.map((item, index) => (
                                        <button
                                            type="button"
                                            key={`${item}-${index}`}
                                            onClick={() => {
                                                setSearch(item);
                                                setSuggestions([]);
                                            }}
                                        >
                                            🔎 {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Applied">Applied</option>
                            <option value="In Review">In Review</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <p className="showing-text">
                        Showing {filteredApplications.length} of{" "}
                        {applications.length} applications
                    </p>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Email</th>
                                <th>Job Title</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th>Resume</th>
                                <th>Cover Letter</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="8">No applications found.</td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => {
                                    const jobTitle =
                                        app.job?.title ||
                                        app.jobTitle ||
                                        "View Job";

                                    return (
                                        <tr key={app.id}>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="table-link-btn"
                                                    onClick={() =>
                                                        goToApplicantProfile(app)
                                                    }
                                                >
                                                    {app.applicantName ||
                                                        "View Applicant"}
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="table-link-btn"
                                                    onClick={() =>
                                                        goToApplicantProfile(app)
                                                    }
                                                >
                                                    {app.applicantEmail ||
                                                        "No email"}
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="table-link-btn"
                                                    onClick={() =>
                                                        goToJobDetails(app)
                                                    }
                                                >
                                                    {jobTitle}
                                                </button>
                                            </td>

                                            <td>
                                                <span
                                                    className={`application-status ${app.status
                                                        ?.toLowerCase()
                                                        .replace(" ", "-")}`}
                                                >
                                                    {app.status || "N/A"}
                                                </span>
                                            </td>

                                            <td>
                                                {app.appliedDate
                                                    ? new Date(
                                                          app.appliedDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                <button
                                                    className="resume-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        openResume(app.resumeUrl)
                                                    }
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="resume-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCoverLetter(
                                                            app.coverLetter || "No cover letter submitted."
                                                        )
                                                    }
                                                >
                                                    View Letter
                                                </button>
                                            </td>

                                            <td>
                                                <button
                                                    className="reject-btn"
                                                    type="button"
                                                    onClick={() =>
                                                        deleteApplication(app.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedCoverLetter && (
                <div className="modal-overlay">
                    <div className="applicant-modal">
                        <div className="modal-header">
                            <h2>Cover Letter</h2>

                            <button
                                className="modal-close"
                                onClick={() => setSelectedCoverLetter(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="cover-letter-box">
                            {selectedCoverLetter}
                        </div>
                    </div>
                </div>
)}
        </AdminLayout>
    );
}

export default ManageApplications;