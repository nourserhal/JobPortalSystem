import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "../constants/api";
import { styles } from "../styles/auth.styles";

export default function VerifyEmailScreen() {
    const params = useLocalSearchParams();

    const email = String(params.email || "");
    const role = String(params.role || "jobseeker");

    const [code, setCode] = useState("");
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (!email) {
            router.replace("/login");
        }
    }, []);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setTimeout(() => {
            setSeconds(seconds - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [seconds]);

    async function handleVerify() {
        if (!code.trim()) {
            Alert.alert("Missing code", "Please enter verification code");
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/Register/verify-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        code: code.trim(),
                    }),
                }
            );

            if (response.ok) {
                Alert.alert("Success", "Email verified successfully", [
                    {
                        text: "OK",
                        onPress: () => router.replace("/login"),
                    },
                ]);
            } else {
                const error = await response.text();
                Alert.alert("Verification failed", error);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Server error", "Check backend and Wi-Fi IP.");
        }
    }

    async function resendCode() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/Register/resend-code`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                Alert.alert("Sent", "New verification code sent");
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

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Verify Email</Text>

                <Text style={styles.subtitle}>
                    Verification code sent to{"\n"}
                    {email}
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                />

                <TouchableOpacity style={styles.button} onPress={handleVerify}>
                    <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.outlineButtonText}>
                        Wrong email? Go back
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={seconds > 0}
                    onPress={resendCode}
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
            </View>
        </View>
    );
}