import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Linking,
} from "react-native";
import { useRef } from "react";
import { API_BASE_URL } from "../../constants/api";
import { styles } from "../../styles/profile.styles";
import { router } from "expo-router";

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [location, setLocation] = useState("");
    const [cvName, setCvName] = useState("");
    const [cvFile, setCvFile] = useState<any>(null);

    const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
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
        loadUser();
    }, []);
    function openResume() {
        if (!cvName) {
            Alert.alert("No resume", "No resume uploaded.");
            return;
        }

        Linking.openURL(`${API_BASE_URL.replace("/api", "")}/uploads/${cvName}`);
    }

    async function handleLogout() {
        await AsyncStorage.removeItem("loggedInUser");
        router.replace("/login");
    }

    async function loadUser() {
        const userData = await AsyncStorage.getItem("loggedInUser");

        if (!userData) {
            setLoading(false);
            return;
        }

        const parsedUser = JSON.parse(userData);

        setUser(parsedUser);
        setFullName(parsedUser.fullName || "");
        setEmail(parsedUser.email || "");
        setSkills(parsedUser.skills || "");
        setExperience(parsedUser.experience || "");
        setLocation(parsedUser.location || "");
        setCvName(parsedUser.cvName || "");

        setLoading(false);
    }

    async function generateSkillSuggestions(value: string) {
        if (!value || value.trim().length < 1) {
            setSkillSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/Ai/skills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: value,
                    description: experience,
                    requirements: skills,
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

    async function generateLocationSuggestions(value: string) {
        if (!value || value.trim().length < 2) {
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

            setLocationSuggestions(
                data
                    .map((item: any) =>
                        typeof item === "string"
                            ? item
                            : item.name ?? item.location ?? ""
                    )
                    .filter((item: string) => item !== "")
            );
        } catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
    }
    async function handleDeleteAccount() {
        if (!user?.id) {
            Alert.alert("Error", "User not found.");
            return;
        }

        Alert.alert(
            "Delete Account",
            "Are you sure? This will delete your account permanently.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(
                                `${API_BASE_URL}/User/${user.id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            if (response.ok) {
                                await AsyncStorage.removeItem("loggedInUser");
                                Alert.alert("Deleted", "Your account was deleted.");
                                router.replace("/login");
                            } else {
                                const error = await response.text();
                                Alert.alert("Delete failed", error);
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Server error", "Failed to delete account.");
                        }
                    },
                },
            ]
        );
    }

    function addSkill(skill: string) {
        const skillsArray = skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

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
    }

    async function pickCv() {
        const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: true,
        });

        if (result.canceled) return;

        setCvFile(result.assets[0]);
    }

    async function uploadCv() {
        if (!cvFile) return cvName;

        const formData = new FormData();

        formData.append("file", {
            uri: cvFile.uri,
            name: cvFile.name,
            type: cvFile.mimeType || "application/pdf",
        } as any);

        const response = await fetch(`${API_BASE_URL}/Upload/resume`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload resume");
        }

        const uploadedName = await response.text();
        return uploadedName.replace(/"/g, "");
    }

    async function handleSave() {
        if (!user?.id) {
            Alert.alert("Error", "User not found. Please login again.");
            return;
        }

        try {
            const uploadedCvName = await uploadCv();

            const updatedUser = {
                ...user,
                fullName,
                email,
                skills,
                experience,
                location,
                cvName: uploadedCvName,
            };

            const response = await fetch(`${API_BASE_URL}/User/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                const updatedData = await response.json();

                await AsyncStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(updatedData)
                );

                setUser(updatedData);
                setCvName(updatedData.cvName || uploadedCvName);
                setCvFile(null);
                setIsEditing(false);

                Alert.alert("Success", "Profile updated successfully.");
            } else {
                Alert.alert("Error", "Failed to update profile.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Profile update failed.");
        }
    }

    function cancelEdit() {
        setFullName(user?.fullName || "");
        setEmail(user?.email || "");
        setSkills(user?.skills || "");
        setExperience(user?.experience || "");
        setLocation(user?.location || "");
        setCvName(user?.cvName || "");
        setCvFile(null);
        setSkillSuggestions([]);
        setLocationSuggestions([]);
        setIsEditing(false);
    }

    function getCleanFileName(fileName: string) {
        if (!fileName) return "";

        const parts = fileName.split("_");

        if (parts.length > 1) {
            parts.shift();
            return parts.join("_");
        }

        return fileName;
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Please login first.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
        >
            <ScrollView
                ref={scrollRef}
                style={styles.container}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 260 }}
            >
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>
                            {isEditing ? "Edit Profile" : "Jobseeker Profile"}
                    </Text>

                    {!isEditing && (
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => setIsEditing(true)}
                        >
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {!isEditing ? (
                    <>
                        <View style={styles.avatarRow}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {(fullName || "J").charAt(0).toUpperCase()}
                                </Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.name}>
                                    {fullName || "Jobseeker"}
                                </Text>
                                <Text style={styles.email}>{email}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={styles.sectionTitle}>
                                Professional Information
                            </Text>

                            <Text style={styles.infoText}>
                                <Text style={styles.bold}>Skills: </Text>
                                {skills || "Not provided"}
                            </Text>

                            <Text style={styles.infoText}>
                                <Text style={styles.bold}>Experience: </Text>
                                {experience || "Not provided"}
                            </Text>

                            <Text style={styles.infoText}>
                                <Text style={styles.bold}>Location: </Text>
                                {location || "Not provided"}
                            </Text>

                            <View style={styles.resumeRow}>
                                <Text style={styles.bold}>Resume: </Text>

                                {cvName ? (
                                    <TouchableOpacity onPress={openResume}>
                                        <Text style={styles.resumeLink}>
                                            📄 {getCleanFileName(cvName)}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.infoText}>No resume uploaded</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
                            <Text style={styles.deleteText}>Delete Account</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Full Name"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            placeholder="Location"
                            onFocus={() => scrollUp(220)}
                            onChangeText={(text) => {
                                setLocation(text);
                                generateLocationSuggestions(text);
                            }}
                        />

                        {locationSuggestions.length > 0 && (
                            <View style={styles.suggestionBox}>
                                {locationSuggestions.map((loc, index) => (
                                    <TouchableOpacity
                                        key={`${loc}-${index}`}
                                        onPress={() => {
                                            setLocation(loc);
                                            setLocationSuggestions([]);
                                        }}
                                    >
                                        <Text style={styles.suggestionItem}>
                                            📍 {loc}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Text style={styles.label}>Skills</Text>
                        <TextInput
                            style={styles.input}
                            value={skills}
                            placeholder="Skills"
                            onFocus={() => scrollUp(220)}
                            onChangeText={(text) => {
                                setSkills(text);
                                generateSkillSuggestions(text);
                            }}
                        />

                        {skillSuggestions.length > 0 && (
                            <View style={styles.skillChipContainer}>
                                {skillSuggestions.map((skill, index) => (
                                    <TouchableOpacity
                                        key={`${skill}-${index}`}
                                        style={styles.skillChip}
                                        onPress={() => addSkill(skill)}
                                    >
                                        <Text style={styles.skillChipText}>
                                            {skill}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <Text style={styles.label}>Experience</Text>
                        <TextInput
                            style={styles.input}
                            value={experience}
                            onFocus={() => scrollUp(220)}
                            onChangeText={setExperience}
                            placeholder="Experience"
                        />

                        <Text style={styles.label}>Resume</Text>
                        <TouchableOpacity
                            style={styles.outlineBtn}
                            onPress={pickCv}
                        >
                            <Text style={styles.outlineText}>
                                {cvFile
                                    ? `📄 ${cvFile.name}`
                                    : cvName
                                    ? `Current: ${getCleanFileName(cvName)}`
                                    : "Upload Resume PDF"}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.actionsRow}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={cancelEdit}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveText}>
                                    Save Changes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
       </ScrollView> 
        </KeyboardAvoidingView>
    );
}