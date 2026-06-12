import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/auth.css";

function Register({ role }) {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const data = routerLocation.state;

    const REGISTER_API = "http://localhost:5234/api/Register/register";
    const UPLOAD_API = "http://localhost:5234/api/Upload/resume";
    const AI_SKILLS_API = "http://localhost:5234/api/Ai/skills";
    const LOCATION_API = "http://localhost:5234/api/Location/search";

    const [email, setEmail] = useState(data?.email || "");
    const [password, setPassword] = useState(data?.password || "");
    const [confirmPassword, setConfirmPassword] = useState(data?.password || "");

    const [fullName, setFullName] = useState(data?.fullName || "");
    const [skills, setSkills] = useState(data?.skills || "");
    const [skillSuggestions, setSkillSuggestions] = useState([]);
    const [experience, setExperience] = useState(data?.experience || "");
    const [location, setLocation] = useState(data?.location || "");
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [cv, setCv] = useState(null);

    const [companyName, setCompanyName] = useState(data?.companyName||"");
    const [hrName, setHrName] = useState(data?.hrName||"");
    const [companyWebsite, setCompanyWebsite] = useState(data?.companyWebsite||"");
    const [industry, setIndustry] = useState(data?.industry||"");
    const [companyLocation, setCompanyLocation] = useState(data?.companyLocation||"");
    const [companyLocationSuggestions, setCompanyLocationSuggestions] = useState([]);

    async function generateSkillSuggestions(value) {
        if (!value || value.trim().length < 1) {
            setSkillSuggestions([]);
            return;
        }

        try {
            const response = await fetch(AI_SKILLS_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: value
                }),
            });

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

    async function generateLocationSuggestions(value, setter) {
        if (!value || value.length < 2) {
            setter([]);
            return;
        }
        const response = await fetch(
            `${LOCATION_API}?query=${encodeURIComponent(value)}`
        );

        if (!response.ok) {
            setter([]);
            return;
        }

        const data = await response.json();
        setter(data);
    }

    function addSkill(skill) {
        if (!skills.includes(skill)) {
            setSkills(skills ? `${skills}, ${skill}` : skill);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let uploadedCvName = "";

        if (role === "jobseeker" && cv) {
            const formData = new FormData();
            formData.append("file", cv);

            try {
                const uploadResponse = await fetch(UPLOAD_API, {
                    method: "POST",
                    body: formData,
                });

                if (uploadResponse.ok) {
                    uploadedCvName = await uploadResponse.text();
                    uploadedCvName = uploadedCvName.replace(/"/g, "");
                } else {
                    alert("Failed to upload CV");
                    return;
                }
            } catch (error) {
                console.log(error);
                alert("CV upload failed");
                return;
            }
        }

        let user = {
            role,
            email,
            password,
        };

        if (role === "jobseeker") {
            user = {
                ...user,
                fullName,
                skills,
                experience,
                location,
                cvName: uploadedCvName,
            };
        }
        if (!email.endsWith("@gmail.com")) {
            alert("Please enter a valid Gmail address.");
            return;
        }

        if (role === "employer") {
            user = {
                ...user,
                companyName,
                hrName,
                companyWebsite,
                industry,
                companyLocation,
            };
        }

        try {
            const response = await fetch(REGISTER_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert("Verification code sent to your email");
                navigate("/verify-email", {
                    state: {
                        email: user.email,
                        role: user.role,
                        userData: user
                    },
                });
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ padding: "20px" }}>
                <h2>
                    {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""} Register
                </h2>

                <form onSubmit={handleRegister}>
                    {role === "jobseeker" && (
                        <>
                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <div>
                                <input
                                    className="form-control mb-2"
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
                                                    setSkillSuggestions([]);
                                                }}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        <input
                            className="form-control mb-2"
                            type="text"
                            placeholder="Experience"
                            value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => {
                                    setLocation(e.target.value);
                                    generateLocationSuggestions(
                                        e.target.value,
                                        setLocationSuggestions
                                    );
                                }}
                            />

                            {locationSuggestions.length > 0 && (
                                <div className="location-suggestions">
                                    {locationSuggestions.map((loc) => (
                                        <button
                                            type="button"
                                            key={loc}
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

                            <input
                                className="form-control mb-2"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (file && file.type !== "application/pdf") {
                                        alert("Only PDF files are allowed.");
                                        e.target.value = "";
                                        setCv(null);
                                        return;
                                    }

                                    setCv(file);
                                }}
                            />                          
                        </>
                    )}

                    {role === "employer" && (
                        <>
                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="HR Name"
                                value={hrName}
                                onChange={(e) => setHrName(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Company Website"
                                value={companyWebsite}
                                onChange={(e) => setCompanyWebsite(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                type="text"
                                placeholder="Company Location"
                                value={companyLocation}
                                onChange={(e) => {
                                    setCompanyLocation(e.target.value);
                                    generateLocationSuggestions(
                                        e.target.value,
                                        setCompanyLocationSuggestions
                                    );
                                }}
                            />

                            {companyLocationSuggestions.length > 0 && (
                                <div className="location-suggestions">
                                    {companyLocationSuggestions.map((loc) => (
                                        <button
                                            type="button"
                                            key={loc}
                                            className="location-suggestion-btn"
                                            onClick={() => {
                                                setCompanyLocation(loc);
                                                setCompanyLocationSuggestions([]);
                                            }}
                                        >
                                            📍 {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    <input
                        className="form-control mb-2"
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button className="auth-submit-btn" type="submit">
                        Register
                    </button>
                </form>

                <p className="mt-3">
                    Already have an account?{" "}
                    <Link to={`/${role}/login`}>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;