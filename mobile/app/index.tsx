import { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Briefcase, Users, Building2 } from "lucide-react-native";
import { API_BASE_URL } from "../constants/api";
import { styles } from "../styles/home.styles";

export default function HomeScreen() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomeData();
    }, []);

    async function safeFetch(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async function fetchHomeData() {
        setLoading(true);

        const [jobsData, applicationsData, usersData, categoriesData] =
            await Promise.all([
                safeFetch(`${API_BASE_URL}/jobs`),
                safeFetch(`${API_BASE_URL}/Applications`),
                safeFetch(`${API_BASE_URL}/User`),
                safeFetch(`${API_BASE_URL}/JobCategories`),
            ]);

        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        setLoading(false);
    }

    const stats = useMemo(() => {
        const activeJobs = jobs.filter((job) => job.status === "Active");
        const employers = users.filter((user) => user.role === "employer");
        const jobseekers = users.filter((user) => user.role === "jobseeker");

        return {
            jobseekers: jobseekers.length,
            employers: employers.length,
            activeJobs: activeJobs.length,
        };
    }, [jobs, users]);

    const latestJobs = useMemo(() => {
        return jobs.filter((job) => job.status === "Active").slice(0, 3);
    }, [jobs]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.eyebrow}>Find your opportunity</Text>

                <Text style={styles.title}>
                    Find Your{"\n"}
                    <Text style={styles.blueText}>Dream Job</Text>
                </Text>

                <Text style={styles.subtitle}>
                    Search jobs, save opportunities, and track your applications
                    directly from your mobile.
                </Text>

                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => router.replace("/login")}
                >
                    <Text style={styles.mainButtonText}>Get Started</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Users size={24} color="#2563eb" />
                    <Text style={styles.statNumber}>
                        {loading ? "..." : stats.jobseekers}
                    </Text>
                    <Text style={styles.statLabel}>Jobseekers</Text>
                </View>

                <View style={styles.statCard}>
                    <Building2 size={24} color="#2563eb" />
                    <Text style={styles.statNumber}>
                        {loading ? "..." : stats.employers}
                    </Text>
                    <Text style={styles.statLabel}>Companies</Text>
                </View>

                <View style={styles.statCard}>
                    <Briefcase size={24} color="#2563eb" />
                    <Text style={styles.statNumber}>
                        {loading ? "..." : stats.activeJobs}
                    </Text>
                    <Text style={styles.statLabel}>Jobs</Text>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Latest Jobs</Text>

                {loading ? (
                    <ActivityIndicator color="#2563eb" />
                ) : latestJobs.length === 0 ? (
                    <Text style={styles.emptyText}>No jobs available yet.</Text>
                ) : (
                    latestJobs.map((job) => (
                        <View style={styles.jobPreview} key={job.id}>
                            <View style={styles.jobIcon}>
                                <Text>💼</Text>
                            </View>

                            <View style={styles.jobInfo}>
                                <Text style={styles.jobTitle}>{job.title}</Text>
                                <Text style={styles.jobCompany}>
                                    {job.company}
                                </Text>
                            </View>

                            <Text style={styles.jobType}>{job.type}</Text>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>Why Job Portal?</Text>
                <Text style={styles.aboutText}>
                    A simple platform that connects jobseekers with employers,
                    helps users find suitable jobs, and keeps applications
                    organized.
                </Text>

                <Text style={styles.categoryText}>
                    {categories.length} job categories available
                </Text>
            </View>
        </ScrollView>
    );}