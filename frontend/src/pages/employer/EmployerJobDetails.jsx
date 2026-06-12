import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmployerLayout from "../../components/employer/EmployerLayout";

function EmployerJobDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const JOBS_API = "http://localhost:5234/api/jobs";
    const APPLICATIONS_API = "http://localhost:5234/api/Applications";

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchJob();
        fetchApplications();
    }, []);

    async function fetchJob() {
        const response = await fetch(JOBS_API);
        const data = await response.json();

        const selectedJob = data.find((item) => item.id === Number(id));
        setJob(selectedJob);
    }

    async function fetchApplications() {
        const response = await fetch(APPLICATIONS_API);
        const data = await response.json();

        const jobApplications = data.filter(
            (app) => app.jobId === Number(id)
        );

        setApplications(jobApplications);
    }

    if (!job) {
        return (
            <EmployerLayout activePage="manageJobs">
                <p>Loading job details...</p>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout activePage="manageJobs">
            <div className="job-details-page">
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="job-details-card">
                    <div className="job-details-header">
                        <div>
                            <h1>{job.title || "Untitled Job"}</h1>
                            <p>{job.company || "Unknown company"}</p>
                        </div>

                        <span
                            className={`status-badge ${job.status?.toLowerCase()}`}
                        >
                            {job.status || "No status"}
                        </span>
                    </div>

                    {job.status === "Rejected" && job.rejectionReason && (
                        <div className="rejection-message-box">
                            <h4>Rejection Reason</h4>
                            <p>{job.rejectionReason}</p>
                            <span>Edit and resubmit your job post.</span>
                        </div>
                    )}

                    <div className="job-details-tags">
                        <span>📍 {job.location || "No location"}</span>
                        <span>💼 {job.type || "No type"}</span>
                        <span>🏷️ {job.category || "No category"}</span>
                    </div>

                    <div className="job-details-salary">
                        <h3>Applicants</h3>
                        <p>{applications.length} applicant(s)</p>

                        <button
                            className="applicants-btn"
                            onClick={() =>
                                navigate(`/employer/jobs/${job.id}/applicants`)
                            }
                        >
                            View Applicants
                        </button>
                    </div>

                    <div className="job-details-salary">
                        <h3>Salary Range</h3>
                        <p>
                            ${job.salaryMin || 0} - ${job.salaryMax || 0}
                        </p>
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
                </div>
            </div>
        </EmployerLayout>
    );
}

export default EmployerJobDetails;