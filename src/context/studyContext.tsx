// Context file to share data among frontend components to avoid prop drilling
// Used to send 1 write query to the db instead of multiple at the end of survey each time
import { createContext, useContext, useEffect, useState } from "react";

export interface StudyData {
    userID: string;
    questionId: number;
    prompt: string;
    response: string;
    surveyAnswers: any;
}

interface StudyContextType {
    studyData: StudyData;
    updateStudyData: (newData: Partial<StudyData>) => void;
}

// Create the context
const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
    const [studyData, setStudyData] = useState<StudyData>(() => {
        const storedData = localStorage.getItem("studyData");
        return storedData ? JSON.parse(storedData) : {
            userID: "",
            questionId: 0,
            prompt: "",
            response: "",
            surveyAnswers: null
        };
    });

    useEffect(() => {
        localStorage.setItem("studyData", JSON.stringify(studyData));
    }, [studyData]);

    const updateStudyData = (newData: Partial<StudyData>) => {
        setStudyData((prevData) => {
            return { ...prevData, ...newData };
        });
    };

    return (
        <StudyContext.Provider value={{ studyData, updateStudyData }}>
            {children}
        </StudyContext.Provider>
    );
}

export const useStudyContext = () => {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error("useStudyContext must be used within a StudyProvider");
    }
    return context;
}
