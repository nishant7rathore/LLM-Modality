import { useNavigate } from "react-router-dom";

const InstructionsPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/prompt");
  };
  return (
    <div>
      <h1>Instructions</h1>
      <p>Here are the instructions...</p>
      <button onClick={handleStart}>
        Start Study
      </button>
    </div>
  );
}

export default InstructionsPage;