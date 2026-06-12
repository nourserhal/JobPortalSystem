import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "../../components/employer/EmployerLayout";

function PostJob() {
    const navigate = useNavigate();

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const API_URL = "http://localhost:5234/api/jobs";
    const CATEGORIES_API = "http://localhost:5234/api/JobCategories";
    const JOB_TYPES_API = "http://localhost:5234/api/JobTypes";

    const [location, setLocation] = useState(
        loggedInUser?.location ||
        loggedInUser?.companyLocation ||
        loggedInUser?.address ||
        ""
    );
    const [isPreview, setIsPreview] = useState(false);

    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

    const [title, setTitle] = useState("");
    const [company] = useState(loggedInUser?.companyName || "");

    const [category, setCategory] = useState("");
    const [requestedCategory, setRequestedCategory] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [skills, setSkills] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    

    useEffect(() => {
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
    async function generateSkillSuggestions(value) {
        if (!value || value.trim().length < 1) {
            setSkillSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5234/api/Ai/skills",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: value,
                        title,
                        category,
                        description,
                        requirements,
                    }),
                }
            );

            if (!response.ok) {
                setSkillSuggestions([]);
                return;
            }

            const data = await response.json();

            setSkillSuggestions(data.skills || []);
        } catch (error) {
            console.log(error);
            setSkillSuggestions([]);
        }
    }
    async function generateLocationSuggestions(value) {
        if (!value || value.trim().length < 2) {
            setLocationSuggestions([]);
            return;
        }
        try {
        const response = await fetch(
            `http://localhost:5234/api/Location/search?query=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
            setLocationSuggestions([]);
            return;
        }

        const data = await response.json();
        setLocationSuggestions(data);}
        catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
    }

    function validateForm() {
        if (
            !title ||
            !company ||
            !location ||
            !category ||
            !type ||
            !description ||
            !requirements ||
            !skills ||
            !salaryMin ||
            !salaryMax
        ) {
            alert("Please fill all fields before previewing.");
            return false;
        }
        if (
            category === "Other" &&
            !requestedCategory
        ) {
            alert("Please request a category.");
            return false;
        }

        return true;
    }

    function handlePreview(e) {
        e.preventDefault();

        if (!validateForm()) return;

        setIsPreview(true);
    }

    async function handlePublish() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser || loggedInUser.role !== "employer") {
            alert("You are not authorized to publish jobs.");
            return;
        }

        if (!validateForm()) return;

        const newJob = {
            title,
            company,
            location,
            category,
            requestedCategory:
                category === "Other"
                    ? requestedCategory
                    : null,
            type,
            description,
            requirements,
            skills,
            salaryMin: Number(salaryMin),
            salaryMax: Number(salaryMax),
            status: "Pending",
            employerId: loggedInUser.id,
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newJob),
            });

            if (response.ok) {
                alert(
                    "Job submitted successfully and is waiting for admin verification."
                );
                navigate("/employer/dashboard");
            } else {
                alert("Failed to submit job.");
            }
        } catch (error) {
            console.log(error);
            alert("Server error. Please check if backend is running.");
        }
    }

    return (
        <EmployerLayout activePage="postJob">
            {!isPreview ? (
                <div className="postjob-container">
                    <div className="postjob-header">
                        <div>
                            <h2>Post a New Job</h2>
                            <p>Fill out the form below to create your job posting.</p>
                        </div>

                        <button className="preview-btn" onClick={handlePreview}>
                            👁 Preview
                        </button>
                    </div>

                    <form className="postjob-form" onSubmit={handlePreview}>
                        <label>
                            Job Title <span>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Developer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>
                            Location <span>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Beirut, Lebanon"
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

                        <div className="form-grid">
                            <div>
                                <label>
                                    Category <span>*</span>
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select a category</option>

                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                        
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                                {category === "Other" && (
                                    <div className="requested-category-box">
                                        <input
                                            type="text"
                                            placeholder="Request new category"
                                            value={requestedCategory}
                                            onChange={(e) =>
                                                setRequestedCategory(e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>
                                    Job Type <span>*</span>
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
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

                        <label>
                            Job Description <span>*</span>
                        </label>
                        <textarea
                            placeholder="Describe the role and responsibilities..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <small>
                            Include key responsibilities, day-to-day tasks, and what makes this role exciting.
                        </small>

                        <label>
                            Requirements <span>*</span>
                        </label>
                        <textarea
                            placeholder="List key qualifications and skills..."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                        />

                        <small>
                            Include required skills, experience level, education, and preferred qualifications.
                        </small>

                        <label>
                            Required Skills <span>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. React, JavaScript, CSS"
                            value={skills}
                            onChange={(e) => {
                                setSkills(e.target.value);
                                generateSkillSuggestions(e.target.value);
                            }}
                        />
                        {skillSuggestions.length > 0 && (
                            <div className="skills-suggestions">
                                {skillSuggestions.map((skill, index) => (
                                    <button
                                        type="button"
                                        key={`${skill}-${index}`}
                                        className="skill-suggestion-btn"
                                        onClick={() => {
                                            let skillsArray = skills
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

                                            setSkills(skillsArray.join(", "));
                                        }}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        )}

                        <label>
                            Salary Range <span>*</span>
                        </label>
                        <div className="salary-grid">
                            <input
                                type="number"
                                placeholder="Min $"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Max $"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                            />
                        </div>

                        <button className="submit-preview-btn" type="submit">
                            Preview Job
                        </button>
                    </form>
                </div>
            ) : (
                <div className="preview-container">
                    <div className="preview-top">
                        <button
                            className="back-btn"
                            onClick={() => setIsPreview(false)}
                        >
                            ← Back to Edit
                        </button>

                        <button className="publish-btn" onClick={handlePublish}>
                            Publish Job
                        </button>
                    </div>

                    <div className="job-preview-card">
                        <div className="preview-header">
                            <div>
                                <h2>{title}</h2>
                                <p>{company}</p>
                                <p>📍 {location}</p>
                            </div>

                            <span className="pending-badge">
                                Pending Verification
                            </span>
                        </div>

                        <div className="preview-info">
                            <span>{category}</span>
                            <span>{type}</span>
                            <span>Posted today</span>
                        </div>

                        <div className="salary-preview">
                            <div className="salary-icon">$</div>
                            <div>
                                <p>Compensation</p>
                                <h3>
                                    {salaryMin} - {salaryMax} per month
                                </h3>
                            </div>

                            <span className="competitive-badge">
                                Competitive
                            </span>
                        </div>

                        <div className="preview-section">
                            <h3>About This Role</h3>
                            <p>{description}</p>
                        </div>

                        <div className="preview-section">
                            <h3>What We're Looking For</h3>
                            <p>{requirements}</p>
                        </div>

                        <div className="preview-section">
                            <h3>Skills</h3>
                            <p>{skills}</p>
                        </div>
                    </div>
                </div>
            )}
        </EmployerLayout>
    );
}

export default PostJob;