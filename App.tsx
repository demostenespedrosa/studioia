
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ModelSelector } from './components/ModelSelector';
import { GeneratedImages } from './components/GeneratedImages';
import { Loader } from './components/Loader';
import type { UploadedImage, ModelConfig } from './types';
import { generateProductPhotos } from './services/geminiService';
import { ArrowPathIcon } from './components/IconComponents';

type AppStep = 'UPLOAD' | 'CONFIGURE' | 'GENERATING' | 'RESULTS' | 'ERROR';

export default function App() {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({ age: 18, gender: 'Feminino' });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setStep('CONFIGURE');
  };

  const handleConfigChange = (config: Partial<ModelConfig>) => {
    setModelConfig(prev => ({ ...prev, ...config }));
  };

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage) {
      setError('Por favor, envie uma imagem primeiro.');
      setStep('ERROR');
      return;
    }

    setStep('GENERATING');
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateProductPhotos(uploadedImage, modelConfig);
      setGeneratedImages(images);
      setStep('RESULTS');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido. Por favor, tente novamente.');
      setStep('ERROR');
    }
  }, [uploadedImage, modelConfig]);

  const handleReset = () => {
    setStep('UPLOAD');
    setUploadedImage(null);
    setModelConfig({ age: 18, gender: 'Feminino' });
    setGeneratedImages([]);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'UPLOAD':
        return (
          <>
            <h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Olá! Vamos criar fotos incríveis.</h2>
            <p className="text-slate-500 text-center mb-8">Comece enviando uma foto nítida do seu produto.</p>
            <ImageUpload onImageUpload={handleImageUpload} />
          </>
        );
      case 'CONFIGURE':
        return (
          <>
            <h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Ótima foto!</h2>
            <p className="text-slate-500 text-center mb-8">Agora, descreva o modelo ideal para o seu produto.</p>
            <ModelSelector config={modelConfig} onChange={handleConfigChange} imagePreview={uploadedImage?.base64} />
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerateClick}
                className="w-full sm:w-auto bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300 shadow-lg"
              >
                Gerar Fotos Mágicas
              </button>
            </div>
          </>
        );
      case 'GENERATING':
        return <Loader />;
      case 'RESULTS':
        return (
          <>
            <h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Aqui estão suas novas fotos!</h2>
            <p className="text-slate-500 text-center mb-8">Use-as para encantar seus clientes e impulsionar suas vendas.</p>
            <GeneratedImages images={generatedImages} />
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full hover:bg-slate-300 transition-all duration-300 flex items-center justify-center mx-auto"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Criar Novas Fotos
              </button>
            </div>
          </>
        );
      case 'ERROR':
        return (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-2xl font-medium text-red-700 mb-2">Oops! Algo deu errado.</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 flex items-center justify-center mx-auto"
            >
               <ArrowPathIcon className="h-5 w-5 mr-2" />
              Tentar Novamente
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-100">
          {renderStep()}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-400 text-sm">
        <p>Criado com ❤️ para pequenos empreendedores.</p>
      </footer>
    </div>
  );
}
