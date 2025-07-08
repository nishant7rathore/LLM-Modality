import { useState, useEffect } from "react";
import { FaArrowUp, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

type ResponseType = {
    type: 'text' | 'image';
    content: string[];
    prompt: string[];
};

type Props = {
  sendPrompt: (inputText: string, oldPrompt: string) => Promise<ResponseType | null | undefined>;
  onContinue: () => void;
  responseGenerated: boolean;
  modality: string;
  response: ResponseType | null;
  isLoading?: boolean;
  selectedIdx: number | null;
  setSelectedIdx: (idx: number) => void;
};

const InputPrompt = ({
  sendPrompt,
  onContinue,
  responseGenerated,
  modality,
  response,
  selectedIdx,
}: Props) => {
  const [inputText, setInputText] = useState<string>("");
  const [oldResponse, setOldResponse] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // New state for popup
  const [showPopup, setShowPopup] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check if a response is selected
  const isContentSelected = response && typeof selectedIdx === "number" && selectedIdx >= 0;

  // Show popup automatically when timer ends and no response is selected
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isContentSelected) {
        setShowPopup(true);
      }
    }
    return () => clearInterval(timer);
  }, [listening, finalTranscript, isRunning, timeLeft, isContentSelected]);

  useEffect(() => {
    // Only update inputText live for voice modality and while listening
    if (modality === "voice" && listening) {
      setInputText(transcript);
    }
  }, [transcript, listening, modality]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

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
    if (hasSubmitted) {
      return;
    }
    setInputText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (hasSubmitted) {
      return;
    }
    setHasSubmitted(true);
    setIsRunning(false);
    let res = sendPrompt(inputText, oldResponse);
    setInputText("");
    res.then((response) => {
      if (response) {
        setOldResponse(response.content.length === 0 ? "" : response.content[response.content.length - 1]);
        console.log("Response received: ", response);
      } else {
        console.error("No response received from sendPrompt");
      }
      setHasSubmitted(false);
      setIsRunning(true);
      setTimeLeft(timeLeft);
    });
  };

  const onPause = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsRunning(!isRunning);
  };

  const HandleMicButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasListened) {
      setInputText("");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      setInputText(finalTranscript);
      setHasSubmitted(true);
      setIsRunning(false);
      let res = sendPrompt(transcript, oldResponse);
      res.then((response) => {
        if (response) {
          setOldResponse(response.content.length === 0 ? "" : response.content[response.content.length - 1]);
          console.log("Response received: ", response);
        } else {
          console.error("No response received from sendPrompt");
        }
        setIsRunning(true);
        setHasSubmitted(false);
      });
    }
    setInputText("");
    setHasListened(!hasListened);
  };

  // Handler for "Continue to Survey" button
  const handleContinueToSurvey = () => {
    if (!isContentSelected) {
      setShowPopup(true);
    } else {
      onContinue();
    }
  };

  // Handler to close popup
  const handleClosePopup = () => setShowPopup(false);

  // Only show "Continue to Survey" button if timer is over and a response is selected
  const showContinueButton = responseGenerated && timeLeft === 0 && isContentSelected && !hasSubmitted;
  // Show timer button only if timer is running or time left
  const showTimerButton = responseGenerated && timeLeft > 0 && !hasSubmitted;

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
            disabled={hasSubmitted || timeLeft <= 0 || modality !== "type"}
            className="flex-grow p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Build your prompt here..."
            rows={1}
            whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
          >
            <AnimatePresence mode="wait"></AnimatePresence>
          </motion.textarea>
          <motion.button
            type="submit"
            disabled={hasSubmitted || timeLeft <= 0 || inputText.trim() === ""}
            className="p-4 bg-blue-600 text-white rounded-full disabled:bg-gray-400 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            hidden={modality === "voice"}
          >
            <AnimatePresence mode="wait">
              {hasSubmitted ? (
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
            disabled={hasSubmitted || timeLeft <= 0 || modality !== "voice"}
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

          {/* Timer button: only show while timer is running and no response is selected */}
          {showTimerButton && (
            <motion.button
              onClick={onPause}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              type="button"
            >
              Time Left: {formatTime(timeLeft)}
            </motion.button>
          )}

          {/* Continue to Survey button: only show after timer ends and a response is selected */}
          {showContinueButton && (
            <motion.button
              onClick={handleContinueToSurvey}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 
                                 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              type="button"
            >
              Continue to Survey
            </motion.button>
          )}
        </div>
      </form>
      {/* Pop-up Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border-4 border-pink-300"
              style={{ marginBottom: "18rem" }}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-4">
                <svg className="w-16 h-16 text-pink-400 mx-auto animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-pink-500 mb-2 text-center">Please select a response!</h2>
              <p className="text-gray-700 dark:text-gray-200 text-center mb-6">
                You must select one of the responses above before continuing to the survey.
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded bg-gradient-to-r from-pink-400 to-blue-500 text-white font-semibold shadow"
                onClick={handleClosePopup}
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputPrompt;
