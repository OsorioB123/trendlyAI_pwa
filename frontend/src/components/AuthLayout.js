import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';

const AuthLayout = ({ children }) => {
  const { currentBackground } = useBackground();

  return (
    <div 
      className="auth-background min-h-screen relative"
      style={{
        backgroundImage: `url("${currentBackground.value}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;