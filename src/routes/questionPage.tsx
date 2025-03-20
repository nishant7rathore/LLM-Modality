import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import InputPrompt from '../components/inputPrompt';
import Display from '../components/displayFrame';
import Question from "../components/questionFrame";
import { usePreventNavigation } from "../hooks/preventNavigation";

// Define the type of the response object
type Response = {
  type: 'text' | 'image';
  content: string;
  prompt?: string;
};

// Define the type of the question object
type QuestionType = {
    text: string;
    type: 'text' | 'image';
};

// Define the main App component
const QuestionPage = () => {
    const navigate = useNavigate();
    // useState hook to store the response object
    const [response, setResponse] = useState<Response | null>(null);
    // useState hook to get question
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    // useState hook to store loading state
    const [loading, setLoading] = useState(true);
    // useState hook to get questionIndex
    const currentQuestionIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0");
    usePreventNavigation("Please don't use the browser back button to navigate!");

    // Function to fetch the question from the backend
    useEffect(() => {
        const fetchQuestions = async () => {
            const order = localStorage.getItem("order");
            const token = localStorage.getItem("token");
            if (!order) {
                console.error("No order found!");
                return;
            }
            try {
                const url = `${process.env.BACKEND_HOST_URL}/api/questions?order=${order}`;
                const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.data.questions) {
                    setQuestions(res.data.questions);
                }
            }
            catch (error) {
                console.error("Error fetching question: ", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Function to send the prompt to the backend
    const sendPrompt = async (inputText: string) => {
        console.log("Sending prompt: ", inputText);
        const token = localStorage.getItem("token");
        const order = localStorage.getItem("order");
        if (!token) {
            console.error("No token found!");
            return;
        }
        try {
            const currentQuestion = questions[currentQuestionIndex];
            const isImage = currentQuestion.type === 'image';
            const url = isImage ? `${process.env.BACKEND_HOST_URL}/api/dalle` : `${process.env.BACKEND_HOST_URL}/api/text`;
            const payload = isImage ? { prompt: inputText, questionID: currentQuestionIndex, order: order } : { prompt: inputText };

            const res = await axios.post(url, payload , {headers: {Authorization: `Bearer ${token}`}});
            if (res.status === 200) {
                const content = res.data;
                const type = isImage ? 'image' : 'text';
                setResponse({ type, content, prompt: inputText });
            }
        }
        catch (error) {
            console.error("Error sending prompt: ", error);
        }
    };

    const handleContinue = () => {
        // Save the response in the local storage
        localStorage.setItem("studyData", JSON.stringify({
            ...JSON.parse(localStorage.getItem("studyData") || "{}"),
            questionID: currentQuestionIndex,
            prompt: response?.prompt,
            response: response?.content
        }));

        // Increment the currentQuestionIndex and navigate to the survey page
        if (currentQuestionIndex < questions.length - 1) {
            localStorage.setItem("currentQuestionIndex", (currentQuestionIndex + 1).toString());
        }
        console.log("LocalStorage Data Object:", JSON.parse(localStorage.getItem("studyData") || "{}"));

        navigate("/survey");
    };

    // Return the main App component
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="App min-h-screen pb-32">
            <Question question = {questions[currentQuestionIndex]} />
            <Display response = {response} />
            <InputPrompt  sendPrompt = {sendPrompt} onContinue = {() => handleContinue()} responseGenerated = {response !== null}/>
        </div>
    );
}

export default QuestionPage;