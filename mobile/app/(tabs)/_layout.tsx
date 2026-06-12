import { Tabs } from "expo-router";
import React from "react";

import { Bookmark, Briefcase, FileText, User } from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#2563eb",
                tabBarInactiveTintColor: "#6b7280",

                tabBarStyle: {
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "700",
                },
            }}
        >

            <Tabs.Screen
                name="jobs"
                options={{
                    title: "Jobs",
                    tabBarIcon: ({ color }) => (
                        <Briefcase size={24} color={color} />
                    ),
                }}
            />


            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    tabBarIcon: ({ color }) => (
                        <Bookmark size={24} color={color} />
                    ),
                }}
            />


            <Tabs.Screen
                name="applications"
                options={{
                    title: "Applications",
                    tabBarIcon: ({ color }) => (
                        <FileText size={24} color={color} />
                    ),
                }}
            />


            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <User size={24} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
}