import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import Header from '../components/layout/Header';
import { HeaderVariant } from '../types/header';

const SubscriptionPage = () => {
  const { currentBackground } = useBackground();

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url("${currentBackground.value}?w=800&q=80")`
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent -z-10" />
      
      {/* Header */}
      <Header variant={HeaderVariant.SECONDARY} />
      
      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Gerenciar Assinatura</h1>
            <p className="text-white/70 mb-8">
              Gerencie sua assinatura e configurações de pagamento
            </p>
            <div className="text-white/60">
              <p>Esta página será implementada em breve...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;