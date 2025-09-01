import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BackgroundProvider } from './contexts/BackgroundContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LinkSentPage from './pages/LinkSentPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AllTracksPage from './pages/AllTracksPage';
import AllToolsPage from './pages/AllToolsPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
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
            {/* Permitir acesso direto ao onboarding para testes */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            {/* Página Home implementada */}
            <Route path="/home" element={<HomePage />} />
            {/* Chat Page */}
            <Route path="/chat" element={<ChatPage />} />
            {/* All Tracks Page */}
            <Route path="/tracks" element={<AllTracksPage />} />
            {/* All Tools Page */}
            <Route path="/tools" element={<AllToolsPage />} />
            {/* Profile Page */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </BackgroundProvider>
  );
}

export default App;