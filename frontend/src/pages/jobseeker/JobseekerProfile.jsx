import { useState } from "react";
import JobseekerLayout from "../../components/jobseeker/JobseekerLayout";

function JobseekerProfile() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [skillSuggestions, setSkillSuggestions] = useState([]);

    const [isEditing, setIsEditing] = useState(false);

    const [fullName, setFullName] = useState(
        loggedInUser?.fullName || ""
    );

    const [email, setEmail] = useState(
        loggedInUser?.email || ""
    );

    const [skills, setSkills] = useState(
        loggedInUser?.skills || ""
    );

    const [experience, setExperience] = useState(
        loggedInUser?.experience || ""
    );

    const [location, setLocation] = useState(
        loggedInUser?.location || ""
    );

    const [cvFile, setCvFile] = useState(null);

    const [cvName, setCvName] = useState(
        loggedInUser?.cvName || ""
    );
    async function generateLocationSuggestions(value) {
        if (!value || value.length < 2) {
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

            setLocationSuggestions(data);
        } catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
    }

    async function handleSave(e) {
        e.preventDefault();

        let uploadedCvName = cvName;

        if (cvFile) {
            const formData = new FormData();

            formData.append("file", cvFile);

            try {
                const uploadResponse = await fetch(
                    "http://localhost:5234/api/Upload/resume",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (uploadResponse.ok) {
                    uploadedCvName =
                        await uploadResponse.text();

                    uploadedCvName =
                        uploadedCvName.replace(/"/g, "");
                } else {
                    alert("Failed to upload resume");
                    return;
                }
            } catch (error) {
                console.log(error);

                alert("Resume upload failed");
                return;
            }
        }

        const updatedUser = {
            ...loggedInUser,

            fullName,
            email,
            skills,
            experience,
            location,

            cvName: uploadedCvName,
        };

        try {
            const response = await fetch(
                `http://localhost:5234/api/User/${loggedInUser.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(updatedUser),
                }
            );

            if (response.ok) {
                const updatedData =
                    await response.json();

                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(updatedData)
                );

                alert("Profile updated successfully");

                setIsEditing(false);

                window.location.reload();
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.log(error);

            alert("Server error");
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
                        description:experience,
                        requirements:skills,
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

    function openResume() {
        if (!cvName) {
            alert("No resume uploaded.");
            return;
        }

        window.open(
            `http://localhost:5234/uploads/${cvName}`,
            "_blank"
        );
    }

    function getCleanFileName(fileName) {
        if (!fileName) return "";

        const parts = fileName.split("_");

        if (parts.length > 1) {
            parts.shift();

            return parts.join("_");
        }

        return fileName;
    }

    return (
        <JobseekerLayout activePage="profile">
            <div className="company-profile-card">

                <div className="profile-card-header">
                    <h2>
                        {isEditing
                            ? "Edit Jobseeker Profile"
                            : "Jobseeker Profile"}
                    </h2>

                    {!isEditing && (
                        <button
                            className="edit-profile-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="profile-view">

                        <div className="profile-columns">

                            <div>
                                <h3>Personal Information</h3>

                                <div className="profile-info-row">

                                    <div className="big-avatar">
                                        {(fullName || "J")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h4>
                                            {fullName || "Jobseeker"}
                                        </h4>

                                        <p>{email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Professional Information</h3>

                                <div className="profile-info-row">

                                    <div className="company-logo-box">
                                        💼
                                    </div>

                                    <div>
                                        <h4>
                                            {skills ||
                                                "No skills yet"}
                                        </h4>

                                        <p>
                                            {experience ||
                                                "No experience added"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="about-company-box">
                            <h3>Profile Details</h3>

                            <p>
                                <strong>Location:</strong>{" "}
                                {location || "Not provided"}

                                <br />

                                <strong>Skills:</strong>{" "}
                                {skills || "Not provided"}

                                <br />

                                <strong>Experience:</strong>{" "}
                                {experience || "Not provided"}

                                <br />

                                <strong>Resume:</strong>{" "}

                                {cvName ? (
                                    <button
                                        type="button"
                                        className="resume-link-btn"
                                        onClick={openResume}
                                    >
                                        📄 {getCleanFileName(cvName)}
                                    </button>
                                ) : (
                                    "No resume uploaded"
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form
                        className="profile-edit-form"
                        onSubmit={handleSave}
                    >
                        <div className="profile-columns">

                            <div>
                                <h3>Personal Information</h3>

                                <label>Full Name</label>

                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />

                                <label>Email</label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                                <label>Location</label>

                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        generateLocationSuggestions(e.target.value);
                                    }}
                                />
                                {locationSuggestions.length > 0 && (
                                    <div className="location-suggestions">
                                        {locationSuggestions.map((loc, index) => (
                                            <button
                                                type="button"
                                                key={`${loc}-${index}`}
                                                className="location-suggestion-btn"
                                                onClick={() => {
                                                    setLocation(loc);
                                                    setLocationSuggestions([]);
                                                }}
                                            >
                                                📍 {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3>Professional Information</h3>

                                <label>Skills</label>

                                <input
                                    type="text"
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

                                <label>Experience</label>

                                <input
                                    type="text"
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(e.target.value)
                                    }
                                />

                                <label>Current Resume</label>

                                <div className="current-resume-box">
                                    {cvName ? (
                                        <>
                                            <span>
                                                📄 {getCleanFileName(cvName)}
                                            </span>

                                            <button
                                                type="button"
                                                className="resume-btn"
                                                onClick={openResume}
                                            >
                                                View
                                            </button>
                                        </>
                                    ) : (
                                        <span>
                                            No resume uploaded
                                        </span>
                                    )}
                                </div>

                                <label>Change Resume PDF</label>

                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        setCvFile(
                                            e.target.files[0]
                                        )
                                    }
                                />

                                {cvFile && (
                                    <p className="selected-file-text">
                                        New selected file: {cvFile.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="profile-actions">

                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={() =>
                                    setIsEditing(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-profile-btn"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </JobseekerLayout>
    );
}

export default JobseekerProfile;
