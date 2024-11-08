import './App.css';
import axios from "axios";
import { useState } from 'react';
import Prompt from './components/prompt';
import Display from './components/displayFrame';

function App() {
  const [response, setResponse] = useState<string>("");

  const sendPrompt = async (inputText: string) => {
    console.log("Sending prompt: ", inputText);
    try {
      const res = await axios.post("http://localhost:5001/api/prompt", {prompt: inputText});
      if (res.status === 200) {
        setResponse(res.data);
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