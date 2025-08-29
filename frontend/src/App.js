import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BackgroundProvider } from './contexts/BackgroundContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LinkSentPage from './pages/LinkSentPage';
import './App.css';

function App() {
  return (
    <BackgroundProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/link-sent" element={<LinkSentPage />} />
          </Routes>
        </div>
      </Router>
    </BackgroundProvider>
  );
}

export default App;