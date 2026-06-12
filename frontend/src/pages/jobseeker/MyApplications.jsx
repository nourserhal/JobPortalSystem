import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobseekerLayout from "../../components/jobseeker/JobseekerLayout";

function MyApplications() {
    const navigate = useNavigate();

    const API_URL = "http://localhost:5234/api/Applications";

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

    useEffect(() => {
        fetchApplications();
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const response = await fetch(
                "http://localhost:5234/api/jobs"
            );

            const data = await response.json();

            setJobs(data);
        } catch (error) {
            console.log(error);
        }
    }
    async function fetchApplications() {
        const response = await fetch(API_URL);
        const data = await response.json();

        const myApps = data.filter(
            (app) => app.applicantEmail === loggedInUser?.email
        );

        setApplications(myApps);
    }

    function openResume(resumeUrl) {
        if (!resumeUrl) {
            alert("No resume uploaded.");
            return;
        }

        window.open(
            `http://localhost:5234/uploads/${resumeUrl}`,
            "_blank"
        );
    }

    async function withdrawApplication(app) {
        if (
            app.status === "Accepted" ||
            app.status === "Rejected"
        ) {
            alert("You cannot withdraw an application after it is accepted or rejected.");
            return;
        }

        if (!window.confirm("Withdraw this application?")) return;

        try {
            const response = await fetch(`${API_URL}/${app.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Application withdrawn.");
                fetchApplications();
            } else {
                alert("Failed to withdraw application.");
            }
        } catch (error) {
            console.log(error);
            alert("Server error.");
        }
    }

    return (
        <JobseekerLayout activePage="applications">
            <div className="my-applications-page">
                <h1>My Applications</h1>
                <p>Track the status of jobs you applied to.</p>

                <div className="my-applications-card">
                    <table className="my-applications-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th>Resume</th>
                                <th>Cover Letter</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No applications yet.</td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id}>
                                        <td>{app.job?.title || "Unknown Job"}</td>

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
                                            {app.resumeUrl ? (
                                                <button
                                                    className="resume-btn"
                                                    onClick={() => openResume(app.resumeUrl)}
                                                >
                                                    View Resume
                                                </button>
                                            ) : (
                                                "No resume"
                                            )}
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
                                                View Letter
                                            </button>
                                        </td>

                                        <td>
                                            <div className="admin-actions-row">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() =>
                                                        navigate(`/job/${app.jobId}`)
                                                    }
                                                >
                                                    View Job
                                                </button>

                                                {app.status !== "Accepted" &&
                                                    app.status !== "Rejected" && (
                                                        <button
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                withdrawApplication(app)
                                                            }
                                                        >
                                                            Withdraw
                                                        </button>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedCoverLetter && (
                <div className="modal-overlay">
                    <div className="applicant-modal">
                        <div className="modal-header">
                            <h2>My Cover Letter</h2>

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
        </JobseekerLayout>
    );
}

export default MyApplications;