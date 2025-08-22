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
    // Fix image path if needed
    let imageSrc = "";
    if (question.type === "image") {
        imageSrc = question.content.includes("%PUBLIC_URL%")
            ? question.content.replace("%PUBLIC_URL%", process.env.PUBLIC_URL || "")
            : question.content;
    }

    // Modality instruction
    const modalityInstruction =
        question.modality === "voice"
            ? "This is a voice question. Please use the microphone button below to speak your prompt."
            : "This is a typing question. Please type your prompt in the text box below.";

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
                {/* Modality instruction */}
                <div className="mt-2 mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
                    {modalityInstruction}
                </div>
                {/* Instruction for multiple prompts */}
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                    You can submit multiple prompts for this question. Try refining or adding to your previous prompt to see different results!
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
                    {question.type === 'image' ? (
                        <>
                            <p className="text-gray-800 whitespace-pre-wrap mb-4">
                                Collaborate with the AI to describe the image below as accurately and creatively as possible. Use detailed language to capture what you see.
                            </p>
                            <motion.img
                                src={imageSrc}
                                alt="Prompt visual"
                                className="w-[90%] h-auto mx-auto rounded-lg shadow-md transform transition-transform duration-300 group-hover:scale-102"
                                layoutId="question-image"
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(37, 99, 235, 0.37)",
                                    transition: "box-shadow 0.3s, border-color 0.3s"
                                }}
                            />
                        </>
                    ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">
                            Collaborate with the AI to write a blog post about the following topic:<br />
                            <span className="font-semibold">{question.content}</span>
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Question;