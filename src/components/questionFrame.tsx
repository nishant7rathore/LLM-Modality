import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '../transitions';

type QuestionType = {
    text: string;
    type: 'text' | 'image';
    modality: 'type' | 'voice';
    content: string;
};

// Question component to show the question
const Question = ({ question }: { question: QuestionType }) => {
    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg"
        >
            <motion.h1 
                variants={slideUp}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
                Build the prompt
            </motion.h1>
            <motion.div 
                variants={slideUp}
                className="prose prose-lg"
            >
                <p className="text-gray-700 text-xl">{question.text}</p>
                <span className="inline-block px-3 py-1 mt-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {question.type === 'text' ? '🖊 Text Generation' : '🎨 Image Generation'}
                </span>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{question.content}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Question;