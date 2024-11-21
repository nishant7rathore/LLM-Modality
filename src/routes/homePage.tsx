import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const startStudy = async() => {
        setLoading(true);
        try {
            const url = "http://localhost:5001/start";
            const res = await axios.post(url);
            if (res.status === 200) {
                console.log("Study started successfully!");
                const token = res.data.token;
                // Saving the token in local storage
                localStorage.setItem("token", token);
                // Navigating to the question page
                navigate("/question");
            }
        }
        catch (error) {
            console.error("Error starting study: ", error);
        } 
        finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>Welcome to the HCI User Study!</h1>
            <p>Click the button below to start the study.</p>
            <button onClick={startStudy} disabled={loading}>
                {loading ? 'Loading...' : 'Start Study'}
            </button>
            
        </div>
    );
}
export default HomePage;