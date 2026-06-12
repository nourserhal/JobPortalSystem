import { useEffect, useState,useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Bookmark } from "lucide-react-native";
import { API_BASE_URL } from "../constants/api";
import { styles } from "../styles/jobDetails.styles";

type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    skills: string;
    description: string;
    requirements: string;
    salaryMin: number;
    salaryMax: number;
    createdAt: string;
};

export default function JobDetailsScreen() {
    const { id } = useLocalSearchParams();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const scrollRef = useRef<ScrollView>(null);
    function scrollUp(y: number) {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y,
                animated: true,
            });
        }, 250);
    }

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const userData = await AsyncStorage.getItem("loggedInUser");

            if (userData) {
                setLoggedInUser(JSON.parse(userData));
            }

            const response = await fetch(`${API_BASE_URL}/jobs`);
            const data = await response.json();

            const selectedJob = data.find(
                (item: Job) => item.id === Number(id)
            );

            setJob(selectedJob || null);

            const savedData = await AsyncStorage.getItem("savedJobIds");
            const savedIds = savedData ? JSON.parse(savedData) : [];

            setSaved(savedIds.includes(Number(id)));
        } catch (error) {
            console.log("JOB DETAILS ERROR:", error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleSaveJob() {
        if (!job) return;

        const savedData = await AsyncStorage.getItem("savedJobIds");
        let savedIds = savedData ? JSON.parse(savedData) : [];

        if (savedIds.includes(job.id)) {
            savedIds = savedIds.filter((savedId: number) => savedId !== job.id);
            setSaved(false);
            Alert.alert("Removed", "Job removed from saved jobs.");
        } else {
            savedIds.push(job.id);
            setSaved(true);
            Alert.alert("Saved", "Job saved successfully.");
        }

        await AsyncStorage.setItem("savedJobIds", JSON.stringify(savedIds));
    }

    function getPostedDateText(createdAt: string) {
        if (!createdAt) return "Posted date unavailable";

        const days = Math.floor(
            (new Date().getTime() - new Date(createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
        );

        if (days === 0) return "Posted today";
        if (days === 1) return "Posted 1 day ago";

        return `Posted ${days} days ago`;
    }

    function getJobMatch(job: Job) {
        const seekerSkills = (loggedInUser?.skills || "")
            .toLowerCase()
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);

        const jobSkills = (job.skills || "")
            .toLowerCase()
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);

        if (jobSkills.length === 0) {
            return {
                score: 0,
                missingSkills: [],
                advice: "No required skills were added for this job.",
            };
        }

        const matchedSkills = jobSkills.filter((skill: string) =>
            seekerSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(
            (skill: string) => !seekerSkills.includes(skill)
        );

        const score = Math.round(
            (matchedSkills.length / jobSkills.length) * 100
        );

        let advice = "";

        if (score >= 80) {
            advice = "Excellent match! You are highly qualified.";
        } else if (score >= 50) {
            advice = missingSkills.length
                ? `Good match. Consider learning ${missingSkills[0]} to improve.`
                : "Good match for this position.";
        } else {
            advice = missingSkills.length
                ? `Focus on learning ${missingSkills
                      .slice(0, 2)
                      .join(" and ")} first.`
                : "This job requires additional preparation.";
        }

        return { score, missingSkills, advice };
    }

    async function handleApply() {
        if (!loggedInUser) {
            Alert.alert("Login required", "Please login first.");
            router.replace("/login");
            return;
        }

        if (!job) return;

        const application = {
            applicantName: loggedInUser.fullName || "Jobseeker",
            applicantEmail: loggedInUser.email,
            resumeUrl: loggedInUser.cvName || "No CV uploaded",
            status: "Applied",
            jobId: job.id,
            coverLetter: coverLetter,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(application),
            });

            if (response.ok) {
                Alert.alert("Success", "Application submitted successfully!");
                setCoverLetter("");
            } else {
                const error = await response.text();
                Alert.alert("Apply failed", error);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Please try again.");
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading job details...</Text>
            </View>
        );
    }

    if (!job) {
        return (
            <View style={styles.center}>
                <Text style={styles.loadingText}>Job not found.</Text>
            </View>
        );
    }

    const match = getJobMatch(job);

    return (
        <ScrollView ref={scrollRef} style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 360 }}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <ArrowLeft size={18} color="#111827" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{job.title}</Text>
                        <Text style={styles.company}>{job.company}</Text>
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={toggleSaveJob}>
                        <Bookmark
                            size={22}
                            color="#111827"
                            fill={saved ? "#111827" : "none"}
                            strokeWidth={2.2}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.aiBox}>
                    <Text style={styles.aiTitle}>{match.score}% AI Match</Text>

                    {match.missingSkills.length > 0 && (
                        <Text style={styles.aiText}>
                            Missing: {match.missingSkills.join(", ")}
                        </Text>
                    )}

                    <Text style={styles.aiAdvice}>{match.advice}</Text>
                </View>

                <View style={styles.tagsWrap}>
                    <Text style={styles.tag}>📍 {job.location}</Text>
                    <Text style={styles.tag}>💼 {job.type}</Text>
                    <Text style={styles.tag}>🏷️ {job.category}</Text>
                    <Text style={styles.tag}>🗓️ {getPostedDateText(job.createdAt)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Salary Range</Text>
                    <Text style={styles.salary}>
                        ${job.salaryMin || 0} - ${job.salaryMax || 0}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Job Description</Text>
                    <Text style={styles.bodyText}>{job.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements</Text>
                    <Text style={styles.bodyText}>{job.requirements}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <Text style={styles.bodyText}>{job.skills}</Text>
                </View>

                <TextInput
                    style={styles.coverInput}
                    placeholder="Write your cover letter..."
                    value={coverLetter}
                    onFocus={() => scrollUp(750)}
                    onChangeText={setCoverLetter}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                    <Text style={styles.applyText}>Apply Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}