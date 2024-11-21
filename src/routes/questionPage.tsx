import axios from "axios";
import { useState } from 'react';
import Prompt from '../components/prompt';
import Display from '../components/displayFrame';

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
        try {
            const url = isImage ? "http://localhost:5001/api/dalle" : "http://localhost:5001/api/text";
            const res = await axios.post(url, {prompt: inputText});
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
            <Display response = {response} />
            <Prompt  sendPrompt = {sendPrompt}/>
        </div>
    );
}

export default QuestionPage;