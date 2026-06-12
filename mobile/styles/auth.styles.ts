import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fc",
        justifyContent: "center",
        padding: 22,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 21,
    },
    input: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        padding: 14,
        marginTop: 14,

    },
    button: {
        backgroundColor: "#2563eb",
        padding: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 4,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 16,
    },
    link: {
        color: "#2563eb",
        textAlign: "center",
        marginTop: 16,
        fontWeight: "800",
    },
    bottomText: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: 18,
        fontWeight: "600",
    },
    linkInline: {
        color: "#2563eb",
        fontWeight: "900",
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#f5f8fc",
        justifyContent: "center",
        padding: 22,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 12,
    },

    outlineButtonText: {
        color: "#111827",
        fontWeight: "800",
    },

    disabledLink: {
        color: "#9ca3af",
    },
    suggestionBox: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 14,
        marginBottom: 12,
        overflow: "hidden",
    },

    suggestionItem: {
        padding: 12,
        color: "#111827",
        fontWeight: "700",
    },
    skillChipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 14,
    },

    skillChip: {
        backgroundColor: "#eef3ff",
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 25,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 3,
    },

    skillChipText: {
        color: "#283593",
        fontWeight: "800",
        fontSize: 15,
    },
    passwordBox: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 14,
        marginBottom: 14,
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: "#111827",
    },
});