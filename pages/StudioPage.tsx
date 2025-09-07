import React from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { ModelSelector } from '../components/ModelSelector';
import { GeneratedImages } from '../components/GeneratedImages';
import { Loader } from '../components/Loader';
import type { UploadedImage, ModelConfig } from '../types';
import { ArrowPathIcon } from '../components/IconComponents';

export type StudioStep = 'UPLOAD' | 'CONFIGURE' | 'GENERATING' | 'RESULTS' | 'ERROR';

interface StudioProps {
  step: StudioStep;
  uploadedImage: UploadedImage | null;
  modelConfig: ModelConfig;
  generatedImages: string[];
  error: string | null;
  onImageUpload: (img: UploadedImage) => void;
  onConfigChange: (cfg: Partial<ModelConfig>) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export const StudioPage: React.FC<StudioProps> = ({ step, uploadedImage, modelConfig, generatedImages, error, onImageUpload, onConfigChange, onGenerate, onReset }) => {
  const render = () => {
    switch (step) {
      case 'UPLOAD':
        return <><h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Olá! Vamos criar fotos incríveis.</h2><p className="text-slate-500 text-center mb-8">Comece enviando uma foto nítida do seu produto.</p><ImageUpload onImageUpload={onImageUpload} /></>;
      case 'CONFIGURE':
        return <><h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Ótima foto!</h2><p className="text-slate-500 text-center mb-8">Agora, descreva o modelo ideal para o seu produto.</p><ModelSelector config={modelConfig} onChange={onConfigChange} imagePreview={uploadedImage?.base64} /><div className="mt-8 text-center"><button onClick={onGenerate} className="w-full sm:w-auto bg-violet-600 text-white font-bold py-3 px-8 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300 shadow-lg">Gerar Fotos Mágicas</button></div></>;
      case 'GENERATING':
        return <Loader />;
      case 'RESULTS':
        return <><h2 className="text-2xl font-medium text-slate-700 text-center mb-2">Aqui estão suas novas fotos!</h2><p className="text-slate-500 text-center mb-8">Use-as para encantar seus clientes e impulsionar suas vendas.</p><GeneratedImages images={generatedImages} /><div className="mt-8 text-center"><button onClick={onReset} className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full hover:bg-slate-300 transition-all duration-300 flex items-center justify-center mx-auto"><ArrowPathIcon className="h-5 w-5 mr-2" />Criar Novas Fotos</button></div></>;
      case 'ERROR':
        return <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg"><h2 className="text-2xl font-medium text-red-700 mb-2">Oops! Algo deu errado.</h2><p className="text-red-600 mb-6">{error}</p><button onClick={onReset} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 flex items-center justify-center mx-auto"><ArrowPathIcon className="h-5 w-5 mr-2" />Tentar Novamente</button></div>;
      default:
        return null;
    }
  };
  return <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-100">{render()}</div>;
};
