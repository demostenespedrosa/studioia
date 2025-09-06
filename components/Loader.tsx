
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analisando os detalhes do seu produto...",
  "Encontrando o modelo perfeito...",
  "Ajustando a iluminação de estúdio...",
  "Preparando os ângulos da câmera...",
  "Dando os toques finais...",
  "Quase pronto!",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-medium text-slate-700 mb-2">Criando suas fotos...</h2>
      <p className="text-slate-500 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
