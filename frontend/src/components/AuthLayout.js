import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';

const AuthLayout = ({ children }) => {
  const { currentBackground } = useBackground();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black text-white font-inter antialiased selection:bg-white/10 selection:text-white auth-background"
    >
      {/* Background personalizado */}
      <div 
        className="fixed top-0 w-full h-screen bg-cover bg-center -z-10"
        style={{ 
          backgroundImage: `url("${currentBackground.value}?w=800&q=80")` 
        }}
      />
      
      {/* Conteúdo da página */}
      <main className="w-full max-w-md px-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;