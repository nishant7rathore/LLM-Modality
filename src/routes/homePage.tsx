import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const startStudy = async() => {
        // Check if token and userID already exists
        const existingToken = localStorage.getItem("token");
        const existingUserID = localStorage.getItem("userID");
        if (existingToken && existingUserID) {
            console.log("Study already started!");
            navigate("/instructions");
            return;
        }

        setLoading(true);
        try {
            const url = "http://localhost:5001/start";
            const res = await axios.post(url);
            if (res.status === 200) {
                console.log("Study started successfully!");
                const token = res.data.token;
                const userID = res.data.userID;
                // Saving the token and userID in local storage
                localStorage.setItem("token", token);
                localStorage.setItem("userID", userID);
                // Navigating to the question page
                navigate("/instructions");
            }
        }
        catch (error) {
            console.error("Error starting study: ", error);
        } 
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-400">
            <h1 className="text-4xl font-bold my-6">Welcome to the HCI User Study!</h1>
            <p className="text-lg mb-4">Click the button below to start the study.</p>
            <button 
                onClick={startStudy} 
                disabled={loading}
                className="px-6 py-3 bg-plexBlue text-white rounded-md text-lg font-semibold disabled:bg-gray-400 mb-4">
                {loading ? 'Loading...' : 'Start Study'}
            </button>
            <p>Your Token is: {token}</p>
        </div>
    );
}

export default HomePage;