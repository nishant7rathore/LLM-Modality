import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { usePreventNavigation } from "../hooks/preventNavigation";

const InstructionsPage = () => {
    const navigate = useNavigate();
    const instructions = [
        "You will be presented with four different prompting tasks",
        "Write prompts for text or image generation",
        "Use voice or text input to create prompts",
        "Review the generated content",
        "Refine your prompts and update them as needed",
        "Select your preferred response",
        "Complete a short survey after each task"
    ];
    usePreventNavigation("Please don't use the browser back button to navigate!");

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto py-12 px-6"
        >
            <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                Study Instructions
            </motion.h1>
            <motion.div 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
            >
                {instructions.map((instruction, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center space-x-4 mb-6"
                    >
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                        </span>
                        <p className="text-lg text-gray-700">{instruction}</p>
                    </motion.div>
                ))}
                <motion.button
                    onClick={() => navigate("/prompt")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                              text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Begin Study
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default InstructionsPage;