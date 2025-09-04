import { motion } from "framer-motion";
import { fadeIn, slideUp } from "../transitions";

type QuestionType = {
  text: string;
  type: "text" | "image";
  modality: "type" | "voice";
  content: string;
};

// Question component to show the question
const Question = ({ question }: { question: QuestionType }) => {
  // No need to fix image path as imageSrc is not used

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
      <motion.div variants={slideUp} className="prose prose-lg">
        {/* <p className="text-gray-700 text-xl">{question.text}</p> */}
        <span className="inline-block px-3 py-1 mt-2 bg-blue-100 text-blue-800 rounded-full text-sm">
          {question.type === "text"
            ? "🖊 Text Generation"
            : "🎨 Image Generation"}
        </span>
        {/* Instruction for multiple prompts */}
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
          {modalityInstruction} You can submit multiple prompts for this
          question. Try refining or adding to your previous prompt to see
          different results!
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
          {question.type === "image" ? (
            <>
              <div className="w-full">
                <div className="text-lg text-gray-800 mb-2">
                  Collaborate with the AI to create an image that can accurately
                  represent your vision for the following.
                </div>
                <div className="text-md text-gray-900 italic bg-white rounded px-3 py-2 border border-purple-100 shadow-sm">
                  {question.content}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="text-lg text-gray-800 mb-2">
                Collaborate with the AI to write a blog post about the following
                topic:
              </div>
              <div className="text-md text-gray-900 italic bg-white rounded px-3 py-2 border border-purple-100 shadow-sm">
                {question.content}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Question;
