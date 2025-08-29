import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BackgroundProvider } from './contexts/BackgroundContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LinkSentPage from './pages/LinkSentPage';
import OnboardingPage from './pages/OnboardingPage';
import './App.css';

function App() {
  // Verificar se é o primeiro acesso para mostrar onboarding
  const checkFirstAccess = () => {
    const isOnboardingCompleted = localStorage.getItem('trendlyai-onboarding-completed');
    const hasAuthenticated = localStorage.getItem('trendlyai-user-authenticated');
    
    // Se nunca fez onboarding E está autenticado, mostrar onboarding
    if (!isOnboardingCompleted && hasAuthenticated) {
      return '/onboarding';
    }
    
    return '/login';
  };

  return (
    <BackgroundProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to={checkFirstAccess()} replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/link-sent" element={<LinkSentPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            {/* Rota temporária para home - será implementada futuramente */}
            <Route path="/home" element={<div className="min-h-screen bg-black text-white flex items-center justify-center"><h1>Home - Em breve!</h1></div>} />
          </Routes>
        </div>
      </Router>
    </BackgroundProvider>
  );
}

export default App;