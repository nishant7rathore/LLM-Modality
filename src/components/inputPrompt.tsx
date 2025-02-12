import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

type Props = {
    sendPrompt: (inputText: string) => void;
};

const InputPrompt = ({sendPrompt}: Props) => {
  const [inputText, setInputText] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
    if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        setInputText((prev) => prev + "\n");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSent(true);
    await sendPrompt(inputText);
    setInputText("");
    setIsSent(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-6 py-4 bg-white border-t border-gray-300">
      <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2">
        <textarea
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow p-3 border border-gray-300 rounded-md resize-none w-full"
          placeholder="Build your prompt here..."
          rows={1}
        />
        <button
          type="submit"
          disabled={isSent || inputText.trim() === ""}
          className="p-3 bg-plexBlue text-white rounded-full disabled:bg-gray-400"
        >
          <FaArrowUp />
        </button>
      </form>
    </div>
  );
};

export default InputPrompt;