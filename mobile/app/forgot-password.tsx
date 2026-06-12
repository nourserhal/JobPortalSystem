import { useEffect, useState } from "react";
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

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [step, setStep] = useState(1);
    const [seconds, setSeconds] = useState(60);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (step !== 2 || seconds <= 0) return;

        const timer = setTimeout(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [seconds, step]);

    async function handleSendCode() {
        if (!email.trim()) {
            Alert.alert("Missing email", "Please enter your email");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/Login/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            if (response.ok) {
                Alert.alert("Sent", "Reset code sent to your email");
                setStep(2);
                setSeconds(60);
            } else {
                const error = await response.text();
                Alert.alert("Error", error);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Check backend and Wi-Fi IP.");
        }
    }

    async function handleResetPassword() {
        if (!code.trim() || !newPassword || !confirmPassword) {
            Alert.alert("Missing fields", "Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/Login/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        code: code.trim(),
                        newPassword,
                    }),
                }
            );

            if (response.ok) {
                Alert.alert("Success", "Password reset successfully", [
                    {
                        text: "OK",
                        onPress: () => router.replace("/login"),
                    },
                ]);
            } else {
                const error = await response.text();
                Alert.alert("Reset failed", error);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Check backend and Wi-Fi IP.");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </Text>

                <Text style={styles.subtitle}>
                    {step === 1
                        ? "Enter your email to receive a reset code"
                        : `OTP sent to\n${email}`}
                </Text>

                {step === 1 ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSendCode}
                        >
                            <Text style={styles.buttonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter OTP"
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                        />

                        <View style={styles.passwordBox}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="New Password"
                                value={newPassword}
                                onChangeText={setNewPassword}
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

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleResetPassword}
                        >
                            <Text style={styles.buttonText}>
                                Reset Password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={seconds > 0}
                            onPress={handleSendCode}
                        >
                            <Text
                                style={[
                                    styles.link,
                                    seconds > 0 && styles.disabledLink,
                                ]}
                            >
                                {seconds > 0
                                    ? `Resend code in ${seconds}s`
                                    : "Resend code"}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={() => router.replace("/login")}>
                    <Text style={styles.bottomText}>
                        Back to{" "}
                        <Text style={styles.linkInline}>Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}