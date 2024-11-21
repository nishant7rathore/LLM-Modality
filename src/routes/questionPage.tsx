import axios from "axios";
import { useState } from 'react';
import InputPrompt from '../components/inputPrompt';
import Display from '../components/displayFrame';
import Question from "../components/questionFrame";

// Define the type of the response object
type Response = {
  type: 'text' | 'image';
  content: string;
};

// Define the main App component
const QuestionPage = () => {
    // useState hook to store the response object
    const [response, setResponse] = useState<Response | null>(null);

    // Function to send the prompt to the backend
    const sendPrompt = async (inputText: string, isImage: boolean) => {
        console.log("Sending prompt: ", inputText);
        const token = localStorage.getItem("token");
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
                setResponse({ type, content });
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
            <Display response = {response} />
            <InputPrompt  sendPrompt = {sendPrompt}/>
        </div>
    );
}

export default QuestionPage;