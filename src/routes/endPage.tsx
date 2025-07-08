import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMPLETION_CODE = process.env.REACT_APP_PROLIFIC_COMPLETION_CODE;
const REDIRECT_URL = `https://app.prolific.com/submissions/complete?cc=${COMPLETION_CODE}`;

const EndPage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 1 * 60 * 1000); // 1 minute
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-200">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border-4 border-pink-200"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
            className="mb-6"
          >
            <svg className="w-24 h-24 text-pink-400 mx-auto animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17l-5 3 1.9-5.6L4 10.5l5.7-.4L12 5l2.3 5.1 5.7.4-4.9 3.9L17 20z" />
            </svg>
          </motion.div>
          <motion.h1
            className="text-3xl font-extrabold text-pink-600 mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Thank you for participating in our study!
          </motion.h1>
          <motion.p
            className="text-lg text-gray-700 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            You will be redirected to Prolific in <span className="font-semibold text-blue-600">5 minutes</span> to submit your completion code.
          </motion.p>
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 mb-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="block text-gray-700 mb-2">Your Prolific completion code:</span>
            <span className="text-2xl font-mono font-bold text-blue-700 tracking-widest">{COMPLETION_CODE}</span>
          </motion.div>
          <motion.p
            className="text-sm text-gray-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Please keep this page open. You will be redirected automatically.<br />
            If not, <a href={REDIRECT_URL} className="text-blue-600 underline">click here</a> to submit your code manually.
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EndPage;