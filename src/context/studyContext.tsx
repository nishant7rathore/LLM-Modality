// Context file to share data among frontend components to avoid prop drilling
// Used to send 1 write query to the db instead of multiple at the end of survey each time
import { createContext, useCallback, useContext, useState } from "react";

export interface StudyData {
    userID: string;
    questionID: number;
    prompt: string;
    response: string;
    surveyAnswers: any;
}

interface StudyContextType {
    studyData: StudyData;
    updateStudyData: (newData: Partial<StudyData>) => void;
    resetStudyData: () => void;
}

// Default study data
const defaultStudyData: StudyData = {
    userID: "",
    questionID: 0,
    prompt: "",
    response: "",
    surveyAnswers: null
};

// Create the context
const StudyContext = createContext<StudyContextType>({
    studyData: defaultStudyData,
    updateStudyData: () => {},
    resetStudyData: () => {}
});

// Methods to update and reset the study data
export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
    const [studyData, setStudyData] = useState<StudyData>(defaultStudyData);

    const updateStudyData = useCallback((newData: Partial<StudyData>) => {
        setStudyData((prevData) => {
            const updatedData = { ...prevData, ...newData };
            console.log("Study Data updated:", updatedData);
            return updatedData;
        });
    }, []);

    const resetStudyData = useCallback(() => {
        setStudyData((prevData) => ({
            ...prevData,
            questionID: 0,
            prompt: "",
            response: "",
            surveyAnswers: null
        }));
    }, []);

    return (
        <StudyContext.Provider value={{ studyData, updateStudyData, resetStudyData }}>
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
