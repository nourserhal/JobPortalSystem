import { useState } from "react";
import EmployerLayout from "../../components/employer/EmployerLayout";

function EmployerProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const [isEditing, setIsEditing] = useState(false);

    const [hrName, setHrName] = useState(loggedInUser?.hrName || "");
    const [email, setEmail] = useState(loggedInUser?.email || "");
    const [companyName, setCompanyName] = useState(loggedInUser?.companyName || "");
    const [companyWebsite, setCompanyWebsite] = useState(loggedInUser?.companyWebsite || "");
    const [industry, setIndustry] = useState(loggedInUser?.industry || "");
    const [companyLocation, setCompanyLocation] = useState(loggedInUser?.companyLocation || "");
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    async function handleSave(e) {
        e.preventDefault();

        const updatedUser = {
            ...loggedInUser,
            hrName,
            email,
            companyName,
            companyWebsite,
            industry,
            companyLocation,
        };

        const response = await fetch(`http://localhost:5234/api/User/${loggedInUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
            const updatedData = await response.json();
            localStorage.setItem("loggedInUser", JSON.stringify(updatedData));
            alert("Profile updated successfully");
            setIsEditing(false);
        } else {
            alert("Failed to update profile");
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
            setLocationSuggestions(data);
        } catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
    }

    return (
        <EmployerLayout activePage="employerProfile">
            <div className="company-profile-card">
                <div className="profile-card-header">
                    <h2>{isEditing ? "Edit Employer Profile" : "Employer Profile"}</h2>

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
                                        {(hrName || email || "E").charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h4>{hrName || "Employer"}</h4>
                                        <p>{email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Company Information</h3>

                                <div className="profile-info-row">
                                    <div className="company-logo-box">🏢</div>

                                    <div>
                                        <h4>{companyName || "Company"}</h4>
                                        <p>{industry || "Industry not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="about-company-box">
                            <h3>Company Details</h3>
                            <p>
                                <strong>Website:</strong> {companyWebsite || "Not provided"}
                                <br />
                                <strong>Location:</strong> {companyLocation || "Not provided"}
                                <br />
                                <strong>Industry:</strong> {industry || "Not provided"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSave}>
                        <div className="profile-columns">
                            <div>
                                <h3>Personal Information</h3>

                                <label>HR Name</label>
                                <input
                                    type="text"
                                    value={hrName}
                                    onChange={(e) => setHrName(e.target.value)}
                                />

                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <h3>Company Information</h3>

                                <label>Company Name</label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />

                                <label>Company Website</label>
                                <input
                                    type="text"
                                    value={companyWebsite}
                                    onChange={(e) => setCompanyWebsite(e.target.value)}
                                />

                                <label>Industry</label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />

                                <label>Company Location</label>
                                <input
                                    type="text"
                                    value={companyLocation}
                                    onChange={(e) => {
                                        setCompanyLocation(e.target.value);
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
                                                    setCompanyLocation(loc);
                                                    setLocationSuggestions([]);
                                                }}
                                            >
                                                📍 {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>

                            <button type="submit" className="save-profile-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </EmployerLayout>
    );
}

export default EmployerProfile;