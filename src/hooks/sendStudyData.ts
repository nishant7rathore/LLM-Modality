// Custom hook to send the study data object to the backend
import axios from "axios";
import { useState } from "react";

const useSendStudyData = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendStudyData = async (studyData: any) => {
        setLoading(true);
        setError(null);
        console.log("Sending study data customHook: ", studyData);
        try {
            const url = "http://localhost:5001/api/db";
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found!");
            }
            console.log("Sending study data customHook: ", studyData);
            const response = await axios.post(url, studyData, { 
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                } 
            });
            console.log("Response from backend: ", response);
        } 
        catch (error: any) {
            console.error("Error sending study data: ", error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return { sendStudyData, loading, error };
};

export default useSendStudyData;