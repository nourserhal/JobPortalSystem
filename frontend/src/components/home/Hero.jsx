import { Link } from "react-router-dom";
import React from "react";
import { Users, Building2, BriefcaseBusiness } from "lucide-react";
import "../../styles/home.css";

function Hero({ stats, loading }) {
    return (
        <section id="home" className="home-hero">
            <div className="home-container">
                <div className="home-hero-centered">
                    <span className="home-eyebrow">Smart hiring platform</span>

                    <h1>
                        Find Your Dream Job or
                        <br />
                        <span>Perfect Hire</span>
                    </h1>

                    <p>
                        Connect talented professionals with trusted employers.
                        Your next career move or perfect candidate is just one click away.
                    </p>

                    <div className="home-hero-actions">
                        <Link className="home-main-btn" to="/jobseeker/login">
                            Find Jobs
                        </Link>

                        <Link className="home-outline-btn" to="/employer/login">
                            Post a Job
                        </Link>
                    </div>

                    <div className="home-simple-stats">
                        <div className="home-simple-stat">
                            <div className="home-stat-icon">
                                <Users size={28} strokeWidth={2.3} />
                            </div>

                            <strong>{loading ? "..." : stats.totalUsers?? 0}</strong>
                            <p>Active Users</p>
                        </div>

                        <div className="home-simple-stat">
                            <div className="home-stat-icon">
                                <Building2 size={28} strokeWidth={2.3} />
                            </div>

                            <strong>{loading ? "..." : stats.totalEmployers??0}</strong>
                            <p>Companies</p>
                        </div>

                        <div className="home-simple-stat">
                            <div className="home-stat-icon">
                                <BriefcaseBusiness size={28} strokeWidth={2.3} />
                            </div>

                            <strong>{loading ? "..." : stats.totalJobs??0}</strong>
                            <p>Jobs Posted</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;