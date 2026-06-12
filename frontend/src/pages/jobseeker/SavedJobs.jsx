import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobseekerLayout from "../../components/jobseeker/JobseekerLayout";
import { Bookmark } from "lucide-react";

function SavedJobs() {
    const navigate = useNavigate();

    const JOBS_API = "http://localhost:5234/api/jobs";

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    async function fetchSavedJobs() {
        const savedData =
            JSON.parse(localStorage.getItem("savedJobs")) || [];

        const mySavedJobs = savedData.filter(
            (item) => item.userEmail === loggedInUser?.email
        );

        const jobsResponse = await fetch(JOBS_API);
        const jobsData = await jobsResponse.json();

        const mergedSavedJobs = mySavedJobs.map((saved) => {
            const job = jobsData.find((j) => j.id === saved.jobId);

            return {
                ...saved,
                job,
            };
        });

        setSavedJobs(mergedSavedJobs);
    }

    function removeSavedJob(jobId) {
        let savedData =
            JSON.parse(localStorage.getItem("savedJobs")) || [];

        savedData = savedData.filter(
            (item) =>
                !(
                    item.jobId === jobId &&
                    item.userEmail === loggedInUser?.email
                )
        );

        localStorage.setItem("savedJobs", JSON.stringify(savedData));

        fetchSavedJobs();
    }

    return (
        <JobseekerLayout activePage="saved">
            <div className="saved-jobs-page">
                <h1>Saved Jobs</h1>

                <p>Jobs you saved for later.</p>

                <div className="saved-jobs-grid">
                    {savedJobs.length === 0 ? (
                        <div className="empty-saved-jobs">
                            No saved jobs yet.
                        </div>
                    ) : (
                        savedJobs.map((saved) => (
                            <div
                                className="saved-job-card"
                                key={saved.jobId}
                            >
                                {/* TOP RIGHT BOOKMARK */}
                                <button
                                    className="saved-bookmark-top"
                                    onClick={() =>
                                        removeSavedJob(saved.jobId)
                                    }
                                >
                                    <Bookmark
                                        size={22}
                                        fill="currentColor"
                                    />
                                </button>

                                {/* TITLE */}
                                <div>
                                    <h3>
                                        {saved.job?.title ||
                                            "Deleted Job"}
                                    </h3>

                                    <p>
                                        {saved.job?.company ||
                                            "Unknown Company"}
                                    </p>
                                </div>

                                {/* TAGS */}
                                <div className="job-tags">
                                    <span>
                                        📍{" "}
                                        {saved.job?.location ||
                                            "No location"}
                                    </span>

                                    <span>
                                        💼{" "}
                                        {saved.job?.type ||
                                            "No type"}
                                    </span>

                                    <span>
                                        🏷️{" "}
                                        {saved.job?.category ||
                                            "No category"}
                                    </span>
                                </div>

                                {/* ACTIONS */}
                                <div className="saved-job-actions">
                                    <button
                                        className="view-job-btn"
                                        onClick={() =>
                                            navigate(`/job/${saved.jobId}`)
                                        }
                                    >
                                        View Job
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </JobseekerLayout>
    );
}

export default SavedJobs;