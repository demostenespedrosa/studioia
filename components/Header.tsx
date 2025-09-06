
import React from 'react';
import { CameraIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
           <div className="bg-violet-100 text-violet-600 p-2 rounded-lg">
            <CameraIcon className="h-6 w-6" />
           </div>
          <h1 className="text-xl font-bold text-slate-800">
            Estúdio de Produto AI
          </h1>
        </div>
      </div>
    </header>
  );
};
