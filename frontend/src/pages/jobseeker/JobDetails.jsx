import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark,BookmarkCheck, ArrowLeft } from "lucide-react";

import JobseekerLayout from "../../components/jobseeker/JobseekerLayout";

function JobDetails() {
    const navigate = useNavigate();
    const [coverLetter, setCoverLetter] = useState("");
    const { id } = useParams();


    const API_URL = "http://localhost:5234/api/jobs";

    const [job, setJob] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchJob();
        checkIfSaved();
    }, []);

    async function fetchJob() {
        try {
            const response = await fetch(API_URL);

            const data = await response.json();

            const selectedJob = data.find(
                (item) => item.id === Number(id)
            );

            setJob(selectedJob);
        } catch (error) {
            console.log(error);
        }
    }
    function checkIfSaved() {
        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        const savedJobs = JSON.parse(
            localStorage.getItem("savedJobs")
        ) || [];

        const exists = savedJobs.find(
            (item) =>
                item.jobId === Number(id) &&
                item.userEmail === loggedInUser?.email
        );

        setSaved(!!exists);
    }

    function getPostedDateText(createdAt) {
        if (!createdAt) return "Posted date unavailable";

        const days = Math.floor(
            (new Date() - new Date(createdAt)) /
            (1000 * 60 * 60 * 24)
        );

        if (days === 0) return "Posted today";
        if (days === 1) return "Posted 1 day ago";

        return `Posted ${days} days ago`;
    }
    function toggleSaveJob() {
        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        let savedJobs = JSON.parse(
            localStorage.getItem("savedJobs")
        ) || [];

        const exists = savedJobs.find(
            (item) =>
                item.jobId === job.id &&
                item.userEmail === loggedInUser?.email
        );

        if (exists) {
            savedJobs = savedJobs.filter(
                (item) =>
                    !(
                        item.jobId === job.id &&
                        item.userEmail === loggedInUser?.email
                    )
            );

            setSaved(false);
        } else {
            savedJobs.push({
                jobId: job.id,
                userEmail: loggedInUser?.email,
            });

            setSaved(true);
        }

        localStorage.setItem(
            "savedJobs",
            JSON.stringify(savedJobs)
        );
    }
    async function handleApply() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {
        alert("Please login first");
        navigate("/jobseeker/login");
        return;
    }

    if (!job) {
        alert("Job not loaded yet");
        return;
    }

    const application = {
        applicantName: loggedInUser.fullName || "Jobseeker",
        applicantEmail: loggedInUser.email,
        resumeUrl: loggedInUser.cvName || "No CV uploaded",
        status: "Applied",
        jobId: job.id,
        coverLetter: coverLetter,
    };

    console.log("Logged user:", loggedInUser);
    console.log("Application sent:", application);

    try {
        const response = await fetch(
            "http://localhost:5234/api/Applications",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(application),
            }
        );

        if (response.ok) {
            alert("Application submitted successfully!");
        } else {
            const errorMessage = await response.text();
            console.log("Application error:", errorMessage);
            alert(errorMessage);
        }
    } catch (error) {
        console.log(error);
        alert("Server error.");
    }
}
    if (!job) {
        return (
            <JobseekerLayout activePage="jobs">
                <p>Loading job details...</p>
            </JobseekerLayout>
        );
    }
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    function getJobMatch(job) {
        const seekerSkills = (loggedInUser?.skills || "")
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const jobSkills = (job.skills || "")
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        if (jobSkills.length === 0) {
            return {
                score: 0,
                missingSkills: [],
                advice: "No required skills were added for this job.",
            };
        }

        const matchedSkills = jobSkills.filter((skill) =>
            seekerSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(
            (skill) => !seekerSkills.includes(skill)
        );

        const score = Math.round(
            (matchedSkills.length / jobSkills.length) * 100
        );

        let advice = "";
        if (score >= 80) {
            advice =
                missingSkills.length > 0
                    ? `Excellent match! Learning ${missingSkills[0]} will make your profile even stronger.`
                    : "Excellent match! You are highly qualified for this position.";
        }
        else if (score >= 50) {
            advice =
                missingSkills.length > 0
                    ? `Good match. Consider learning ${missingSkills[0]} to improve your chances.`
                    : "Good match for this position.";
        }
        else {
            advice =
    missingSkills.length > 0
        ? `You currently match only ${score}% of the required skills. Focus on learning ${missingSkills.slice(0, 2).join(" and ")} first to improve your chances.`
        : "This job requires additional preparation.";
        }

        return { score, missingSkills, advice };
    }

    const match = getJobMatch(job);

    return (
        <JobseekerLayout activePage="jobs">
            <div className="job-details-page">

                {/* BACK BUTTON */}
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* JOB CARD */}
                <div className="job-details-card">

                    <div className="job-details-header">
                        <div>
                            <h1>{job.title}</h1>

                            <p>{job.company}</p>
                        </div>
                        <div className="ai-match-box">
                            <strong>{match.score}% AI Match</strong>

                            {match.missingSkills.length > 0 && (
                                <p>Missing Skills: {match.missingSkills.join(", ")}</p>
                            )}

                            <small>{match.advice}</small>
                        </div>

                        <button
                            className="save-job-details-btn"
                            onClick={toggleSaveJob}
                        >
                        <Bookmark
                            size={22}
                            fill={saved ? "currentColor" : "none"}
                        />   
                        </button>
                    </div>

                    {/* TAGS */}
                    <div className="job-details-tags">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        <span>🏷️ {job.category}</span>
                        <span>🗓️ {getPostedDateText(job.createdAt)}</span>
                    </div>

                    {/* SALARY */}
                    <div className="job-details-salary">
                        <h3>Salary Range</h3>

                        <p>
                            $
                            {job.salaryMin || 0}
                            {" - "}
                            $
                            {job.salaryMax || 0}
                        </p>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="job-details-section">
                        <h3>Job Description</h3>

                        <p>{job.description}</p>
                    </div>

                    {/* REQUIREMENTS */}
                    <div className="job-details-section">
                        <h3>Requirements</h3>

                        <p>{job.requirements}</p>
                    </div>

                    {/* SKILLS */}
                    <div className="job-details-section">
                        <h3>Skills</h3>

                        <p>{job.skills}</p>
                    </div>
                    

                    {/* ACTIONS */}
                    <div className="job-details-actions">
                        <textarea
                            className="cover-letter-input"
                            placeholder="Write your cover letter..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                        />
                        <button
                            className="apply-job-btn"
                            onClick={handleApply}
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    );
}

export default JobDetails;