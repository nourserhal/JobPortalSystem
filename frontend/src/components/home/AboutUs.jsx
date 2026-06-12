import "../../styles/home.css";

function AboutUs({ stats, latestJobs, categories, loading }) {
    const features = [
        {
            icon: "📌",
            title: "Jobs from database",
            text: `${stats.totalJobs} job posts are currently stored in your system.`,
        },
        {
            icon: "👥",
            title: "Real users",
            text: `${stats.jobseekers} job seekers and ${stats.employers} employers are registered.`,
        },
        {
            icon: "📨",
            title: "Application tracking",
            text: `${stats.applications} applications are managed through the platform.`,
        },
        {
            icon: "✅",
            title: "Hiring results",
            text: `${stats.hired} applicants are marked as accepted.`,
        },
    ];

    return (
        <section id="about" className="home-about-section">
            <div className="home-container">
                <div className="home-section-title">
                    <span>About JobPortal</span>
                    <h2>A simple platform that works with your real data</h2>
                    <p>
                        The home page now reflects your database instead of fake numbers.
                        It keeps the same clean style as your dashboards: white panels, soft shadows, and blue actions.
                    </p>
                </div>

                <div className="home-about-grid">
                    <div className="home-about-card">
                        <h3>What the platform does</h3>
                        <p>
                            JobPortal connects job seekers with employers through job posting,
                            searching, saving, applying, reviewing applications, and admin approval.
                        </p>

                        <div className="home-category-list">
                            {loading ? (
                                <span>Loading categories...</span>
                            ) : categories.length === 0 ? (
                                <span>No categories added yet</span>
                            ) : (
                                categories.slice(0, 6).map((category) => (
                                    <span key={category.id}>{category.name}</span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="home-feature-grid">
                        {features.map((feature) => (
                            <div className="home-feature-card" key={feature.title}>
                                <span>{feature.icon}</span>
                                <h4>{feature.title}</h4>
                                <p>{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="home-live-section">
                    <div className="home-panel-header">
                        <div>
                            <h3>Active opportunities</h3>
                            <p>Preview pulled from the jobs API</p>
                        </div>
                    </div>

                    <div className="home-live-jobs">
                        {latestJobs.length === 0 ? (
                            <p>No active opportunities available yet.</p>
                        ) : (
                            latestJobs.map((job) => (
                                <div className="home-live-job" key={job.id}>
                                    <div>
                                        <h4>{job.title}</h4>
                                        <p>{job.company || "Company"} · {job.location || "Location"}</p>
                                    </div>

                                    <span>{job.category || "General"}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
