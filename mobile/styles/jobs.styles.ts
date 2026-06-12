import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8fc",
        padding: 18,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#f5f8fc",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        color: "#666",
    },
    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 22,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    title: {
        fontSize: 27,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        color: "#6b7280",
        marginTop: 6,
        marginBottom: 18,
    },
    searchInput: {
        backgroundColor: "#f7f7fb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14,
        padding: 14,
    },
    suggestionBox: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        overflow: "hidden",
    },
    suggestionItem: {
        padding: 12,
        color: "#111827",
        fontWeight: "600",
    },
    filterCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    clearText: {
        color: "#2563eb",
        fontWeight: "800",
    },
    filterLabel: {
        marginTop: 16,
        marginBottom: 8,
        color: "#111827",
        fontWeight: "800",
    },
    filterInput: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 12,
    },
    optionRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    optionChip: {
        backgroundColor: "#f3f4f6",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 14,
    },
    optionChipActive: {
        backgroundColor: "#2563eb",
    },
    optionText: {
        color: "#374151",
        fontSize: 12,
        fontWeight: "700",
    },
    optionTextActive: {
        color: "#ffffff",
    },
    salaryRow: {
        flexDirection: "row",
        gap: 10,
    },
    salaryInput: {
        flex: 1,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 12,
    },
    showingText: {
        color: "#6b7280",
        fontWeight: "600",
        marginBottom: 12,
    },
    emptyBox: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 24,
    },
    emptyText: {
        color: "#6b7280",
        textAlign: "center",
    },
    jobCard: {
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 22,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoBox: {
        width: 54,
        height: 54,
        borderRadius: 15,
        backgroundColor: "#eaf2ff",
        justifyContent: "center",
        alignItems: "center",
    },
    logoText: {
        fontSize: 24,
    },
    saveJobBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#f3f7ff",
        justifyContent: "center",
        alignItems: "center",
    },
    jobTitle: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
    },
    companyName: {
        color: "#6b7280",
        marginTop: 4,
        marginBottom: 14,
    },
    tagsWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 14,
    },
    outsideArea: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    recommendedSection: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
},

recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
},

recommendedTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
},

viewAllText: {
    color: "#2563eb",
    fontWeight: "800",
},

recommendedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
},

recommendedJobTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
},

recommendedCompany: {
    marginTop: 3,
    color: "#6b7280",
    fontSize: 13,
},

matchBadge: {
    backgroundColor: "#e8f9ee",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
},

recommendedMatch: {
    color: "#0d8a3b",
    fontSize: 12,
    fontWeight: "800",
},
    tag: {
        backgroundColor: "#f3f4f6",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 14,
        fontSize: 12,
        color: "#374151",
    },
    aiBox: {
        marginTop: 8,
        padding: 12,
        borderRadius: 15,
        backgroundColor: "rgba(109, 74, 255, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(109, 74, 255, 0.18)",
    },
    aiTitle: {
        color: "#6d4aff",
        fontWeight: "800",
        marginBottom: 5,
    },
    aiText: {
        color: "#444",
        fontSize: 13,
    },
    aiAdvice: {
        color: "#666",
        fontSize: 13,
        marginTop: 5,
        lineHeight: 18,
    },
    competitionBadge: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        alignSelf: "flex-start",
    },
    competitionText: {
        fontWeight: "700",
        fontSize: 12,
    },
    postedDate: {
        color: "#6b7280",
        fontSize: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingBottom: 14,
        marginTop: 12,
    },
    bottomRow: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    salary: {
        color: "#2563eb",
        fontSize: 17,
        fontWeight: "800",
    },
    applyButton: {
        backgroundColor: "#eaf2ff",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    applyText: {
        color: "#1d4ed8",
        fontWeight: "800",
    },

});