type QuestionType = {
    text: string;
    type: 'text' | 'image';
};

const Question = ({ question }: { question: QuestionType }) => {
    return (
        <div>
            <h1>Question</h1>
            <p>{question.text}</p>
            <p>{question.type}</p>
        </div>
    )
}

export default Question;