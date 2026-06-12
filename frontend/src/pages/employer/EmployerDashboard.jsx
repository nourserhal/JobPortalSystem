import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "../../components/employer/EmployerLayout";

function EmployerDashboard() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const JOBS_API = `http://localhost:5234/api/jobs/employer/${loggedInUser.id}`;
    const APPLICATIONS_API = "http://localhost:5234/api/Applications";

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const jobsResponse = await fetch(JOBS_API);
            const jobsData = await jobsResponse.json();

            setJobs(jobsData);

            let allApplications = [];

            for (const job of jobsData) {
                const appsResponse = await fetch(`${APPLICATIONS_API}/job/${job.id}`);
                const appsData = await appsResponse.json();

                const appsWithJob = appsData.map((app) => ({
                    ...app,
                    jobTitle: job.title,
                }));

                allApplications = [...allApplications, ...appsWithJob];
            }

            setApplications(allApplications);
        } catch (error) {
            console.log("Error fetching dashboard data:", error);
        }
    }

    const activeJobs = jobs.filter((job) => job.status === "Active");
    const hiredApplicants = applications.filter((app) => app.status === "Accepted");

    return (
        <EmployerLayout activePage="dashboard">
            <div className="stats-grid">
                <div className="stat-card blue">
                    <p>Active Jobs</p>
                    <h2>{activeJobs.length}</h2>
                    <span>↗ From database</span>
                </div>

                <div className="stat-card green">
                    <p>Total Applicants</p>
                    <h2>{applications.length}</h2>
                    <span>↗ From database</span>
                </div>

                <div className="stat-card purple">
                    <p>Hired</p>
                    <h2>{hiredApplicants.length}</h2>
                    <span>↗ Accepted applicants</span>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Recent Job Posts</h3>
                            <p>Your latest job postings</p>
                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/employer/manage-jobs")}
                        >
                            View all
                        </button>
                    </div>

                    <div className="job-list">
                        {jobs.length === 0 ? (
                            <p>No jobs posted yet.</p>
                        ) : (
                            jobs.slice(0, 3).map((job) => (
                                <div className="job-row" key={job.id}>
                                    <div className="job-icon">💼</div>

                                    <div>
                                        <h4>{job.title}</h4>
                                        <p>{job.location} · {job.type}</p>
                                    </div>

                                    <span className={`status-badge ${job.status?.toLowerCase()}`}>
                                        {job.status || "Active"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h3>Recent Applications</h3>
                            <p>Latest candidate applications</p>
                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/employer/manage-jobs")}
                        >
                            View all
                        </button>
                    </div>

                    <div className="job-list">
                        {applications.length === 0 ? (
                            <p>No applications yet.</p>
                        ) : (
                            applications.slice(0, 3).map((app) => (
                                <div className="application-row" key={app.id}>
                                    <div className="candidate-avatar">
                                        {app.applicantName?.charAt(0).toUpperCase() || "A"}
                                    </div>

                                    <div>
                                        <h4>{app.applicantName}</h4>
                                        <p>{app.jobTitle}</p>
                                    </div>

                                    <span className="time-text">{app.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <section className="dashboard-panel quick-actions">
                <h3>Quick Actions</h3>
                <p>Common tasks to get you started</p>

                <div className="quick-actions-grid">
                    <button onClick={() => navigate("/employer/post-job")}>
                        ➕ Post New Job
                    </button>

                    <button onClick={() => navigate("/employer/review-applications")}>
                        👥 Review Applications
                    </button>

                    <button onClick={() => navigate("/employer/company-profile")}>
                        🏢 Company Settings
                    </button>
                </div>
            </section>
        </EmployerLayout>
    );
}

export default EmployerDashboard;