import axios from "axios";
import { useState } from 'react';
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

// Define the main App component
const QuestionPage = () => {
    const navigate = useNavigate();
    // useStudyContext hook update the studyData with the prompt and response
    const { updateStudyData } = useStudyContext();
    // useState hook to store the response object
    const [response, setResponse] = useState<Response | null>(null);

    // Function to send the prompt to the backend
    const sendPrompt = async (inputText: string, isImage: boolean) => {
        console.log("Sending prompt: ", inputText);
        const token = localStorage.getItem("token");
        console.log("Token Frontend: ", token);
        if (!token) {
            console.error("No token found!");
            return;
        }
        try {
            const url = isImage ? "http://localhost:5001/api/dalle" : "http://localhost:5001/api/text";
            const res = await axios.post(url, {prompt: inputText} , {headers: {Authorization: `Bearer ${token}`}});
            if (res.status === 200) {
                const content = res.data;
                const type = isImage ? 'image' : 'text';
                // Update the studyData with prompt and response
                updateStudyData({ prompt: inputText, response: content });
                setResponse({ type, content });
                // Navigate to the survey
                navigate("/survey");
            }
        }
        catch (error) {
            console.error("Error sending prompt: ", error);
        }
    };

    // Return the main App component
    return (
        <div className="App">
            <Question />
            {/* <p>UserID: {studyData.userID}</p> */}
            <Display response = {response} />
            <InputPrompt  sendPrompt = {sendPrompt}/>
        </div>
    );
}

export default QuestionPage;