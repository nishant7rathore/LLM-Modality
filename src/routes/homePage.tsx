import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePreventNavigation } from "../hooks/preventNavigation";

const HomePage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prolificId, setProlificId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    usePreventNavigation("Please don't use the browser back button to navigate!");
    
    const startStudy = async() => {
        if (!prolificId.trim()) {
            setError("Please enter your Prolific ID!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = "http://localhost:5001/start";
            const res = await axios.post(url, { PROLIFIC_PID: prolificId });
            if (res.status === 200) {
                console.log("Study started successfully!");
                const token = res.data.token;
                const order = res.data.order;
                const userID = prolificId;
                // Saving the token, order in local storage
                localStorage.setItem("token", token);
                localStorage.setItem("order", order);
                localStorage.setItem("currentQuestionIndex", "0");
                // Navigating to the question page
                navigate("/instructions");

                // Using localstorage for building a data object to send to the backend
                localStorage.setItem("studyData", JSON.stringify({
                    userID: userID,
                    questionID: 0,
                    prompt: "",
                    response: "",
                    surveyAnswers: null
                }));
            }
        }
        catch (error) {
            console.error("Error starting study: ", error);
            setError("Error starting the study, please try again!");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50"
        >
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-5xl font-bold my-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                Welcome to the HCI User Study!
            </motion.h1>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md space-y-6"
            >
                <div className="space-y-2">
                    <label htmlFor="prolificId" className="block text-lg text-gray-700 font-medium">
                        Enter your Prolific ID
                    </label>
                    <motion.input
                        id="prolificId"
                        type="text"
                        value={prolificId}
                        onChange={(e) => setProlificId(e.target.value)}
                        whileFocus={{ scale: 1.01 }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent transition-all duration-200"
                        placeholder="Paste your Prolific ID here"
                    />
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                <motion.button 
                    onClick={startStudy} 
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                              text-xl font-semibold disabled:from-gray-400 disabled:to-gray-500 shadow-lg 
                              hover:shadow-xl transition-all duration-300"
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Loading...</span>
                        </div>
                    ) : 'Start Study'}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default HomePage;