import { useEffect, useState ,useCallback} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
} from "react-native";
import { router,useFocusEffect  } from "expo-router";
import { API_BASE_URL } from "../../constants/api";
import { styles } from "../../styles/applications.styles";

type Application = {
    id: number;
    applicantEmail: string;
    status: string;
    appliedDate: string;
    resumeUrl: string;
    coverLetter: string;
    jobId: number;
    job?: {
        id: number;
        title: string;
        company: string;
    };
};

export default function ApplicationsScreen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCoverLetter, setSelectedCoverLetter] = useState("");
    const [loggedInEmail, setLoggedInEmail] = useState("");

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

    async function loadUser() {
        const userData = await AsyncStorage.getItem("loggedInUser");

        if (!userData) {
            setLoading(true);
            Alert.alert("Login required", "Please login first.");
            router.replace("/login");
            return;
        }

        const user = JSON.parse(userData);
        setLoggedInEmail(user.email);
        fetchApplications(user.email);
    }

    async function fetchApplications(email: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/Applications`);
            const data = await response.json();

            const myApps = data.filter(
                (app: Application) =>
                    app.applicantEmail?.toLowerCase() === email.toLowerCase()
            );

            setApplications(myApps);
        } catch (error) {
            console.log("APPLICATIONS ERROR:", error);
        } finally {
            setLoading(false);
        }
    }

    async function withdrawApplication(app: Application) {
        if (app.status === "Accepted" || app.status === "Rejected") {
            Alert.alert(
                "Not allowed",
                "You cannot withdraw an accepted or rejected application."
            );
            return;
        }

        Alert.alert("Withdraw Application", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Withdraw",
                style: "destructive",
                onPress: async () => {
                    try {
                        const response = await fetch(
                            `${API_BASE_URL}/Applications/${app.id}`,
                            { method: "DELETE" }
                        );

                        if (response.ok) {
                            Alert.alert("Success", "Application withdrawn.");
                            fetchApplications(loggedInEmail);
                        } else {
                            Alert.alert("Error", "Failed to withdraw.");
                        }
                    } catch (error) {
                        console.log(error);
                        Alert.alert("Server error", "Please try again.");
                    }
                },
            },
        ]);
    }

    function getStatusStyle(status: string) {
        const clean = status?.toLowerCase();

        if (clean === "accepted") return styles.statusAccepted;
        if (clean === "rejected") return styles.statusRejected;
        if (clean === "pending") return styles.statusPending;

        return styles.statusApplied;
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Applications</Text>
            <Text style={styles.subtitle}>
                Track the status of jobs you applied to.
            </Text>

            {applications.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No applications yet.</Text>
                </View>
            ) : (
                applications.map((app) => (
                    <View key={app.id} style={styles.card}>
                        <Text style={styles.jobTitle}>
                            {app.job?.title || "Unknown Job"}
                        </Text>

                        <Text style={styles.company}>
                            {app.job?.company || "Unknown Company"}
                        </Text>

                        <View
                            style={[
                                styles.statusBadge,
                                getStatusStyle(app.status),
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {app.status || "Applied"}
                            </Text>
                        </View>

                        <Text style={styles.dateText}>
                            Applied:{" "}
                            {app.appliedDate
                                ? new Date(app.appliedDate).toLocaleDateString()
                                : "Unknown date"}
                        </Text>

                        <View style={styles.actionsRow}>
                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() =>
                                    router.push({
                                        pathname: "/job-details",
                                        params: { id: app.jobId },
                                    })
                                }
                            >
                                <Text style={styles.viewText}>View Job</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.letterBtn}
                                onPress={() =>
                                    setSelectedCoverLetter(
                                        app.coverLetter ||
                                            "No cover letter submitted."
                                    )
                                }
                            >
                                <Text style={styles.letterText}>
                                    Cover Letter
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {app.status !== "Accepted" &&
                            app.status !== "Rejected" && (
                                <TouchableOpacity
                                    style={styles.withdrawBtn}
                                    onPress={() => withdrawApplication(app)}
                                >
                                    <Text style={styles.withdrawText}>
                                        Withdraw
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>
                ))
            )}

            <Modal
                visible={!!selectedCoverLetter}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedCoverLetter("")}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>My Cover Letter</Text>

                        <Text style={styles.coverLetterText}>
                            {selectedCoverLetter}
                        </Text>

                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setSelectedCoverLetter("")}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}