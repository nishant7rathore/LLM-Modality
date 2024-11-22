import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudyProvider } from './context/studyContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <React.StrictMode>
      <StudyProvider>
        <App />
      </StudyProvider>
    // </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
