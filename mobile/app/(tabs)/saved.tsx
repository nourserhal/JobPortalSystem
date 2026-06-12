import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../constants/api";
import { useFocusEffect } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Bookmark } from "lucide-react-native";


type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
};


export default function SavedJobsScreen() {

    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);


    useFocusEffect(
        useCallback(() => {
            loadSavedJobs();
        }, [])
    );


    async function loadSavedJobs() {
        try {
            setLoading(true);

            const saved = await AsyncStorage.getItem("savedJobIds");
            const savedIds = saved ? JSON.parse(saved) : [];

            const response = await fetch(`${API_BASE_URL}/jobs`);
            const jobs = await response.json();

            const filteredJobs = jobs.filter((job: Job) =>
                savedIds.includes(job.id)
            );

            setSavedJobs(filteredJobs);
        } catch (error) {
            console.log("SAVED JOBS ERROR:", error);
        } finally {
            setLoading(false);
        }
    }


    function removeSaved(jobId: number) {
        Alert.alert(
            "Remove Saved Job",
            "Are you sure you want to remove this job from your saved jobs?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {

                        const updated = savedJobs.filter(
                            (job) => job.id !== jobId
                        );

                        setSavedJobs(updated);

                        await AsyncStorage.setItem(
                            "savedJobIds",
                            JSON.stringify(
                                updated.map((job) => job.id)
                            )
                        );
                    },
                },
            ]
        );
    }



    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator 
                    size="large"
                    color="#2563eb"
                />

                <Text>
                    Loading saved jobs...
                </Text>

            </View>
        );
    }



    return (

        <ScrollView style={styles.container}>


            <Text style={styles.title}>
                Saved Jobs
            </Text>


            <Text style={styles.subtitle}>
                Jobs you saved for later.
            </Text>



            {
                savedJobs.length === 0 ? (

                    <View style={styles.emptyBox}>

                        <Text style={styles.emptyText}>
                            No saved jobs yet.
                        </Text>

                    </View>

                ) : (


                    savedJobs.map(job => (


                        <View 
                            key={job.id}
                            style={styles.card}
                        >


                            <TouchableOpacity
                                style={styles.bookmarkBtn}
                                onPress={() =>
                                    removeSaved(job.id)
                                }
                            >

                                <Bookmark
                                    size={22}
                                    color="#111827"
                                    fill="#111827"
                                />


                            </TouchableOpacity>




                            <Text style={styles.jobTitle}>
                                {job.title}
                            </Text>


                            <Text style={styles.company}>
                                {job.company}
                            </Text>




                            <View style={styles.tags}>

                                <Text style={styles.tag}>
                                    📍 {job.location}
                                </Text>


                                <Text style={styles.tag}>
                                    💼 {job.type}
                                </Text>


                                <Text style={styles.tag}>
                                    🏷️ {job.category}
                                </Text>

                            </View>




                            <TouchableOpacity
                                style={styles.viewBtn}
                                onPress={() =>
                                    router.push({
                                        pathname:"/job-details",
                                        params:{
                                            id:job.id
                                        }
                                    })
                                }
                            >

                                <Text style={styles.viewText}>
                                    View Job
                                </Text>

                            </TouchableOpacity>



                        </View>


                    ))

                )
            }


        </ScrollView>
    );
}




const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"#f5f8fc",
        padding:18,
    },


    center:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },


    title:{
        fontSize:28,
        fontWeight:"800",
        color:"#111827",
        marginTop:10,
    },


    subtitle:{
        color:"#6b7280",
        marginBottom:20,
    },


    emptyBox:{
        backgroundColor:"#fff",
        padding:30,
        borderRadius:20,
        alignItems:"center",
    },


    emptyText:{
        color:"#6b7280",
        fontWeight:"600",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 22,
        paddingRight: 78,
        marginBottom: 18,

        borderWidth: 1,
        borderColor: "#e5e7eb",

        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 10,

        elevation: 3,
    },

    bookmarkBtn: {
        position: "absolute",
        right: 12,
        top: 12,

        width: 54,
        height: 54,
        borderRadius: 21,
        
        backgroundColor: "#f3f7ff",
        justifyContent: "center",
        alignItems: "center",
    },


    jobTitle:{
        fontSize:20,
        fontWeight:"800",
        color:"#111827",
        marginBottom:5,
    },


    company:{
        color:"#6b7280",
        marginBottom:15,
    },



    tags:{
        flexDirection:"row",
        flexWrap:"wrap",
        gap:8,
    },


    tag:{
        backgroundColor:"#f3f4f6",
        paddingVertical:7,
        paddingHorizontal:10,
        borderRadius:14,
        fontSize:12,
    },



    viewBtn:{
        marginTop:18,

        backgroundColor:"#eaf2ff",

        padding:12,

        borderRadius:14,

        alignItems:"center",
    },


    viewText:{
        color:"#2563eb",
        fontWeight:"800",
    }

});