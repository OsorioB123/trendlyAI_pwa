import React, { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

// Lista dos backgrounds disponíveis
const BACKGROUNDS = [
  { id: 'default', name: 'Padrão Trendly', value: 'https://i.ibb.co/Tx5Xxb2P/grad-1.webp' },
  { id: 'theme-2', name: 'Ambiente 2', value: 'https://i.ibb.co/TBV2V62G/grad-2.webp' },
  { id: 'theme-3', name: 'Ambiente 3', value: 'https://i.ibb.co/dsNWJkJf/grad-3.webp' },
  { id: 'theme-4', name: 'Ambiente 4', value: 'https://i.ibb.co/HfKNrwFH/grad-4.webp' },
  { id: 'theme-5', name: 'Ambiente 5', value: 'https://i.ibb.co/RT6rQFKx/grad-5.webp' },
  { id: 'theme-6', name: 'Ambiente 6', value: 'https://i.ibb.co/F4N8zZ5S/grad-6.webp' },
  { id: 'theme-7', name: 'Ambiente 7', value: 'https://i.ibb.co/cSHNFQJZ/grad-7.webp' },
  { id: 'theme-8', name: 'Ambiente 8', value: 'https://i.ibb.co/BJ4stZv/grad-8.webp' },
  { id: 'theme-9', name: 'Ambiente 9', value: 'https://i.ibb.co/yn3Z0ZsK/grad-9.webp' },
  { id: 'theme-10', name: 'Ambiente 10', value: 'https://i.ibb.co/d49qW7f6/grad-10.webp' },
  { id: 'theme-11', name: 'Ambiente 11', value: 'https://i.ibb.co/TD15qTjy/grad-11.webp' },
  { id: 'theme-12', name: 'Ambiente 12', value: 'https://i.ibb.co/JwVj3XGH/grad-12.webp' },
];

export const BackgroundProvider = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState(BACKGROUNDS[0]);

  // Carregar background do localStorage na inicialização
  useEffect(() => {
    const savedBackgroundId = localStorage.getItem('trendlyai-background');
    if (savedBackgroundId) {
      const savedBackground = BACKGROUNDS.find(bg => bg.id === savedBackgroundId);
      if (savedBackground) {
        setCurrentBackground(savedBackground);
      }
    }
  }, []);

  // Salvar no localStorage quando alterar o background
  const changeBackground = (backgroundId) => {
    const newBackground = BACKGROUNDS.find(bg => bg.id === backgroundId);
    if (newBackground) {
      setCurrentBackground(newBackground);
      localStorage.setItem('trendlyai-background', backgroundId);
    }
  };

  // Função adicional para mudanças diretas (compatibilidade)
  const setCurrentBackgroundDirect = (backgroundObject) => {
    setCurrentBackground(backgroundObject);
    localStorage.setItem('trendlyai-background', backgroundObject.id);
  };

  return (
    <BackgroundContext.Provider value={{
      currentBackground,
      changeBackground,
      setCurrentBackground: setCurrentBackgroundDirect,
      availableBackgrounds: BACKGROUNDS
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};