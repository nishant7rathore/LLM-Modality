import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import InputPrompt from '../components/inputPrompt';
import Display from '../components/displayFrame';
import Question from "../components/questionFrame";
import { useStudyContext } from "../context/studyContext";

// Define the type of the response object
type Response = {
  type: 'text' | 'image';
  content: string;
};

// Define the type of the question object
type QuestionType = {
    text: string;
    type: 'text' | 'image';
};

// Define the main App component
const QuestionPage = () => {
    const navigate = useNavigate();
    // useStudyContext hook update the studyData with the prompt and response
    const { updateStudyData } = useStudyContext();
    // useState hook to store the response object
    const [response, setResponse] = useState<Response | null>(null);
    // useState hook to get question
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    // useState hook to store loading state
    const [loading, setLoading] = useState(true);
    // useState hook to get questionIndex
    const currentQuestionIndex = parseInt(localStorage.getItem("currentQuestionIndex") || "0");

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
                const url = `http://localhost:5001/api/questions?order=${order}`;
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
        if (!token) {
            console.error("No token found!");
            return;
        }
        try {
            const currentQuestion = questions[currentQuestionIndex];
            const isImage = currentQuestion.type === 'image';
            const url = isImage ? "http://localhost:5001/api/dalle" : "http://localhost:5001/api/text";

            const res = await axios.post(url, {prompt: inputText} , {headers: {Authorization: `Bearer ${token}`}});
            if (res.status === 200) {
                const content = res.data;
                const type = isImage ? 'image' : 'text';
                // Update the studyData with prompt and response
                updateStudyData({ prompt: inputText, response: content });
                setResponse({ type, content });
            }
        }
        catch (error) {
            console.error("Error sending prompt: ", error);
        }
    };

    const handleContinue = () => {
        // Update the studyData with questionID
        updateStudyData({ questionID: currentQuestionIndex });
        // Increment the currentQuestionIndex
        if (currentQuestionIndex < questions.length - 1) {
            localStorage.setItem("currentQuestionIndex", (currentQuestionIndex + 1).toString());
        }
        navigate("/survey");
    };

    // Return the main App component
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="App">
            <Question question={questions[currentQuestionIndex]} />
            <Display response = {response} onContinue={() => handleContinue()} />
            <InputPrompt  sendPrompt = {sendPrompt}/>
        </div>
    );
}

export default QuestionPage;