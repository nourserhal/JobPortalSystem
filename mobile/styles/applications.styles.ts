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
        marginTop: 10,
        color: "#6b7280",
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#111827",
        marginTop: 10,
    },
    subtitle: {
        color: "#6b7280",
        marginTop: 5,
        marginBottom: 20,
    },
    emptyBox: {
        backgroundColor: "#ffffff",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
    },
    emptyText: {
        color: "#6b7280",
        fontWeight: "700",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    jobTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#111827",
    },
    company: {
        color: "#6b7280",
        marginTop: 4,
        marginBottom: 12,
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginBottom: 12,
    },
    statusApplied: {
        backgroundColor: "#eaf2ff",
    },
    statusPending: {
        backgroundColor: "#fff5db",
    },
    statusAccepted: {
        backgroundColor: "#e8f9ee",
    },
    statusRejected: {
        backgroundColor: "#ffe5e5",
    },
    statusText: {
        color: "#111827",
        fontWeight: "800",
        fontSize: 12,
    },
    dateText: {
        color: "#6b7280",
        marginBottom: 14,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 10,
    },
    viewBtn: {
        flex: 1,
        backgroundColor: "#eaf2ff",
        padding: 12,
        borderRadius: 14,
        alignItems: "center",
    },
    viewText: {
        color: "#2563eb",
        fontWeight: "900",
    },
    letterBtn: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        padding: 12,
        borderRadius: 14,
        alignItems: "center",
    },
    letterText: {
        color: "#111827",
        fontWeight: "900",
    },
    withdrawBtn: {
        marginTop: 12,
        backgroundColor: "#ffe5e5",
        padding: 12,
        borderRadius: 14,
        alignItems: "center",
    },
    withdrawText: {
        color: "#c62828",
        fontWeight: "900",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 22,
    },
    modalCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 22,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#111827",
        marginBottom: 14,
    },
    coverLetterText: {
        color: "#374151",
        lineHeight: 22,
    },
    closeBtn: {
        backgroundColor: "#2563eb",
        padding: 13,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 18,
    },
    closeText: {
        color: "#ffffff",
        fontWeight: "900",
    },
});