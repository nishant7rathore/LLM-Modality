import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputPrompt from "../components/inputPrompt";
import Display from "../components/displayFrame";
import Question from "../components/questionFrame";
import { usePreventNavigation } from "../hooks/preventNavigation";

// Define the type of the response object
type ResponseType = {
  type: "text" | "image";
  content: string[];
  prompt: string[];
  timeTaken: number[];
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
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const responseRef = useRef(response);
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

  const addResponse = (
    newPrompt: string,
    newContent: string | string[],
    type: "text" | "image",
    timeTaken: number
  ) => {
    const prevPrompt = responseRef.current?.prompt ?? [];
    const prevContent = responseRef.current?.content ?? [];
    const prevTimeTaken = responseRef.current?.timeTaken ?? [];
    // Ensure newContent is always an array
    const newContentArr = Array.isArray(newContent) ? newContent : [newContent];
    const response: ResponseType = {
      type,
      prompt: [...prevPrompt, newPrompt],
      content: [...prevContent, ...newContentArr],
      timeTaken: [...prevTimeTaken, timeTaken],
    };
    setResponse(response);
    responseRef.current = response;
  };

  const sendPrompt = async (
    inputText: string,
    oldResponse: string,
    timeTaken: number
  ): Promise<ResponseType | null> => {
    const token = localStorage.getItem("token");
    const order = localStorage.getItem("order");
    if (!token) {
      console.error("No token found!");
      return null;
    }
    try {
      setResponseLoading(true);

      const currentQuestion = questions[currentQuestionIndex];
      const isImage = currentQuestion.type === "image";
      const url = isImage
        ? `${process.env.REACT_APP_BACKEND_HOST_URL}/api/dalle`
        : `${process.env.REACT_APP_BACKEND_HOST_URL}/api/text`;
      const payload = isImage
        ? {
            prompt: inputText,
            questionID: currentQuestionIndex,
            order: order,
            oldResponse: oldResponse,
          }
        : { prompt: inputText, oldResponse: oldResponse };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        const content = res.data;
        const type = isImage ? "image" : "text";
        addResponse(inputText, content, type, timeTaken);
      }
    } catch (error) {
      console.error("Error sending prompt: ", error);
    } finally {
      setResponseLoading(false);
      return responseRef.current; // Return the response for further processing if needed
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
        content: questions[currentQuestionIndex].content,
        modality: questions[currentQuestionIndex].modality,
        prompt: response?.prompt,
        response: response?.content,
        selectedIdx: selectedIdx || 0,
        timeTaken: response?.timeTaken,
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

    navigate("/survey");
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
      <Display
        response={response}
        isLoading={responseLoading}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
      />
      <InputPrompt
        sendPrompt={(inputText: string, oldPrompt: string, timeTaken: number) =>
          sendPrompt(inputText, oldPrompt, timeTaken)
        }
        onContinue={() => handleContinue()}
        responseGenerated={response !== null}
        modality={questions[currentQuestionIndex].modality}
        questionType={questions[currentQuestionIndex].type}
        response={response}
        selectedIdx={selectedIdx}
        questionID={currentQuestionIndex}
      />
    </div>
  );
};

export default QuestionPage;
