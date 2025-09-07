import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add this import

const demographicQuestions = [
  {
    label: "Participant ID",
    name: "participantId",
    type: "text",
    required: true,
  },
  {
    label: "Age",
    name: "age",
    type: "number",
    required: true,
  },
  {
    label: "Gender",
    name: "gender",
    type: "radio",
    options: [
      "Man",
      "Woman",
      "Non Binary",
      "Prefer to self-describe",
      "Prefer not to disclose",
    ],
    required: true,
  },
  {
    label:
      "Gender self-description. If you chose prefer to self-describe, please do so here:",
    name: "genderSelfDescription",
    type: "text",
    required: false,
  },
  {
    label:
      "How familiar are you with using large language models (LLMs), like ChatGPT?",
    name: "llmFamiliarity",
    type: "radio",
    options: [
      "Very familiar – I use them often and understand their strengths and limitations in depth",
      "Familiar – I use them regularly and understand how they work",
      "Somewhat familiar – I’ve used one a few times and have a basic understanding",
      "Slightly familiar – I’ve heard of them or tried one once or twice",
      "Not at all familiar – I’ve never heard of them",
    ],
    required: true,
  },
  {
    label: "How often do you use large language models (LLMs), like ChatGPT?",
    name: "llmUsage",
    type: "radio",
    options: [
      "Frequently – Daily or almost daily",
      "Regularly – A few times a week",
      "Occasionally – A few times a month",
      "Rarely – Less than once a month",
      "Never – I don’t use them",
    ],
    required: true,
  },
  {
    label:
      "If you have used a large language model or LLM (like ChatGPT) before, what is your primary reason for using it?",
    name: "llmReason",
    type: "text",
    required: false,
  },
];

const DemographicPage = () => {
  const [form, setForm] = useState(
    demographicQuestions.reduce((acc, q) => {
      acc[q.name] = "";
      return acc;
    }, {} as Record<string, string>)
  );
  const [participantIdDisabled, setParticipantIdDisabled] = useState(false);
  const navigate = useNavigate();

  // On mount, check if userID is already in localStorage and set participantId accordingly
  useEffect(() => {
    const studyData = localStorage.getItem("studyData");
    if (studyData) {
      try {
        const parsed = JSON.parse(studyData);
        if (parsed.userID) {
          setForm((prev) => ({ ...prev, participantId: parsed.userID }));
          setParticipantIdDisabled(true);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("demographic", JSON.stringify(form));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found!");
      }
      await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST_URL}/api/demographic`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to save demographic data:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        // @ts-ignore
        console.error("Error details:", error.response?.data || error.message);
      } else {
        console.error("Error details:", (error as Error).message || error);
      }
    }
    navigate("/instructions");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12 px-6"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Demographic Information
      </motion.h1>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {demographicQuestions.map((q, idx) => (
            <div key={q.name} className="flex flex-col">
              <label
                htmlFor={q.name}
                className="mb-2 text-gray-800 font-medium"
              >
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {q.type === "radio" ? (
                <div className="flex flex-col space-y-2">
                  {q.options &&
                    q.options.map((opt) => (
                      <label key={opt} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={q.name}
                          value={opt}
                          checked={form[q.name] === opt}
                          onChange={handleChange}
                          required={q.required}
                          className="accent-blue-600"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                </div>
              ) : (
                <input
                  id={q.name}
                  name={q.name}
                  type={q.type}
                  value={form[q.name]}
                  onChange={handleChange}
                  required={q.required}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={q.name === "participantId" && participantIdDisabled}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full px-6 py-4 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DemographicPage;
