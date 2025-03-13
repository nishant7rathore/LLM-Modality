import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    sendPrompt: (inputText: string) => void;
};

const InputPrompt = ({sendPrompt}: Props) => {
  const [inputText, setInputText] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
    if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        setInputText((prev) => prev + "\n");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };
  

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (hasSubmitted) {
        return;
    }

    setIsSent(true);
    setHasSubmitted(true);
    sendPrompt(inputText);
    setIsSent(false);
  };

  return (
    <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full px-6 py-4 bg-white border-t border-gray-300 backdrop-blur-md bg-opacity-90"
    >
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3">
                <motion.textarea
                    value={inputText}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={hasSubmitted}
                    className="flex-grow p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Build your prompt here..."
                    rows={1}
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                />
                <motion.button
                    type="submit"
                    disabled={hasSubmitted || inputText.trim() === ""}
                    className="p-4 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        {isSent ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                            />
                        ) : (
                            <FaArrowUp className="w-6 h-6" />
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </form>
    </motion.div>
);
};

export default InputPrompt;