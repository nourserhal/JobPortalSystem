import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const API_URL = "http://localhost:5234/api/jobs";
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

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

    async function updateJobStatus(id, status) {
        try {
            const response = await fetch(`${API_URL}/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(status),
            });

            if (response.ok) {
                alert(`Job ${status}`);
                fetchJobs();
            } else {
                alert("Failed to update job");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    const pendingJobs = jobs.filter((job) => job.status === "Pending");

    return (
    <AdminLayout activePage="dashboard">
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p>Manage system jobs, employers, and jobseekers.</p>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <h3>Total Jobs</h3>
                    <h2>{jobs.length}</h2>
                </div>

                <div className="admin-stat-card">
                    <h3>Pending Jobs</h3>
                    <h2>{pendingJobs.length}</h2>
                </div>

                <div className="admin-stat-card">
                    <h3>Active Jobs</h3>
                    <h2>
                        {
                            jobs.filter(
                                (job) => job.status === "Active"
                            ).length
                        }
                    </h2>
                </div>

                <div className="admin-stat-card">
                    <h3>Rejected Jobs</h3>
                    <h2>
                        {
                            jobs.filter(
                                (job) => job.status === "Rejected"
                            ).length
                        }
                    </h2>
                </div>
            </div>

            <div className="admin-panel">
                <h2>Pending Jobs</h2>

                {pendingJobs.length === 0 ? (
                    <p>No pending jobs.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendingJobs.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.title}</td>
                                    <td>{job.company}</td>
                                    <td>{job.location}</td>
                                    <td>{job.category}</td>

                                    <td>                                       
                                        <button
                                        className="view-details-btn"
                                        onClick={() => navigate(`/admin/jobs/${job.id}`)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    </AdminLayout>
);

}

export default AdminDashboard;