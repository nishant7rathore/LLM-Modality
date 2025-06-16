import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputPrompt from "../components/inputPrompt";
import Display from "../components/displayFrame";
import Question from "../components/questionFrame";
import { usePreventNavigation } from "../hooks/preventNavigation";

// Define the type of the response object
type Response = {
  type: "text" | "image";
  content: string;
  prompt?: string;
};

// Define the type of the question object
type QuestionType = {
  text: string;
  type: "text" | "image";
  modality: "type" | "voice";
  content: string;
};

// Main Question Page component
const QuestionPage = () => {
  // useState hooks to store the response, questions, loading and responseLoading state
  const [response, setResponse] = useState<Response | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseLoading, setResponseLoading] = useState(false);
  const currentQuestionIndex = parseInt(
    localStorage.getItem("currentQuestionIndex") || "0"
  );
  const navigate = useNavigate();
  usePreventNavigation("Please don't use the browser back button to navigate!");

  // Function to fetch the question from the backend
  useEffect(() => {
    
    const fetchQuestions = async () => {
      const order = localStorage.getItem("order");
      const token = localStorage.getItem("token");
      if (!order) {
        console.error("No order found!");
        return null;
      }
      try {
        const url = `${process.env.REACT_APP_BACKEND_HOST_URL}/api/questions?order=${order}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.questions) {
          setQuestions(res.data.questions);
        }
      } catch (error) {
        console.error("Error fetching question: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Function to send the prompt to the backend
  const sendPrompt = async (inputText: string, oldResponse: string): Promise<Response | null> => {
    const token = localStorage.getItem("token");
    const order = localStorage.getItem("order");
    let result: Response | null = null;
    if (!token) {
      console.error("No token found!");
      return null;
    }
    try {
      setResponseLoading(true);
      setResponse(null);
      const currentQuestion = questions[currentQuestionIndex];
      const isImage = currentQuestion.type === "image";
      const url = isImage
        ? `${process.env.REACT_APP_BACKEND_HOST_URL}/api/dalle`
        : `${process.env.REACT_APP_BACKEND_HOST_URL}/api/text`;
      const payload = isImage
        ? { prompt: inputText, questionID: currentQuestionIndex, order: order, oldResponse: oldResponse }
        : { prompt: inputText, oldResponse: oldResponse };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const content = res.data;
        const type = isImage ? "image" : "text";
        setResponse({ type, content, prompt: inputText });
        result = { type, content, prompt: inputText };
      }
    } catch (error) {
      console.error("Error sending prompt: ", error);
    } finally {
      setResponseLoading(false);
      return result; // Return the response for further processing if needed
    }
  };

  const handleContinue = () => {
    // Save the response in the local storage
    localStorage.setItem(
      "studyData",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("studyData") || "{}"),
        questionID: currentQuestionIndex,
        questionType: questions[currentQuestionIndex].type,
        modality: questions[currentQuestionIndex].modality,
        prompt: response?.prompt,
        response: response?.content,
      })
    );

    // Increment the currentQuestionIndex and navigate to the survey page
    if (currentQuestionIndex <= questions.length - 1) {
      localStorage.setItem(
        "currentQuestionIndex",
        (currentQuestionIndex + 1).toString()
      );
    }
    // console.log("LocalStorage Data Object:", JSON.parse(localStorage.getItem("studyData") || "{}"));

    //navigate("/survey");
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen pb-32">
      <Question question={questions[currentQuestionIndex]} />
      <Display response={response} isLoading={responseLoading} />
      <InputPrompt
        sendPrompt={(inputText: string, oldPrompt: string) => sendPrompt(inputText, oldPrompt)}
        onContinue={() => handleContinue()}
        responseGenerated={response !== null}
        modality={questions[currentQuestionIndex].modality}
        response={response}
      />
    </div>
  );
};

export default QuestionPage;
