import { useState } from "react";
import EmployerLayout from "../../components/employer/EmployerLayout";

function CompanyProfile() {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const [loggedInUser, setLoggedInUser] = useState(savedUser);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [companyName, setCompanyName] = useState(savedUser?.companyName || "");
    const [companyWebsite, setCompanyWebsite] = useState(savedUser?.companyWebsite || "");
    const [industry, setIndustry] = useState(savedUser?.industry || "");
    const [companyLocation, setCompanyLocation] = useState(savedUser?.companyLocation || "");
    const [companyDescription, setCompanyDescription] = useState(savedUser?.companyDescription || "");

    function handleCancel() {
        setCompanyName(loggedInUser?.companyName || "");
        setCompanyWebsite(loggedInUser?.companyWebsite || "");
        setIndustry(loggedInUser?.industry || "");
        setCompanyLocation(loggedInUser?.companyLocation || "");
        setCompanyDescription(loggedInUser?.companyDescription || "");
        setLocationSuggestions([]);
        setIsEditing(false);
    }

    async function handleSave(e) {
        e.preventDefault();

        if (!loggedInUser?.id) {
            alert("User ID not found. Please login again.");
            return;
        }

        const updatedUser = {
            ...loggedInUser,
            companyName: companyName.trim(),
            companyWebsite: companyWebsite.trim(),
            industry: industry.trim(),
            companyLocation: companyLocation.trim(),
            companyDescription: companyDescription.trim(),
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

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Update failed:", errorText);
                alert("Failed to update profile");
                return;
            }

            let updatedData = updatedUser;
            const text = await response.text();

            if (text) {
                updatedData = JSON.parse(text);
            }

            localStorage.setItem("loggedInUser", JSON.stringify(updatedData));
            setLoggedInUser(updatedData);

            setCompanyName(updatedData.companyName || "");
            setCompanyWebsite(updatedData.companyWebsite || "");
            setIndustry(updatedData.industry || "");
            setCompanyLocation(updatedData.companyLocation || "");
            setCompanyDescription(updatedData.companyDescription || "");

            setLocationSuggestions([]);
            setIsEditing(false);

            alert("Company profile updated successfully");
        } catch (error) {
            console.log("Server error:", error);
            alert("Server error");
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
        <EmployerLayout activePage="companyProfile">
            <div className="company-profile-card">
                <div className="profile-card-header">
                    <h2>{isEditing ? "Edit Company Profile" : "Company Profile"}</h2>

                    {!isEditing && (
                        <button
                            type="button"
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
                                <h3>Company Information</h3>

                                <div className="profile-info-row">
                                    <div className="company-logo-box">🏢</div>

                                    <div>
                                        <h4>{companyName || "Company"}</h4>
                                        <p>{industry || "Industry"}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3>Contact Information</h3>

                                <div className="profile-info-row">
                                    <div className="big-avatar">
                                        {(companyName || "C").charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h4>{companyWebsite || "No website"}</h4>
                                        <p>{companyLocation || "No location"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="about-company-box">
                            <h3>About Company</h3>
                            <p>{companyDescription || "No company description yet."}</p>
                        </div>
                    </div>
                ) : (
                    <form className="profile-edit-form" onSubmit={handleSave}>
                        <div className="profile-columns">
                            <div>
                                <h3>Company Information</h3>

                                <label>Company Name</label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />

                                <label>Industry</label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />

                                <label>Company Website</label>
                                <input
                                    type="text"
                                    value={companyWebsite}
                                    onChange={(e) => setCompanyWebsite(e.target.value)}
                                />
                            </div>

                            <div>
                                <h3>Additional Details</h3>

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

                                <label>Company Description</label>
                                <textarea
                                    value={companyDescription}
                                    onChange={(e) => setCompanyDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={handleCancel}
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
        </EmployerLayout>
    );
}

export default CompanyProfile;