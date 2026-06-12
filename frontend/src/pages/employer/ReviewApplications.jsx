import { useEffect, useState } from "react";
import EmployerLayout from "../../components/employer/EmployerLayout";

function ReviewApplications() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const JOBS_API = `http://localhost:5234/api/jobs/employer/${loggedInUser.id}`;
    const APPLICATIONS_API = "http://localhost:5234/api/Applications";
    const USERS_API = "http://localhost:5234/api/User";

    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

    useEffect(() => {
        fetchEmployerApplications();
        fetchUsers();
    }, []);
    async function fetchUsers() {
        const response = await fetch(USERS_API);
        const data = await response.json();
        setUsers(data);
    }

    async function fetchEmployerApplications() {
        const jobsResponse = await fetch(JOBS_API);
        const jobsData = await jobsResponse.json();

        let allApplications = [];

        for (const job of jobsData) {
            const appsResponse = await fetch(`${APPLICATIONS_API}/job/${job.id}`);
            const appsData = await appsResponse.json();

            const appsWithJob = appsData.map((app) => ({
                ...app,
                jobTitle: job.title,
                jobLocation: job.location,
                jobType: job.type,
                jobSkills: job.skills,
            }));

            allApplications = [...allApplications, ...appsWithJob];
        }

        setApplications(allApplications);
    }
    function getApplicantMatch(app) {
        const applicant = users.find(
            (u) => u.email === app.applicantEmail
        );

        if (!applicant) {
            return {
                score: 0,
                missingSkills: [],
            };
        }

        const applicantSkills = (applicant.skills || "")
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const jobSkills = (app.jobSkills || app.job?.skills ||  "")
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const matchedSkills = jobSkills.filter((skill) =>
            applicantSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(
            (skill) => !applicantSkills.includes(skill)
        );

        const score =
            jobSkills.length === 0
                ? 0
                : Math.round((matchedSkills.length / jobSkills.length) * 100);

        return {
            score,
            missingSkills,
        };
    }

    async function updateApplicationStatus(id, newStatus) {
        const response = await fetch(`${APPLICATIONS_API}/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newStatus),
        });

        if (response.ok) {
            alert("Application status updated");
            fetchEmployerApplications();
        } else {
            alert("Failed to update status");
        }
    }

    function openResume(resumeUrl) {
        if (!resumeUrl) {
            alert("No resume uploaded.");
            return;
        }

        window.open(`http://localhost:5234/uploads/${resumeUrl}`, "_blank");
    }

    const filteredApplications = applications.filter((app) => {
        const matchesStatus =
            statusFilter === "All" || app.status === statusFilter;

        const matchesSearch =
            app.applicantName?.toLowerCase().includes(search.toLowerCase()) ||
            app.applicantEmail?.toLowerCase().includes(search.toLowerCase()) ||
            app.jobTitle?.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <EmployerLayout activePage="reviewApplications">
            <div className="manage-jobs-page">
                <div className="manage-jobs-header">
                    <div>
                        <h1>Review Applications</h1>
                        <p>View and manage all applications for your job posts</p>
                    </div>
                </div>

                <div className="manage-jobs-card">
                    <div className="manage-filters">
                        <input
                            type="text"
                            placeholder="Search applicant or job..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

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
                        Showing {filteredApplications.length} of {applications.length} applications
                    </p>

                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Job</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th>Resume</th>
                                <th>Cover Letter</th>
                                <th>Change Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-table">
                                        No applications found.
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <strong>{app.applicantName}</strong>
                                            <p>{app.applicantEmail}</p>

                                            {(() => {
                                                const match = getApplicantMatch(app);

                                                return (
                                                    <div className="applicant-match-box">
                                                        <span>{match.score}% Match</span>

                                                        {match.missingSkills.length > 0 ? (
                                                            <small>
                                                                Missing : {match.missingSkills.slice(0,6).join(", ")}
                                                            </small>
                                                        ):(
                                                            <small>All skills matched</small>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>

                                        <td>
                                            <strong>{app.jobTitle}</strong>
                                            <p>{app.jobLocation} · {app.jobType}</p>
                                        </td>

                                        <td>
                                            <span
                                                className={`application-status ${app.status
                                                    ?.toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(app.appliedDate).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <button
                                                className="resume-btn"
                                                onClick={() => openResume(app.resumeUrl)}
                                            >
                                                Resume
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="resume-btn"
                                                onClick={() =>
                                                    setSelectedCoverLetter(
                                                        app.coverLetter || "No cover letter submitted."
                                                    )
                                                }
                                            >
                                                Cover Letter
                                            </button>
                                        </td>

                                        <td>
                                            <select
                                                value={app.status}
                                                onChange={(e) =>
                                                    updateApplicationStatus(
                                                        app.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Applied">Applied</option>
                                                <option value="In Review">In Review</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
                </div>
            </div>
        </EmployerLayout>
    );
}

export default ReviewApplications;