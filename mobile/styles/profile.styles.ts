import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fc",
        padding: 18,
    },
    center: {
        flex: 1,
        backgroundColor: "#f5f8fc",
        justifyContent: "center",
        alignItems: "center",
        padding: 22,
    },
    loadingText: {
        color: "#6b7280",
        marginTop: 10,
    },
    emptyText: {
        color: "#6b7280",
        fontWeight: "700",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginTop: 10,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    title: {
        fontSize: 25,
        fontWeight: "900",
        color: "#111827",
    },
    editBtn: {
        backgroundColor: "#eaf2ff",
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 12,
    },
    editText: {
        color: "#2563eb",
        fontWeight: "900",
    },
    avatarRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#ffffff",
        fontSize: 26,
        fontWeight: "900",
    },
    name: {
        fontSize: 21,
        fontWeight: "900",
        color: "#111827",
    },
    email: {
        color: "#6b7280",
        marginTop: 4,
    },
    infoBox: {
        backgroundColor: "#f9fafb",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 12,
    },
    infoText: {
        color: "#374151",
        lineHeight: 23,
        marginBottom: 8,
    },
    bold: {
        fontWeight: "900",
        color: "#111827",
    },
    label: {
        color: "#111827",
        fontWeight: "800",
        marginBottom: 7,
        marginTop: 12,
    },
    input: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        padding: 14,
    },
    suggestionBox: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 14,
        marginTop: 8,
        overflow: "hidden",
    },
    suggestionItem: {
        padding: 12,
        color: "#111827",
        fontWeight: "700",
    },
    outlineBtn: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        padding: 14,
        backgroundColor: "#f9fafb",
    },
    outlineText: {
        color: "#111827",
        fontWeight: "800",
    },
    actionsRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
    },
    cancelText: {
        color: "#111827",
        fontWeight: "900",
    },
    saveBtn: {
        flex: 1,
        backgroundColor: "#2563eb",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
    },
    saveText: {
        color: "#ffffff",
        fontWeight: "900",
    },
    resumeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: 4,
    },

    resumeLink: {
        color: "#2563eb",
        fontWeight: "900",
        textDecorationLine: "underline",
    },

    logoutBtn: {
        marginTop: 18,
        backgroundColor: "#ffe5e5",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    logoutText: {
        color: "#c62828",
        fontWeight: "900",
    },
    deleteBtn: {
        marginTop: 10,
        backgroundColor: "#dc2626",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    deleteText: {
        color: "#ffffff",
        fontWeight: "900",
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
});