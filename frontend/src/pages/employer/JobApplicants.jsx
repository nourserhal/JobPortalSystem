import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerLayout from "../../components/employer/EmployerLayout";

function JobApplicants() {
    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const API_URL = "http://localhost:5234/api/Applications";
    const JOBS_API = "http://localhost:5234/api/jobs";
    const USERS_API = "http://localhost:5234/api/User";

    useEffect(() => {
        fetchApplications();
        fetchJob();
        fetchUsers();
    }, []);

    async function fetchApplications() {
        try {
            const response = await fetch(`${API_URL}/job/${jobId}`);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.log(error);
            alert("Error fetching applications");
        }
    }

    async function fetchJob() {
        try {
            const response = await fetch(JOBS_API);
            const data = await response.json();

            const selectedJob = data.find(
                (item) => item.id === Number(jobId)
            );

            setJob(selectedJob);
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

    const fileUrl = resumeUrl.startsWith("http")
        ? resumeUrl
        : `http://localhost:5234/uploads/${resumeUrl}`;

    window.open(fileUrl, "_blank");
}

    async function updateApplicationStatus(id, newStatus) {
        try {
            const response = await fetch(`${API_URL}/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStatus),
            });

            if (response.ok) {
                alert("Application status updated");
                fetchApplications();

                if (selectedApplicant?.id === id) {
                    setSelectedApplicant({
                        ...selectedApplicant,
                        status: newStatus,
                    });
                }
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }
    function getApplicantMatch(applicantEmail) {
        if (!job) {
            return {
                score: 0,
                missingSkills: [],
            };
        }

        const applicant = users.find(
            (u) => u.email === applicantEmail
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

        const jobSkills = (job.skills || "")
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
                : Math.round(
                    (matchedSkills.length / jobSkills.length) * 100
                );

        return {
            score,
            missingSkills,
        };
    }

    return (
        <EmployerLayout activePage="manageJobs">
            <div className="applicants-page">
                <div className="applicants-header">
                    <div>
                        <h1>Applications Overview</h1>
                        <p>Review applicants for this job post</p>
                    </div>
                </div>

                <div className="applicants-card">
                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-table">
                                        No applications yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <strong>{app.applicantName}</strong>

                                            {(() => {
                                                const match = getApplicantMatch(app.applicantEmail);

                                                return (
                                                    <div className="applicant-match-box">
                                                        <span>{match.score}% Match</span>

                                                        {match.missingSkills.length > 0 && (
                                                            <small>
                                                                Missing:{" "}
                                                                {match.missingSkills
                                                                    .slice(0, 6)
                                                                    .join(", ")}
                                                            </small>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td>{app.applicantEmail}</td>

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
                                            <div className="applicant-actions">
                                                <button
                                                    className="resume-btn"
                                                    onClick={() => openResume(app.resumeUrl)}
                                                >
                                                    Resume
                                                </button>

                                                <button
                                                    className="view-profile-btn"
                                                    onClick={() =>
                                                        setSelectedApplicant(app)
                                                    }
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedApplicant && (
                    <div className="modal-overlay">
                        <div className="applicant-modal">
                            <div className="modal-header">
                                <h2>Applicant Profile</h2>

                                <button
                                    className="modal-close"
                                    onClick={() => setSelectedApplicant(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="applicant-profile-main">
                                <div className="big-avatar">
                                    {selectedApplicant.applicantName
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3>{selectedApplicant.applicantName}</h3>
                                    <p>{selectedApplicant.applicantEmail}</p>
                                </div>
                            </div>
                            {(() => {
                                const match = getApplicantMatch(selectedApplicant.applicantEmail);

                                return (
                                    <div className="ai-match-box">
                                        <strong>{match.score}% Applicant Match</strong>

                                        {match.missingSkills.length > 0 && (
                                            <p>
                                                Missing Skills: {match.missingSkills.slice(0, 6).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                );
                            })()}

                            <div className="modal-section">
                                <h4>Resume</h4>

                                <button
                                    className="download-resume-btn"
                                    onClick={() =>
                                        openResume(selectedApplicant.resumeUrl)
                                    }
                                >
                                    Download / View Resume
                                </button>
                            </div>
                            <div className="modal-section">
                                <h4>Cover Letter</h4>

                                <div className="cover-letter-box">
                                    {selectedApplicant.coverLetter || "No cover letter submitted."}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h4>Application Status</h4>

                                <select
                                    value={selectedApplicant.status}
                                    onChange={(e) =>
                                        updateApplicationStatus(
                                            selectedApplicant.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}

export default JobApplicants;