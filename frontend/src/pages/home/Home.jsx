import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import RoleSelectionCards from "../../components/home/RoleSelectionCards";
import AboutUs from "../../components/home/AboutUs";
import Footer from "../../components/home/Footer";
import "../../styles/home.css";

function Home() {
    const API_BASE = "http://localhost:5234/api";

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, []);

    async function safeFetch(url, fallback = []) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                return fallback;
            }

            return await response.json();
        } catch (error) {
            console.log(error);
            return fallback;
        }
    }

    async function fetchHomeData() {
        setLoading(true);

        const [jobsData, applicationsData, usersData, categoriesData] =
            await Promise.all([
                safeFetch(`${API_BASE}/jobs`),
                safeFetch(`${API_BASE}/Applications`),
                safeFetch(`${API_BASE}/User`),
                safeFetch(`${API_BASE}/JobCategories`),
            ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        setLoading(false);
    }

    const homeStats = useMemo(() => {
        const activeJobs = jobs.filter((job) => job.status === "Active");
        const employers = users.filter((user) => user.role === "employer");
        const jobseekers = users.filter((user) => user.role === "jobseeker");
        const hired = applications.filter((app) => app.status === "Accepted");

        return {
            totalUsers: jobseekers.length,
            totalEmployers: employers.length,
            totalJobs: activeJobs.length,

            activeJobs: activeJobs.length,
            applications: applications.length,
            employers: employers.length,
            jobseekers: jobseekers.length,
            categories: categories.length,
            hired: hired.length,
        };
    }, [jobs, applications, users, categories]);

    const latestJobs = useMemo(() => {
        return jobs.filter((job) => job.status === "Active").slice(0, 3);
    }, [jobs]);

    return (
        <div className="home-page">
            <Navbar />

            <main>
                <Hero stats={homeStats} loading={loading} />
                <RoleSelectionCards stats={homeStats} />
                <AboutUs
                    stats={homeStats}
                    latestJobs={latestJobs}
                    categories={categories}
                    loading={loading}
                />
            </main>

            <Footer />
        </div>
    );
}

export default Home;