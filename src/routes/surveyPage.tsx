import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyContext } from "../context/studyContext";
import useSendStudyData from "../hooks/sendStudyData";

const SurveyPage = () => {
    const navigate = useNavigate();
    const { studyData, updateStudyData } = useStudyContext();
    const { sendStudyData } = useSendStudyData();
    const [likertQs, setLikertQs] = useState<{ [key: string]: number }>({});
    const [textQs, setTextQs] = useState<{ [key: string]: string }>({});
    const [nasaTLXQs, setNasaTLXQs] = useState<{ [key: string]: number }>({});

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

    const handleLikertChange = (question: string, value: number) => {
        setLikertQs(prev => ({ ...prev, [question]: value }));
    };

    const handleTextChange = (question: string, value: string) => {
        setTextQs(prev => ({ ...prev, [question]: value }));
    };

    const handleNasaTLXChange = (question: string, value: number) => {
        setNasaTLXQs(prev => ({ ...prev, [question]: value }));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Likert Questions: ", likertQs);
        console.log("Text Questions: ", textQs);
        const updatedStudyData = {
            ...studyData,
            surveyAnswers: { likertQs, textQs, nasaTLXQs }
        };
        updateStudyData(updatedStudyData);
        await sendStudyData(updatedStudyData);

        // Navigate to next question or end of survey
        const currentQuestionIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0");
        if (currentQuestionIndex < 2) {
            localStorage.setItem("currentQuestionIndex", (currentQuestionIndex + 1).toString());
            navigate("/prompt");
        }
        else {
            navigate("/end");
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto my-4 p-4 border border-gray-300 rounded-md shadow-md">
            <h1 className="text-xl font-bold mb-4">Survey Page</h1>
            <form onSubmit={handleSubmit}>
                {likertQuestions.map((question, index) => (
                    <div key={index} className="mb-6">
                        <p className="mb-2">{question}</p>
                        <input
                            type="range"
                            min={1}
                            max={7}
                            step={1}
                            value={likertQs[question] || 4}
                            onChange={(e) => handleLikertChange(question, parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>Strongly Disagree</span>
                            <span>Strongly Agree</span>
                        </div>
                    </div>
                ))}
                {textQuestions.map((question, index) => (
                    <div key={index} className="mb-6">
                        <p className="mb-2">{question}</p>
                        <textarea
                            rows={3}
                            onChange={(e) => handleTextChange(question, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                ))}
                {nasaTLXQuestions.map((question, index) => (
                    <div key={index} className="mb-6">
                        <p className="mb-2">{question}</p>
                        <input
                            type="range"
                            min={1}
                            max={7}
                            step={1}
                            value={nasaTLXQs[question] || 4}
                            onChange={(e) => handleNasaTLXChange(question, parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span>Very Low</span>
                            <span>Very High</span>
                        </div>
                    </div>
                ))}
                <button type="submit" className="px-6 py-3 bg-plexBlue text-white rounded-md text-lg font-semibold">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default SurveyPage;