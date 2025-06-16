import { useState, useEffect } from "react";
import { FaArrowUp, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type ResponseType = {
    type: 'text' | 'image';
    content: string;
};


type Props = {
  sendPrompt: (inputText: string, oldPrompt: string) => Promise<ResponseType | null | undefined>;
  onContinue: () => void;
  responseGenerated: boolean;
  modality: string;
  response: ResponseType | null;
  isLoading?: boolean;
};


// InputPrompt component - Input bar
const InputPrompt = ({ sendPrompt, onContinue, responseGenerated, modality }: Props) => {
  const [inputText, setInputText] = useState<string>("");
  const [oldResponse, setOldResponse] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  const {
    transcript,
    listening,
    finalTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Get the error when it occurs
  useEffect(() => {
    if (listening) {
      setInputText(finalTranscript);
    }
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [listening, finalTranscript, isRunning, timeLeft]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

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
    if (hasSubmitted) {
      setHasSubmitted(false);
      setIsSent(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (hasSubmitted) {
      return;
    }

    setIsSent(true);
    setHasSubmitted(true);
    let res = sendPrompt(inputText, oldResponse);
    res.then((response) => {
      if (response) {
        setOldResponse(response.content);
        console.log("Response received: ", response);
      } else {
        console.error("No response received from sendPrompt");
      }
    });
    setIsSent(false);
    setIsRunning(true);
    setTimeLeft(300); // Reset time left to 5 minutes (300 seconds)
  };

  const onPause = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsRunning(!isRunning);
  };

  const HandleMicButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasListened) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      setIsSent(true);
      setHasSubmitted(true);
      setInputText(finalTranscript);
      let res = sendPrompt(transcript, oldResponse);
      res.then((response) => {
        if (response) {
           setOldResponse(response.content);
          console.log("Response received: ", response);
        } else {
          console.error("No response received from sendPrompt");
        }
      });
      setIsSent(false);
      setIsRunning(true);
    }
    setHasListened(!hasListened);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 w-full px-6 py-4 bg-white border-t border-gray-300 backdrop-blur-md bg-opacity-90"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-6">
          <motion.textarea
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={timeLeft <= 0}
            className="flex-grow p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Build your prompt here..."
            rows={1}
            whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
          >
            <AnimatePresence mode="wait"></AnimatePresence>
          </motion.textarea>
          <motion.button
            type="submit"
            disabled={timeLeft <= 0 || inputText.trim() === ""}
            className="p-4 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            hidden={modality === "voice"}
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

          <motion.button
            type="button"
            disabled={hasSubmitted}
            className="p-4 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={HandleMicButtonClick}
            hidden={modality === "type"}
          >
            <AnimatePresence mode="sync">
              {hasListened ? (
                <FaMicrophone className="w-6 h-6" />
              ) : (
                <FaMicrophoneSlash className="w-6 h-6" />
              )}
            </AnimatePresence>
          </motion.button>

          {responseGenerated && hasSubmitted && (
            <motion.button
              onClick={isRunning || timeLeft > 0 ? onPause : onContinue}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isRunning || timeLeft > 0
                ? `Time Left: ${timeLeft}s`
                : "Continue to Survey"}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default InputPrompt;
