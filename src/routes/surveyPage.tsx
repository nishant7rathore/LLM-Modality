import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSendStudyData from "../hooks/sendStudyData";
import { motion } from "framer-motion";
import { usePreventNavigation } from "../hooks/preventNavigation";

// Main Survey Page component
const SurveyPage = () => {
  const navigate = useNavigate();
  const { sendStudyData } = useSendStudyData();
  usePreventNavigation("Please don't use the browser back button to navigate!");
  const studyData = localStorage.getItem("studyData");
  let questionType = "";
  let questionID = 0;
  if (studyData) {
    const parsed = JSON.parse(studyData);
    questionType = parsed.questionType;
    questionID = Number(parsed.questionID);
  }
  const textOrImage = questionType === "text" ? "text" : "image";
  const likertQuestions = [
    `I felt involved in the ${textOrImage} creation.`,
    `I am the author of the created ${textOrImage}.`,
    `I provided significant effort to create the ${textOrImage}.`,
    `The created ${textOrImage} is my original work.`,
    `I copied someone else’s work to create the ${textOrImage}.`,
    `I contributed significantly to the ${textOrImage} creation.`,
    `The AI system contributed significantly to the ${textOrImage} creation.`,
    `I controlled the ${textOrImage} creation.`,
    `The AI controlled the ${textOrImage} creation.`,
    `I personally own the created ${textOrImage}.`,
    `I was responsible for the created ${textOrImage}.`,
    `I feel emotionally connected to the created ${textOrImage}.`,
    `I feel personally connected to the created ${textOrImage}.`,
    `Rate the quality of the created ${textOrImage}.`,
  ];

  const likertQuestionsDBNames = [
    `Involved`,
    `AuthorCreated`,
    `Effort`,
    `OriginalWork`,
    `CopiedWork`,
    `SignificantContribution`,
    `AIContribution`,
    `ControlledCreation`,
    `AIControlledCreation`,
    `PersonalOwnership`,
    `Responsible`,
    `EmotionallyConnected`,
    `PersonallyConnected`,
    `RateQuality`,
  ];

  const textQuestions = [
    "Which method did you prefer to write generative AI prompts for? Why or why not?",
    "Do you have any additional comments you would like to share?",
  ];

  const textQuestionsDBNames = ["PreferredMethod", "AdditionalComments"];

  const nasaTLXQuestions = [
    "Mental Demand: How mentally demanding was the task?",
    "Physical Demand: How physically demanding was the task?",
    "Temporal Demand: How hurried or rushed was the pace of the task?",
    "Performance: How successful were you in accomplishing what you were asked to do?",
    "Effort: How hard did you have to work to accomplish your level of performance?",
    "Frustration: How insecure, discouraged, irritated, stressed, and annoyed were you?",
  ];
  const nasaTLXQuestionsDBNames = [
    "MentalDemand",
    "PhysicalDemand",
    "TemporalDemand",
    "Performance",
    "Effort",
    "Frustration",
  ];

  // Setting up initial state for the survey questions
  const [likertQs, setLikertQs] = useState<{ [key: string]: number }>(() => {
    const initialValues: { [key: string]: number } = {};
    for (const question of likertQuestions) {
      initialValues[question] = 3;
    }
    return initialValues;
  });

  const [textQs, setTextQs] = useState<{ [key: string]: string }>(() => {
    const initialValues: { [key: string]: string } = {};
    for (const question of textQuestions) {
      initialValues[question] = "";
    }
    return initialValues;
  });

  const [nasaTLXQs, setNasaTLXQs] = useState<{ [key: string]: number }>(() => {
    const initialValues: { [key: string]: number } = {};
    for (const question of nasaTLXQuestions) {
      initialValues[question] = 3;
    }
    return initialValues;
  });

  // 2. Update handlers to use question text as key
  const handleLikertChange = (question: string, value: number) => {
    setLikertQs((prev) => ({ ...prev, [question]: value }));
  };

  const handleTextChange = (question: string, value: string) => {
    setTextQs((prev) => ({ ...prev, [question]: value }));
  };

  const handleNasaTLXChange = (question: string, value: number) => {
    setNasaTLXQs((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Use DB names as keys for survey answers
    const surveyAnswers: Record<string, number | string> = {};

    // Likert questions
    likertQuestionsDBNames.forEach((dbName, idx) => {
      const questionText = likertQuestions[idx];
      surveyAnswers[dbName] = likertQs[questionText];
    });

    // NASA TLX questions
    nasaTLXQuestionsDBNames.forEach((dbName, idx) => {
      const questionText = nasaTLXQuestions[idx];
      surveyAnswers[dbName] = nasaTLXQs[questionText];
    });

    // Text questions
    textQuestionsDBNames.forEach((dbName, idx) => {
      const questionText = textQuestions[idx];
      surveyAnswers[dbName] = textQs[questionText];
    });

    localStorage.setItem(
      "studyData",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("studyData") || "{}"),
        ...surveyAnswers,
      })
    );

    await sendStudyData(localStorage.getItem("studyData"));

    // Navigate to next question or end of survey (HARDCODED TO 5 QUESTIONS)
    const currentQuestionIndex = parseInt(
      localStorage.getItem("currentQuestionIndex") || "0"
    );
    if (currentQuestionIndex < 4) {
      navigate("/prompt");
    } else {
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
    exit: { opacity: 0, y: -20 },
  };

  const questionVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-br from-blue-50 to-purple-50 px-4"
    >
      <motion.div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-0">
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Experience Rating
            </h2>
            {likertQuestions.map((question, index) => (
              <motion.div
                key={question}
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
                    value={likertQs[question] || 3}
                    onChange={(e) =>
                      handleLikertChange(question, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex flex-col items-center">
                        <div className="h-3 w-px bg-gray-300" />
                        <span className="text-sm text-gray-600 mt-1">
                          {value}
                        </span>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Task Load Assessment
            </h2>
            {nasaTLXQuestions.map((question, index) => (
              <motion.div
                key={question}
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
                    value={nasaTLXQs[question] || 3}
                    onChange={(e) =>
                      handleNasaTLXChange(question, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex flex-col items-center">
                        <div className="h-3 w-px bg-gray-300" />
                        <span className="text-sm text-gray-600 mt-1">
                          {value}
                        </span>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Additional Feedback
            </h2>
            {(questionID === 0 || questionID === 2
              ? textQuestions.slice(1)
              : textQuestions
            ).map((question, index) => (
              <motion.div
                key={question}
                variants={questionVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay:
                    (likertQuestions.length + nasaTLXQuestions.length + index) *
                    0.1,
                }}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <p className="mb-4 text-gray-700">{question}</p>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  rows={4}
                  value={textQs[question] || ""}
                  onChange={(e) => handleTextChange(question, e.target.value)}
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
};

export default SurveyPage;
