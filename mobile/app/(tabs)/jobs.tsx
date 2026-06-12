import { useEffect, useState,useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Keyboard,
    Pressable,
} from "react-native";
import { styles } from "../../styles/jobs.styles";
import { router,useFocusEffect } from "expo-router";
import { Bookmark } from "lucide-react-native";

type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    skills: string;
    status: string;
    salaryMin: number;
    salaryMax: number;
    createdAt: string;
    applicantsCount: number;
};

export default function JobsScreen() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

    const [selectedType, setSelectedType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [dateFilter, setDateFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [showAllRecommended, setShowAllRecommended] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadPage();
        }, [])
    );

    function closeFilters() {
        Keyboard.dismiss();
        setShowFilters(false);
        setTitleSuggestions([]);
        setLocationSuggestions([]);
    }
    async function loadPage() {
        setLoading(true);

        await Promise.all([
            fetchJobs(),
            loadSavedJobs(),
            fetchRecommendedJobs(),
        ]);

        setLoading(false);
    }

    async function fetchJobs() {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`);
            const data = await response.json();

            setJobs(
                data.filter(
                    (job: Job) => job.status === "Active"
                )
            );

        } catch (error) {
            console.log("FETCH JOBS ERROR:", error);
        }
    }

    async function fetchRecommendedJobs() {
        try {
            const userData = await AsyncStorage.getItem("loggedInUser");
            if (!userData) return;

            const user = JSON.parse(userData);
            if (!user?.id) return;

            const response = await fetch(
                `${API_BASE_URL}/jobs/recommended/${user.id}`
            );

            if (!response.ok) {
                console.log("Recommended jobs error:", await response.text());
                return;
            }

            const data = await response.json();
            setRecommendedJobs(data);
        } catch (error) {
            console.log("RECOMMENDED JOBS ERROR:", error);
        }
    }

    async function loadSavedJobs() {
        const saved = await AsyncStorage.getItem("savedJobIds");
        setSavedJobIds(saved ? JSON.parse(saved) : []);
    }

    async function toggleSaveJob(jobId: number) {
        let updatedSavedJobs: number[];

        if (savedJobIds.includes(jobId)) {
            updatedSavedJobs = savedJobIds.filter((id) => id !== jobId);
            Alert.alert("Removed", "Job removed from saved jobs.");
        } else {
            updatedSavedJobs = [...savedJobIds, jobId];
            Alert.alert("Saved", "Job saved successfully.");
        }

        setSavedJobIds(updatedSavedJobs);
        await AsyncStorage.setItem("savedJobIds", JSON.stringify(updatedSavedJobs));
    }

    function isSaved(jobId: number) {
        return savedJobIds.includes(jobId);
    }

    function generateTitleSuggestions(value: string) {
        if (!value.trim()) {
            setTitleSuggestions([]);
            return;
        }

        const suggestions = jobs
            .filter((job) =>
                job.title?.toLowerCase().includes(value.toLowerCase())
            )
            .map((job) => job.title)
            .filter((title, index, array) => array.indexOf(title) === index)
            .slice(0, 8);

        setTitleSuggestions(suggestions);
    }

    async function generateLocationSuggestions(value: string) {
        if (!value.trim() || value.trim().length < 2) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/Location/search?query=${encodeURIComponent(value)}`
            );

            if (!response.ok) {
                setLocationSuggestions([]);
                return;
            }

            const data = await response.json();

            const cleaned = data
                .map((item: any) =>
                    typeof item === "string"
                        ? item
                        : item.name ?? item.location ?? ""
                )
                .filter((item: string) => item !== "");

            setLocationSuggestions(cleaned);
        } catch (error) {
            console.log("LOCATION SUGGESTION ERROR:", error);
            setLocationSuggestions([]);
        }
    }

    function getCompetitionLevel(count: number) {
        if (count <= 5) {
            return {
                text: "Low Competition",
                backgroundColor: "#e8f9ee",
                color: "#0d8a3b",
            };
        }

        if (count <= 15) {
            return {
                text: "Medium Competition",
                backgroundColor: "#fff5db",
                color: "#b37400",
            };
        }

        return {
            text: "High Competition",
            backgroundColor: "#ffe5e5",
            color: "#c62828",
        };
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

    function getSimpleMatch(job: Job) {
        const seekerSkills = [
            "communication",
            "react",
            "problem solving",
            "management",
        ];

        const jobSkills = (job.skills || "")
            .toLowerCase()
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

        if (jobSkills.length === 0) {
            return {
                score: 0,
                missingSkills: [],
                advice: "No required skills were added for this job.",
            };
        }

        const matchedSkills = jobSkills.filter((skill) =>
            seekerSkills.includes(skill)
        );

        const missingSkills = jobSkills.filter(
            (skill) => !seekerSkills.includes(skill)
        );

        const score = Math.round((matchedSkills.length / jobSkills.length) * 100);

        let advice = "";

        if (score >= 80) {
            advice = "Excellent match! You are highly qualified.";
        } else if (score >= 50) {
            advice = missingSkills.length
                ? `Good match. Learn ${missingSkills[0]} to improve.`
                : "Good match for this position.";
        } else {
            advice = missingSkills.length
                ? `Focus on learning ${missingSkills
                      .slice(0, 2)
                      .join(" and ")} first.`
                : "This job requires more preparation.";
        }

        return { score, missingSkills, advice };
    }

    const filteredJobs = jobs.filter((job) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            !search ||
            job.title?.toLowerCase().includes(keyword) ||
            job.company?.toLowerCase().includes(keyword) ||
            job.category?.toLowerCase().includes(keyword);

        const matchesLocation =
            !location ||
            job.location?.toLowerCase().includes(location.toLowerCase());

        const matchesType = selectedType === "All" || job.type === selectedType;

        const matchesCategory =
            selectedCategory === "All" || job.category === selectedCategory;

        const jobMinSalary = Number(job.salaryMin) || 0;
        const jobMaxSalary = Number(job.salaryMax) || 0;
        const userMinSalary = minSalary ? Number(minSalary) : null;
        const userMaxSalary = maxSalary ? Number(maxSalary) : null;

        const matchesSalary =
            (!userMinSalary || jobMaxSalary >= userMinSalary) &&
            (!userMaxSalary || jobMinSalary <= userMaxSalary);

        const daysOld = Math.floor(
            (new Date().getTime() - new Date(job.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
        );

        const matchesDate =
            dateFilter === "all" || daysOld <= Number(dateFilter);

        return (
            matchesSearch &&
            matchesLocation &&
            matchesType &&
            matchesCategory &&
            matchesSalary &&
            matchesDate
        );
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6d4aff" />
                <Text style={styles.loadingText}>Loading jobs...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.headerCard}>
                <Text style={styles.title}>Find Your Dream Job</Text>
                <Text style={styles.subtitle}>
                    Discover jobs that match your skills
                </Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search job title, company, category..."
                    value={search}
                    onChangeText={(text) => {
                        setSearch(text);
                        generateTitleSuggestions(text);
                    }}
                    onFocus={() => setShowFilters(true)}
                />

                {titleSuggestions.length > 0 && (
                    <View style={styles.suggestionBox}>
                        {titleSuggestions.map((title, index) => (
                            <TouchableOpacity
                                key={`${title}-${index}`}
                                onPress={() => {
                                    setSearch(title);
                                    setTitleSuggestions([]);
                                }}
                            >
                                <Text style={styles.suggestionItem}>
                                    🔎 {title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {showFilters && (
                <View style={styles.filterCard}>
                    <View style={styles.filterHeader}>
                        <Text style={styles.filterTitle}>Filter Jobs</Text>

                        <TouchableOpacity
                            onPress={() => {
                                setSearch("");
                                setLocation("");
                                setSelectedType("All");
                                setSelectedCategory("All");
                                setMinSalary("");
                                setMaxSalary("");
                                setDateFilter("all");
                                setTitleSuggestions([]);
                                setLocationSuggestions([]);
                                setShowFilters(false);
                            }}
                        >
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.filterLabel}>Location</Text>

                    <TextInput
                        style={styles.filterInput}
                        placeholder="Location"
                        value={location}
                        onChangeText={(text) => {
                            setLocation(text);
                            generateLocationSuggestions(text);
                        }}
                    />

                    {locationSuggestions.length > 0 && (
                        <View style={styles.suggestionBox}>
                            {locationSuggestions.map((city, index) => (
                                <TouchableOpacity
                                    key={`${city}-${index}`}
                                    onPress={() => {
                                        setLocation(city);
                                        setLocationSuggestions([]);
                                    }}
                                >
                                    <Text style={styles.suggestionItem}>
                                        📍 {city}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={styles.filterLabel}>Job Type</Text>

                    <View style={styles.optionRow}>
                        {["All", "Full Time", "Part Time", "Remote"].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.optionChip,
                                    selectedType === type && styles.optionChipActive,
                                ]}
                                onPress={() => setSelectedType(type)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedType === type &&
                                            styles.optionTextActive,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>Salary Range</Text>

                    <View style={styles.salaryRow}>
                        <TextInput
                            style={styles.salaryInput}
                            placeholder="Min Salary"
                            keyboardType="numeric"
                            value={minSalary}
                            onChangeText={setMinSalary}
                        />

                        <TextInput
                            style={styles.salaryInput}
                            placeholder="Max Salary"
                            keyboardType="numeric"
                            value={maxSalary}
                            onChangeText={setMaxSalary}
                        />
                    </View>

                    <Text style={styles.filterLabel}>Category</Text>

                    <View style={styles.optionRow}>
                        {[
                            "All",
                            "Information Technology",
                            "Design",
                            "Marketing",
                            "Mobile Development",
                        ].map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.optionChip,
                                    selectedCategory === category &&
                                        styles.optionChipActive,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedCategory === category &&
                                            styles.optionTextActive,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>Date Posted</Text>

                    <View style={styles.optionRow}>
                        {[
                            { label: "All Jobs", value: "all" },
                            { label: "Last 24 Hours", value: "1" },
                            { label: "Last 7 Days", value: "7" },
                            { label: "Last 30 Days", value: "30" },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.optionChip,
                                    dateFilter === item.value &&
                                        styles.optionChipActive,
                                ]}
                                onPress={() => setDateFilter(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        dateFilter === item.value &&
                                            styles.optionTextActive,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <Pressable onPress={closeFilters}>
                {recommendedJobs.length > 0 && (
                    <View style={styles.recommendedSection}>

                        <View style={styles.recommendedHeader}>
                            <Text style={styles.recommendedTitle}>
                                Recommended For You
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    setShowAllRecommended(!showAllRecommended)
                                }
                            >
                                <Text style={styles.viewAllText}>
                                    {showAllRecommended ? "Show Less" : "View All"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {recommendedJobs
                            .slice(
                                0,
                                showAllRecommended
                                    ? recommendedJobs.length
                                    : 3
                            )
                            .map((item) => {

                                const job = item.job;

                                return (
                                    <TouchableOpacity
                                        key={job.id}
                                        style={styles.recommendedCard}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/job-details",
                                                params: { id: job.id },
                                            })
                                        }
                                    >

                                        <View>
                                            <Text style={styles.recommendedJobTitle}>
                                                {job.title}
                                            </Text>

                                            <Text style={styles.recommendedCompany}>
                                                {job.company}
                                            </Text>
                                        </View>

                                        <View style={styles.matchBadge}>
                                            <Text style={styles.recommendedMatch}>
                                                {item.matchScore}% Match
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                )}
                <Text style={styles.showingText}>
                    Showing {filteredJobs.length} jobs
                </Text>

                {filteredJobs.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>No active jobs found.</Text>
                    </View>
                ) : (
                    filteredJobs.map((job) => {
                        const match = getSimpleMatch(job);
                        const competition = getCompetitionLevel(
                            job.applicantsCount || 0
                        );

                        return (
                            <TouchableOpacity
                                key={job.id}
                                style={styles.jobCard}
                                onPress={() =>
                                    router.push({
                                        pathname: "/job-details",
                                        params: { id: job.id },
                                    })
                                }
                            >
                                <View style={styles.cardTop}>
                                    <View style={styles.logoBox}>
                                        <Text style={styles.logoText}>💼</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.saveJobBtn}
                                        onPress={(event) => {
                                            event.stopPropagation();
                                            toggleSaveJob(job.id);
                                        }}
                                    >
                                        <Bookmark
                                            size={22}
                                            color="#111827"
                                            fill={
                                                isSaved(job.id)
                                                    ? "#111827"
                                                    : "none"
                                            }
                                            strokeWidth={2.2}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.jobTitle}>{job.title}</Text>

                                <Text style={styles.companyName}>
                                    {job.company}
                                </Text>

                                <View style={styles.tagsWrap}>
                                    <Text style={styles.tag}>📍 {job.location}</Text>
                                    <Text style={styles.tag}>💼 {job.type}</Text>
                                    <Text style={styles.tag}>🏷️ {job.category}</Text>
                                </View>

                                <View style={styles.aiBox}>
                                    <Text style={styles.aiTitle}>
                                        {match.score}% AI Match
                                    </Text>

                                    {match.missingSkills.length > 0 && (
                                        <Text style={styles.aiText}>
                                            Missing:{" "}
                                            {match.missingSkills.join(", ")}
                                        </Text>
                                    )}

                                    <Text style={styles.aiAdvice}>
                                        {match.advice}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.competitionBadge,
                                        {
                                            backgroundColor:
                                                competition.backgroundColor,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.competitionText,
                                            { color: competition.color },
                                        ]}
                                    >
                                        {competition.text}
                                    </Text>
                                </View>

                                <Text style={styles.postedDate}>
                                    {getPostedDateText(job.createdAt)}
                                </Text>

                                <View style={styles.bottomRow}>
                                    <Text style={styles.salary}>
                                        ${job.salaryMin || 0} - ${job.salaryMax || 0}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.applyButton}
                                        onPress={(event) => {
                                            event.stopPropagation();
                                            router.push({
                                                pathname: "/job-details",
                                                params: { id: job.id },
                                            });
                                        }}
                                    >
                                        <Text style={styles.applyText}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </Pressable>
        </ScrollView>
    );
}