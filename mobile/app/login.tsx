import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { API_BASE_URL } from "../constants/api";
import { styles } from "../styles/auth.styles";
import { Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing fields", "Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/Login/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                    role: "jobseeker",
                }),
            });

            if (response.ok) {
                const user = await response.json();

                await AsyncStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(user)
                );

                Alert.alert("Success", "Login successfully", [
                    {
                        text: "OK",
                        onPress: () => router.replace("/(tabs)/jobs"),
                    },
                ]);
            } else {
                const error = await response.text();

                if (error === "Please verify your email first") {
                    router.push({
                        pathname: "/verify-email",
                        params: {
                            email: email.trim(),
                            role: "jobseeker",
                        },
                    });
                    return;
                }

                Alert.alert("Login failed", error || "Invalid login");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Check backend and Wi-Fi IP.");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Jobseeker Login</Text>

                <Text style={styles.subtitle}>
                    Login to find jobs that match your skills
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text style={styles.bottomText}>
                        Don&apos;t have an account?{" "}
                        <Text style={styles.linkInline}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}