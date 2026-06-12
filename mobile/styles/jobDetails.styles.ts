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
    },
    loadingText: {
        color: "#6b7280",
        marginTop: 10,
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
        marginBottom: 14,
    },
    backText: {
        color: "#111827",
        fontWeight: "800",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },
    title: {
        fontSize: 25,
        fontWeight: "900",
        color: "#111827",
    },
    company: {
        color: "#6b7280",
        marginTop: 5,
    },
    saveBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#f3f7ff",
        justifyContent: "center",
        alignItems: "center",
    },
    aiBox: {
        marginTop: 18,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "rgba(109, 74, 255, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(109, 74, 255, 0.18)",
    },
    aiTitle: {
        color: "#6d4aff",
        fontWeight: "900",
        marginBottom: 5,
    },
    aiText: {
        color: "#374151",
        fontSize: 13,
    },
    aiAdvice: {
        color: "#6b7280",
        fontSize: 13,
        marginTop: 5,
        lineHeight: 19,
    },
    tagsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 16,
    },
    tag: {
        backgroundColor: "#f3f4f6",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 14,
        color: "#374151",
        fontSize: 12,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 8,
    },
    salary: {
        color: "#2563eb",
        fontSize: 20,
        fontWeight: "900",
    },
    bodyText: {
        color: "#374151",
        lineHeight: 22,
    },
    coverInput: {
        marginTop: 22,
        minHeight: 130,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        padding: 14,
        color: "#111827",
    },
    applyBtn: {
        backgroundColor: "#2563eb",
        padding: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
    },
    applyText: {
        color: "#ffffff",
        fontWeight: "900",
        fontSize: 16,
    },
});