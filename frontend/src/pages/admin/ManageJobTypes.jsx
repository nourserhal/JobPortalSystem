import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

function ManageJobTypes() {
    const API_URL = "http://localhost:5234/api/JobTypes";

    const [jobTypes, setJobTypes] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchJobTypes();
    }, []);

    async function fetchJobTypes() {
        const response = await fetch(API_URL);
        const data = await response.json();
        setJobTypes(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            alert("Job type name is required");
            return;
        }

        const jobType = { name };

        if (editingId) {
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobType),
            });

            if (response.ok) {
                alert("Job type updated");
                setEditingId(null);
                setName("");
                fetchJobTypes();
            } else {
                alert("Failed to update job type");
            }
        } else {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobType),
            });

            if (response.ok) {
                alert("Job type added");
                setName("");
                fetchJobTypes();
            } else {
                alert("Failed to add job type");
            }
        }
    }

    function startEdit(jobType) {
        setEditingId(jobType.id);
        setName(jobType.name);
    }

    async function deleteJobType(id) {
        if (!window.confirm("Delete this job type?")) return;

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Job type deleted");
            fetchJobTypes();
        } else {
            alert("Failed to delete job type");
        }
    }

    return (
        <AdminLayout activePage="jobTypes">
            <div className="admin-dashboard">
                <h1>Manage Job Types</h1>
                <p>Add, update, and remove job types.</p>

                <div className="admin-panel">
                    <form className="admin-inline-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Job type name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button type="submit" className="approve-btn">
                            {editingId ? "Update Job Type" : "Add Job Type"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="reject-btn"
                                onClick={() => {
                                    setEditingId(null);
                                    setName("");
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Job Type Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobTypes.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No job types found.</td>
                                </tr>
                            ) : (
                                jobTypes.map((jobType) => (
                                    <tr key={jobType.id}>
                                        <td>{jobType.id}</td>
                                        <td>{jobType.name}</td>
                                        <td>
                                            <div className="admin-actions-row">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => startEdit(jobType)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        deleteJobType(jobType.id)
                                                    }
                                                >
                                                    Delete
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

export default ManageJobTypes;