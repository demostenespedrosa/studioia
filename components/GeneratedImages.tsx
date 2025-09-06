
import React from 'react';
import { DownloadIcon } from './IconComponents';

interface GeneratedImagesProps {
  images: string[];
}

export const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images }) => {
    
  const handleDownload = (base64Image: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = `produto-profissional-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {images.map((base64, index) => (
        <div key={index} className="relative group aspect-square">
          <img
            src={`data:image/png;base64,${base64}`}
            alt={`Foto do produto gerada ${index + 1}`}
            className="w-full h-full object-cover rounded-lg shadow-md border border-slate-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <button 
              onClick={() => handleDownload(base64, index)}
              className="bg-white/80 text-slate-800 hover:bg-white backdrop-blur-sm font-bold py-2 px-4 rounded-full flex items-center transition-all duration-300 transform group-hover:scale-100 scale-95"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Baixar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
