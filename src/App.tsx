import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionPage from './routes/questionPage';
import HomePage from './routes/homePage';

// Define the main App component
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/question" element={<QuestionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;