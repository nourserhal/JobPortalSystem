import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "../../components/employer/EmployerLayout";

function ManageJobs() {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const API_URL = `http://localhost:5234/api/jobs/employer/${loggedInUser.id}`;
    const BASE_URL = "http://localhost:5234/api/jobs";
    const APPLICATIONS_URL = "http://localhost:5234/api/Applications";
    const AI_SKILLS_API = "http://localhost:5234/api/Ai/skills";
    const LOCATION_API = "http://localhost:5234/api/Location/search";
    const CATEGORIES_API = "http://localhost:5234/api/JobCategories";
    const JOB_TYPES_API = "http://localhost:5234/api/JobTypes";

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const [editSkillSuggestions, setEditSkillSuggestions] = useState([]);
    const [editLocationSuggestions, setEditLocationSuggestions] = useState([]);

    useEffect(() => {
        fetchJobs();
        fetchApplications();
        fetchFilters();
    }, []);

    async function fetchFilters() {
        try {
            const categoriesResponse = await fetch(CATEGORIES_API);
            const categoriesData = await categoriesResponse.json();

            const jobTypesResponse = await fetch(JOB_TYPES_API);
            const jobTypesData = await jobTypesResponse.json();

            setCategories(categoriesData);
            setJobTypes(jobTypesData);
        } catch (error) {
            console.log(error);
            alert("Error loading categories or job types");
        }
    }

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

    async function fetchApplications() {
        try {
            const response = await fetch(APPLICATIONS_URL);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.log("Error fetching applications:", error);
        }
    }

    function getApplicantsCount(jobId) {
        return applications.filter((app) => app.jobId === jobId).length;
    }

    function openEditModal(job) {
        setSelectedJob({ ...job });
        setEditSkillSuggestions([]);
        setEditLocationSuggestions([]);
        setIsEditOpen(true);
    }

    function handleEditChange(e) {
        const { name, value } = e.target;

        setSelectedJob({
            ...selectedJob,
            [name]: value,
        });
    }

    async function generateEditSkillSuggestions(value) {
        if (!value || value.trim().length < 1) {
            setEditSkillSuggestions([]);
            return;
        }

        try {
            const response = await fetch(AI_SKILLS_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: value,
                    title: selectedJob?.title,
                    category: selectedJob?.category,
                    description: selectedJob?.description,
                    requirements: selectedJob?.requirements,
                }),
            });

            if (!response.ok) {
                setEditSkillSuggestions([]);
                return;
            }

            const data = await response.json();
            setEditSkillSuggestions(data.skills || []);
        } catch (error) {
            console.log(error);
            setEditSkillSuggestions([]);
        }
    }

    async function generateEditLocationSuggestions(value) {
        if (!value || value.trim().length < 2) {
            setEditLocationSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `${LOCATION_API}?query=${encodeURIComponent(value)}`
            );

            if (!response.ok) {
                setEditLocationSuggestions([]);
                return;
            }

            const data = await response.json();
            setEditLocationSuggestions(data);
        } catch (error) {
            console.log(error);
            setEditLocationSuggestions([]);
        }
    }

    function addEditSkill(skill) {
        const currentSkills = selectedJob.skills || "";

        let skillsArray = currentSkills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        const lastSkill = skillsArray[skillsArray.length - 1];

        if (
            lastSkill &&
            skill.toLowerCase().startsWith(lastSkill.toLowerCase()) &&
            lastSkill.toLowerCase() !== skill.toLowerCase()
        ) {
            skillsArray[skillsArray.length - 1] = skill;
        } else if (!skillsArray.includes(skill)) {
            skillsArray.push(skill);
        }

        setSelectedJob({
            ...selectedJob,
            skills: skillsArray.join(", "),
        });
    }

    async function saveEditedJob(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/${selectedJob.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedJob.id,
                    employerId: selectedJob.employerId,
                    title: selectedJob.title,
                    company: selectedJob.company,
                    location: selectedJob.location,
                    type: selectedJob.type,
                    category: selectedJob.category,
                    skills: selectedJob.skills,
                    description: selectedJob.description,
                    requirements: selectedJob.requirements,
                    salaryMin: Number(selectedJob.salaryMin),
                    salaryMax: Number(selectedJob.salaryMax),
                    status: selectedJob.status,
                    rejectionReason: selectedJob.rejectionReason,
                    requestedCategory: selectedJob.requestedCategory,
                }),
            });

            if (response.ok) {
                alert(
                    selectedJob.status === "Rejected"
                        ? "Job resubmitted for admin review"
                        : "Job updated successfully"
                );

                setIsEditOpen(false);
                setSelectedJob(null);
                fetchJobs();
            } else {
                alert("Failed to update job");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    async function updateStatus(id, newStatus) {
        try {
            const response = await fetch(`${BASE_URL}/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus,
                    rejectionReason: null,
                }),
            });

            if (response.ok) {
                alert(`Job changed to ${newStatus}`);
                fetchJobs();
            } else {
                alert("Failed to update job status");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    async function deleteJob(id) {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Job deleted successfully");
                fetchJobs();
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
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
        <EmployerLayout activePage="manageJobs">
            <div className="manage-jobs-page">
                <div className="manage-jobs-header">
                    <div>
                        <h1>Job Management</h1>
                        <p>Manage your job postings and track applications</p>
                    </div>

                    <button
                        className="add-job-btn"
                        onClick={() => navigate("/employer/post-job")}
                    >
                        + Add New Job
                    </button>
                </div>

                <div className="manage-jobs-card">
                    <div className="manage-filters">
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

                    <table className="jobs-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Status</th>
                                <th>Applicants</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-table">
                                        No jobs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>
                                            <strong>{job.title}</strong>
                                        </td>

                                        <td>
                                            <div className="employer-job-status-box">
                                                <span
                                                    className={`status-badge ${job.status?.toLowerCase()}`}
                                                >
                                                    {job.status}
                                                </span>

                                                {job.status === "Rejected" &&
                                                    job.rejectionReason && (
                                                        <div className="rejection-message-box">
                                                            <h4>Rejection Reason</h4>
                                                            <p>{job.rejectionReason}</p>
                                                            <span>Edit and resubmit your job post.</span>
                                                        </div>
                                                    )}
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                className="applicants-btn"
                                                onClick={() =>
                                                    navigate(`/employer/jobs/${job.id}/applicants`)
                                                }
                                            >
                                                👥 {getApplicantsCount(job.id)}
                                            </button>
                                        </td>

                                        <td>
                                            <div className="job-actions">
                                                <button
                                                    className="edit-action"
                                                    onClick={() => openEditModal(job)}
                                                >
                                                    ✎
                                                </button>

                                                {job.status === "Active" && (
                                                    <button
                                                        className="close-action"
                                                        onClick={() => updateStatus(job.id, "Closed")}
                                                    >
                                                        ✕ Close
                                                    </button>
                                                )}

                                                {job.status === "Closed" && (
                                                    <button
                                                        className="activate-action"
                                                        onClick={() => updateStatus(job.id, "Active")}
                                                    >
                                                        + Activate
                                                    </button>
                                                )}

                                                {(job.status === "Pending" ||
                                                    job.status === "Rejected") && (
                                                    <span className="locked-action">
                                                        No status action
                                                    </span>
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

                {isEditOpen && selectedJob && (
                    <div className="modal-overlay">
                        <div className="edit-job-modal">
                            <div className="modal-header">
                                <h2>Edit Job</h2>

                                <button
                                    className="modal-close"
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setSelectedJob(null);
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <form className="edit-job-form" onSubmit={saveEditedJob}>
                                <label>Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={selectedJob.title || ""}
                                    onChange={handleEditChange}
                                />

                                <div className="form-grid">
                                    <div>
                                        <label>
                                            Category <span>*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={selectedJob.category || ""}
                                            onChange={handleEditChange}
                                        >
                                            <option value="">Select a category</option>

                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}

                                            <option value="Other">Other</option>
                                        </select>

                                        {selectedJob.category === "Other" && (
                                            <div className="requested-category-box">
                                                <input
                                                    type="text"
                                                    name="requestedCategory"
                                                    placeholder="Request new category"
                                                    value={selectedJob.requestedCategory || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label>
                                            Job Type <span>*</span>
                                        </label>
                                        <select
                                            name="type"
                                            value={selectedJob.type || ""}
                                            onChange={handleEditChange}
                                        >
                                            <option value="">Select job type</option>

                                            {jobTypes.map((jobType) => (
                                                <option key={jobType.id} value={jobType.name}>
                                                    {jobType.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={selectedJob.location || ""}
                                    onChange={(e) => {
                                        handleEditChange(e);
                                        generateEditLocationSuggestions(e.target.value);
                                    }}
                                />

                                {editLocationSuggestions.length > 0 && (
                                    <div className="location-suggestions">
                                        {editLocationSuggestions.map((loc, index) => (
                                            <button
                                                type="button"
                                                key={`${loc}-${index}`}
                                                className="location-suggestion-btn"
                                                onClick={() => {
                                                    setSelectedJob({
                                                        ...selectedJob,
                                                        location: loc,
                                                    });
                                                    setEditLocationSuggestions([]);
                                                }}
                                            >
                                                📍 {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <label>Skills</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={selectedJob.skills || ""}
                                    onChange={(e) => {
                                        handleEditChange(e);
                                        generateEditSkillSuggestions(e.target.value);
                                    }}
                                />

                                {editSkillSuggestions.length > 0 && (
                                    <div className="skills-suggestions">
                                        {editSkillSuggestions.map((skill, index) => (
                                            <button
                                                type="button"
                                                key={`${skill}-${index}`}
                                                className="skill-suggestion-btn"
                                                onClick={() => addEditSkill(skill)}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={selectedJob.description || ""}
                                    onChange={handleEditChange}
                                />

                                <label>Requirements</label>
                                <textarea
                                    name="requirements"
                                    value={selectedJob.requirements || ""}
                                    onChange={handleEditChange}
                                />

                                <div className="salary-edit-row">
                                    <div>
                                        <label>Salary Min</label>
                                        <input
                                            type="number"
                                            name="salaryMin"
                                            value={selectedJob.salaryMin || ""}
                                            onChange={handleEditChange}
                                        />
                                    </div>

                                    <div>
                                        <label>Salary Max</label>
                                        <input
                                            type="number"
                                            name="salaryMax"
                                            value={selectedJob.salaryMax || ""}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </div>

                                <div className="profile-actions">
                                    <button
                                        type="button"
                                        className="cancel-profile-btn"
                                        onClick={() => {
                                            setIsEditOpen(false);
                                            setSelectedJob(null);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button type="submit" className="save-profile-btn">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}

export default ManageJobs;