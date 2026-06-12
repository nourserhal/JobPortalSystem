import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";

import JobseekerLayout from "../../components/jobseeker/JobseekerLayout";

function JobseekerDashboard() {
    const navigate = useNavigate();

    const API_URL = "http://localhost:5234/api/jobs";
    const CATEGORIES_API = "http://localhost:5234/api/JobCategories";
    const JOB_TYPES_API = "http://localhost:5234/api/JobTypes";

    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [dateFilter, setDateFilter] = useState("all");

    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [titleSuggestions, setTitleSuggestions] = useState([]);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    useEffect(() => {
        fetchJobs();
        fetchFilters();
        fetchRecommendedJobs();
    }, []);

    async function fetchJobs() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            const activeJobs = data.filter((job) => job.status === "Active");
            setJobs(activeJobs);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchRecommendedJobs() {
        if (!loggedInUser?.id) return;

        try {
            const response = await fetch(
                `http://localhost:5234/api/jobs/recommended/${loggedInUser.id}`
            );

            if (!response.ok) {
                console.log("Recommended jobs error:", await response.text());
                return;
            }

            const data = await response.json();
            console.log("Recommended Jobs:", data);
            setRecommendedJobs(data);
        } catch (error) {
            console.log(error);
        }
    }

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
        }
    }

    function generateTitleSuggestions(value) {
        if (!value || value.trim().length < 1) {
            setTitleSuggestions([]);
            return;
        }

        const suggestions = jobs
            .filter((job) =>
                job.title?.toLowerCase().includes(value.toLowerCase())
            )
            .map((job) => job.title)
            .filter((title, index, array) => array.indexOf(title) === index)
            .slice(0, 8);

        setTitleSuggestions(suggestions);
    }

    async function generateLocationSuggestions(value) {
        if (!value || value.trim().length < 2) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5234/api/Location/search?query=${encodeURIComponent(
                    value
                )}`
            );

            if (!response.ok) {
                setLocationSuggestions([]);
                return;
            }

            const data = await response.json();
            setLocationSuggestions(data);
        } catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
    }

    function toggleValue(value, selectedList, setSelectedList) {
        if (selectedList.includes(value)) {
            setSelectedList(selectedList.filter((item) => item !== value));
        } else {
            setSelectedList([...selectedList, value]);
        }
    }

    function saveJob(jobId) {
        if (!loggedInUser?.email) {
            alert("Please login first.");
            return;
        }

        let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

        const exists = savedJobs.find(
            (item) =>
                item.jobId === jobId &&
                item.userEmail === loggedInUser.email
        );

        if (exists) {
            savedJobs = savedJobs.filter(
                (item) =>
                    !(
                        item.jobId === jobId &&
                        item.userEmail === loggedInUser.email
                    )
            );
        } else {
            savedJobs.push({
                jobId: jobId,
                userEmail: loggedInUser.email,
            });
        }

        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        setJobs([...jobs]);
    }

    function isSaved(jobId) {
        const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

        return savedJobs.some(
            (item) =>
                item.jobId === jobId &&
                item.userEmail === loggedInUser?.email
        );
    }
    function getCompetitionLevel(count) {
        if (count <= 5) {
            return {
                text: "Low Competition",
                className: "competition-low",
            };
        }

        if (count <= 15) {
            return {
                text: "Medium Competition",
                className: "competition-medium",
            };
        }

        return {
            text: "High Competition",
            className: "competition-high",
        };
    }

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
        } else if (score >= 50) {
            advice =
                missingSkills.length > 0
                    ? `Good match. Consider learning ${missingSkills[0]} to improve your chances.`
                    : "Good match for this position.";
        } else {
            advice =
                missingSkills.length > 0
                    ? `You currently match only ${score}% of the required skills. Focus on learning ${missingSkills
                          .slice(0, 2)
                          .join(" and ")} first to improve your chances.`
                    : "This job requires additional preparation.";
        }

        return { score, missingSkills, advice };
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
        const filteredJobs = jobs.filter((job) => {
        const jobTypeValue = job.type || "";
        const jobCategoryValue = job.category || "";

        const jobMinSalary = Number(job.salaryMin) || 0;
        const jobMaxSalary = Number(job.salaryMax) || 0;

        const userMinSalary = minSalary ? Number(minSalary) : null;
        const userMaxSalary = maxSalary ? Number(maxSalary) : null;

        const matchesSearch =
            !search ||
            job.title?.toLowerCase().includes(search.toLowerCase()) ||
            job.company?.toLowerCase().includes(search.toLowerCase()) ||
            job.category?.toLowerCase().includes(search.toLowerCase());

        const matchesLocation =
            !location ||
            job.location?.toLowerCase().includes(location.toLowerCase());

        const matchesType =
            selectedTypes.length === 0 ||
            selectedTypes.some(
                (type) =>
                    type.trim().toLowerCase() ===
                    jobTypeValue.trim().toLowerCase()
            );

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.some(
                (category) =>
                    category.trim().toLowerCase() ===
                    jobCategoryValue.trim().toLowerCase()
            );

        const matchesSalary =
            (!userMinSalary || jobMaxSalary >= userMinSalary) &&
            (!userMaxSalary || jobMinSalary <= userMaxSalary);

        const jobDate = new Date(job.createdAt);
        const daysOld = Math.floor(
            (new Date() - jobDate) /
            (1000 * 60 * 60 * 24)
        );

        const matchesDate =
            dateFilter === "all" ||
            daysOld <= Number(dateFilter);

                return (
                    matchesSearch &&
                    matchesLocation &&
                    matchesType &&
                    matchesCategory &&
                    matchesSalary&&
                    matchesDate
                );
            });

    return (
        <JobseekerLayout activePage="jobs">
            <div className="jobseeker-dashboard">
                <section className="job-search-card">
                    <h1>Find Your Dream Job</h1>
                    <p>Discover opportunities that match your passion</p>

                    <div className="job-search-row">
                        <div className="job-search-title-box">
                            <input
                                type="text"
                                placeholder="Job title, company, or keywords"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    generateTitleSuggestions(e.target.value);
                                }}
                            />

                            {titleSuggestions.length > 0 && (
                                <div className="title-suggestions">
                                    {titleSuggestions.map((title, index) => (
                                        <button
                                            type="button"
                                            key={`${title}-${index}`}
                                            className="title-suggestion-btn"
                                            onClick={() => {
                                                setSearch(title);
                                                setTitleSuggestions([]);
                                            }}
                                        >
                                            🔎 {title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="job-search-location-box">
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    generateLocationSuggestions(e.target.value);
                                }}
                            />

                            {locationSuggestions.length > 0 && (
                                <div className="location-suggestions">
                                    {locationSuggestions.map((city, index) => (
                                        <button
                                            type="button"
                                            key={`${city}-${index}`}
                                            className="location-suggestion-btn"
                                            onClick={() => {
                                                setLocation(city);
                                                setLocationSuggestions([]);
                                            }}
                                        >
                                            📍 {city}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="search-jobs-btn" type="button">
                            Search Jobs
                        </button>
                    </div>
                </section>

                <section className="jobs-content">
                    <aside className="job-filters">
                        <h3>Filter Jobs</h3>

                        <button
                            className="clear-filter-btn"
                            onClick={() => {
                                setSearch("");
                                setLocation("");
                                setSelectedTypes([]);
                                setSelectedCategories([]);
                                setMinSalary("");
                                setMaxSalary("");
                                setDateFilter("all");
                                setTitleSuggestions([]);
                                setLocationSuggestions([]);
                            }}
                        >
                            Clear All
                        </button>

                        <div className="filter-block">
                            <h4>Job Type</h4>

                            {jobTypes.length === 0 ? (
                                <p>No job types available.</p>
                            ) : (
                                jobTypes.map((type) => (
                                    <label
                                        className="checkbox-filter"
                                        key={type.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.includes(
                                                type.name
                                            )}
                                            onChange={() =>
                                                toggleValue(
                                                    type.name,
                                                    selectedTypes,
                                                    setSelectedTypes
                                                )
                                            }
                                        />
                                        {type.name}
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="filter-block">
                            <h4>Salary Range</h4>

                            <input
                                type="number"
                                placeholder="Min Salary"
                                value={minSalary}
                                onChange={(e) => setMinSalary(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Max Salary"
                                value={maxSalary}
                                onChange={(e) => setMaxSalary(e.target.value)}
                            />
                        </div>

                        <div className="filter-block">
                            <h4>Category</h4>

                            {categories.length === 0 ? (
                                <p>No categories available.</p>
                            ) : (
                                categories.map((category) => (
                                    <label
                                        className="checkbox-filter"
                                        key={category.id}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(
                                                category.name
                                            )}
                                            onChange={() =>
                                                toggleValue(
                                                    category.name,
                                                    selectedCategories,
                                                    setSelectedCategories
                                                )
                                            }
                                        />
                                        {category.name}
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="filter-block">
                            <h4>Date Posted</h4>

                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">All Jobs</option>
                                <option value="1">Last 24 Hours</option>
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                            </select>
                        </div>
                    </aside>

                    <div className="jobs-list-area">
                        {recommendedJobs.length > 0 && (
                            <div className="recommended-section">
                                <h2>Recommended For You</h2>

                                <div className="recommended-list">
                                    {recommendedJobs.map((item) => (
                                        <div
                                            key={item.job.id}
                                            className="recommended-card"
                                            onClick={() =>
                                                navigate(`/job/${item.job.id}`)
                                            }
                                        >
                                            <h3>{item.job.title}</h3>
                                            <p>{item.job.company}</p>

                                            {(() => {
                                                const match = getJobMatch(item.job);

                                                return (
                                                    <span
                                                        className={
                                                            match.score >= 80
                                                                ? "match-high"
                                                                : match.score >= 50
                                                                ? "match-medium"
                                                                : "match-low"
                                                        }
                                                    >
                                                        {match.score}% Match
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="showing-text">
                            Showing {filteredJobs.length} jobs
                        </p>

                        <div className="job-cards-grid">
                            {filteredJobs.length === 0 ? (
                                <p>No active jobs found.</p>
                            ) : (
                                filteredJobs.map((job) => {
                                    const match = getJobMatch(job);
                                    const competition = getCompetitionLevel(
                                        job.applicantsCount || 0
                                    );

                                    return (
                                        <div
                                            className="job-card"
                                            key={job.id}
                                            onClick={() =>
                                                navigate(`/job/${job.id}`)
                                            }
                                        >
                                            <div className="job-card-top">
                                                <div className="job-company-logo">
                                                    💼
                                                </div>

                                                <button
                                                    className="save-job-btn"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        saveJob(job.id);
                                                    }}
                                                >
                                                    <Bookmark
                                                        size={22}
                                                        fill={
                                                            isSaved(job.id)
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <h3>{job.title}</h3>

                                            <p className="company-name">
                                                {job.company}
                                            </p>

                                            <div className="job-tags">
                                                <span>{job.location}</span>
                                                <span>{job.type}</span>
                                                <span>{job.category}</span>
                                            </div>

                                            <div className="ai-match-box">
                                                <strong>
                                                    {match.score}% AI Match
                                                </strong>

                                                {match.missingSkills.length >
                                                    0 && (
                                                    <p>
                                                        Missing:{" "}
                                                        {match.missingSkills.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                )}

                                                <small>{match.advice}</small>
                                            </div>
                                            <div
                                                className={`competition-badge ${competition.className}`}
                                            >
                                                {competition.text}
                                            </div>

                                            <p className="posted-date">
                                                {getPostedDateText(job.createdAt)}
                                            </p>

                                            <div className="job-card-bottom">
                                                <strong>
                                                    ${job.salaryMin || 0} - $
                                                    {job.salaryMax || 0}
                                                </strong>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            `/job/${job.id}`
                                                        );
                                                    }}
                                                >
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </JobseekerLayout>
    );
}

export default JobseekerDashboard;