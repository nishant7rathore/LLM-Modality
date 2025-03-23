import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSendStudyData from "../hooks/sendStudyData";
import { motion } from "framer-motion";
import { usePreventNavigation } from "../hooks/preventNavigation";

// Main Survey Page component
const SurveyPage = () => {
    const navigate = useNavigate();
    const { sendStudyData } = useSendStudyData();
    usePreventNavigation("Please don't use the browser back button to navigate!");

    const likertQuestions = [
        "I felt involved in the creation of [text generated OR image generated].",
        "I was the author/creator of [text generated OR image generated].",
        "I provided significant effort to create [text generated OR image generated].",
        "I felt the creation of [text generated OR image generated] was original work.",
        "I felt I copied someone else’s work to create [text generated OR image generated].",
        "I provided a significant contribution to create [text generated OR image generated].",
        "The AI system provided a significant contribution to create [text generated OR image generated].",
        "I controlled the creation of [text generated OR image generated].",
        "The AI controlled the creation of [text generated OR image generated].",
        "I feel I personally own [text generated OR image generated].",
        "I feel I was responsible for [text generated OR image generated].",
        "I feel emotionally connected to the [text generated OR image generated].",
        "I feel personally connected to the [text generated OR image generated]."
    ];

    const textQuestions = [
        "Which method did you prefer to write generative AI prompts for? Why or why not?",
        "Do you have any additional comments you would like to share?"
    ];

    const nasaTLXQuestions = [
        "Mental Demand: How mentally demanding was the task?",
        "Physical Demand: How physically demanding was the task?",
        "Temporal Demand: How hurried or rushed was the pace of the task?",
        "Performance: How successful were you in accomplishing what you were asked to do?",
        "Effort: How hard did you have to work to accomplish your level of performance?",
        "Frustration: How insecure, discouraged, irritated, stressed, and annoyed were you?"
    ]

    // Setting up initial state for the survey questions
    const [likertQs, setLikertQs] = useState<{ [key: number]: number }>(() => {
        const initialValues: { [key: number]: number } = {};
        for (let i = 0; i < likertQuestions.length; i++) {
            initialValues[i] = 3;
        }
        return initialValues;
    });

    const [textQs, setTextQs] = useState<{ [key: number]: string }>(() => {
        const initialValues: { [key: number]: string } = {};
        for (let i = 0; i < textQuestions.length; i++) {
            initialValues[i] = "";
        }
        return initialValues;
    });

    const [nasaTLXQs, setNasaTLXQs] = useState<{ [key: number]: number }>(() => {
        const initialValues: { [key: number]: number } = {};
        for (let i = 0; i < nasaTLXQuestions.length; i++) {
            initialValues[i] = 3;
        }
        return initialValues;
    });

    const handleLikertChange = (qIndex: number, value: number) => {
        setLikertQs(prev => ({ ...prev, [qIndex]: value }));
    };

    const handleTextChange = (qIndex: number, value: string) => {
        setTextQs(prev => ({ ...prev, [qIndex]: value }));
    };

    const handleNasaTLXChange = (qIndex: number, value: number) => {
        setNasaTLXQs(prev => ({ ...prev, [qIndex]: value }));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Store the survey answers in localStorage
        localStorage.setItem("studyData", JSON.stringify(({
            ...JSON.parse(localStorage.getItem("studyData") || "{}"),
            surveyAnswers: { likertQs, textQs, nasaTLXQs }
        })));

        // Send the whole data for the question to the backend
        await sendStudyData(localStorage.getItem("studyData"));

        // Navigate to next question or end of survey (HARDCODED TO 5 QUESTIONS)
        const currentQuestionIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0");
        if (currentQuestionIndex < 5) {
            navigate("/prompt");
        }
        else {
            // clear the local storage
            localStorage.removeItem("studyData");
            localStorage.removeItem("currentQuestionIndex");
            localStorage.removeItem("order");
            localStorage.removeItem("token");
            navigate("/end");
        }
    };
    
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const questionVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 }
    };

    return (
        <motion.div 
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4"
        >
             <motion.div 
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                    Study Survey
                </motion.h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Likert Scale Questions */}
                    <motion.section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience Rating</h2>
                        {likertQuestions.map((question, index) => (
                            <motion.div 
                                key={index}
                                variants={questionVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                            >
                                <p className="mb-4 text-gray-700">{question}</p>
                                <motion.div className="w-full">
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={likertQs[index] || 3}
                                        onChange={(e) => handleLikertChange(index, parseInt(e.target.value))}
                                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between mt-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <div key={value} className="flex flex-col items-center">
                                                <div className="h-3 w-px bg-gray-300"/>
                                                <span className="text-sm text-gray-600 mt-1">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>Strongly Disagree</span>
                                        <span>Strongly Agree</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* NASA TLX Questions */}
                    <motion.section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Load Assessment</h2>
                        {nasaTLXQuestions.map((question, index) => (
                            <motion.div 
                                key={index}
                                variants={questionVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: (likertQuestions.length + index) * 0.1 }}
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                            >
                                <p className="mb-4 text-gray-700">{question}</p>
                                <motion.div className="w-full">
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={nasaTLXQs[index] || 3}
                                        onChange={(e) => handleNasaTLXChange(index, parseInt(e.target.value))}
                                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between mt-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <div key={value} className="flex flex-col items-center">
                                                <div className="h-3 w-px bg-gray-300"/>
                                                <span className="text-sm text-gray-600 mt-1">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>Very Low</span>
                                        <span>Very High</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* Text Questions */}
                    <motion.section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Feedback</h2>
                        {textQuestions.map((question, index) => (
                            <motion.div 
                                key={index}
                                variants={questionVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: (likertQuestions.length + nasaTLXQuestions.length + index) * 0.1 }}
                                className="bg-gray-50 rounded-lg p-6 shadow-sm"
                            >
                                <p className="mb-4 text-gray-700">{question}</p>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    rows={4}
                                    onChange={(e) => handleTextChange(index, e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Type your answer here..."
                                />
                            </motion.div>
                        ))}
                    </motion.section>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                                 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Submit Survey
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default SurveyPage;