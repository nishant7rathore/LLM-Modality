import './App.css';
import axios from "axios";
import { useState } from 'react';
import Prompt from './components/prompt';
import Display from './components/displayFrame';

type Response = {
  type: 'text' | 'image';
  content: string;
};

function App() {
  const [response, setResponse] = useState<Response | null>(null);

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

  return (
    <div className="App">
      <Display response = {response} />
      <Prompt  sendPrompt = {sendPrompt}/>
    </div>
  );
}

export default App;