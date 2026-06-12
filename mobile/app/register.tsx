import { useState,useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { API_BASE_URL } from "../constants/api";
import { styles } from "../styles/auth.styles";
import { Eye, EyeOff } from "lucide-react-native";

export default function RegisterScreen() {
    const [fullName, setFullName] = useState("");
    const [skills, setSkills] = useState("");
    const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
    const [experience, setExperience] = useState("");
    const [location, setLocation] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
    const [cv, setCv] = useState<any>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const scrollRef = useRef<ScrollView>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function scrollUp(y: number) {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                y,
                animated: true,
            });
        }, 250);
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
                `${API_BASE_URL}/Location/search?query=${encodeURIComponent(
                    value
                )}`
            );

            if (!response.ok) {
                setLocationSuggestions([]);
                return;
            }

            const data = await response.json();

            setLocationSuggestions(
                data.map((item: any) =>
                    typeof item === "string"
                        ? item
                        : item.name ?? item.location ?? ""
                ).filter((item: string) => item !== "")
            );
        } catch (error) {
            console.log(error);
            setLocationSuggestions([]);
        }
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

        setCv(result.assets[0]);
    }

    async function uploadCv() {
        if (!cv) return "";

        const formData = new FormData();

        formData.append("file", {
            uri: cv.uri,
            name: cv.name,
            type: cv.mimeType || "application/pdf",
        } as any);

        const response = await fetch(`${API_BASE_URL}/Upload/resume`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload CV");
        }

        const uploadedName = await response.text();
        return uploadedName.replace(/"/g, "");
    }

    async function handleRegister() {
        if (
            !fullName.trim() ||
            !skills.trim() ||
            !experience.trim() ||
            !location.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            Alert.alert("Missing fields", "Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            let uploadedCvName = "";

            if (cv) {
                uploadedCvName = await uploadCv();
            }

            const response = await fetch(`${API_BASE_URL}/Register/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: "jobseeker",
                    fullName: fullName.trim(),
                    skills: skills.trim(),
                    experience: experience.trim(),
                    location: location.trim(),
                    email: email.trim(),
                    password: password.trim(),
                    cvName: uploadedCvName,
                }),
            });

            if (response.ok) {
                Alert.alert("Success", "Verification code sent to your email", [
                    {
                        text: "OK",
                        onPress: () =>
                            router.push({
                                pathname: "/verify-email",
                                params: {
                                    email: email.trim(),
                                    role: "jobseeker",
                                },
                            }),
                    },
                ]);
            } else {
                const error = await response.text();
                Alert.alert("Register failed", error);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Check backend, Wi-Fi IP, or CV upload.");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={20}
        >
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1, backgroundColor: "#f5f8fc" }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.scrollContainer,
                    { paddingBottom: 260 }
                ]}
            >
            <View style={styles.card}>
                <Text style={styles.title}>Jobseeker Register</Text>

                <Text style={styles.subtitle}>
                    Create your account to start applying for jobs
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Skills e.g. React, JavaScript, CSS"
                    value={skills}
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

                <TextInput
                    style={styles.input}
                    placeholder="Experience"
                    value={experience}
                    onChangeText={setExperience}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
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

                <TouchableOpacity style={styles.outlineButton} onPress={pickCv}>
                    <Text style={styles.outlineButtonText}>
                        {cv ? `📄 ${cv.name}` : "Upload CV PDF"}
                    </Text>
                    
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onFocus={() => scrollUp(220)}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordBox}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => scrollUp(220)}
                        secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff size={22} color="#6b7280" />
                        ) : (
                            <Eye size={22} color="#6b7280" />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.passwordBox}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm Password"
                        onFocus={() => scrollUp(220)}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                    />

                    <TouchableOpacity
                        onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={22} color="#6b7280" />
                        ) : (
                            <Eye size={22} color="#6b7280" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text style={styles.bottomText}>
                        Already have an account?{" "}
                        <Text style={styles.linkInline}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
}