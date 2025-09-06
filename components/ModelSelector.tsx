
import React from 'react';
import type { ModelConfig } from '../types';
import { UserIcon } from './IconComponents';

interface ModelSelectorProps {
  config: ModelConfig;
  onChange: (config: Partial<ModelConfig>) => void;
  imagePreview?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ config, onChange, imagePreview }) => {
  const genders: ModelConfig['gender'][] = ['Feminino', 'Masculino', 'Neutro'];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {imagePreview && (
        <div className="md:w-1/3 flex-shrink-0">
          <p className="text-sm font-medium text-slate-600 mb-2">Seu Produto:</p>
          <img
            src={`data:image/png;base64,${imagePreview}`}
            alt="Pré-visualização do produto"
            className="rounded-lg object-cover w-full aspect-square shadow-md border border-slate-200"
          />
        </div>
      )}
      <div className="flex-grow">
        <div className="space-y-6">
          <div>
            <label htmlFor="age-slider" className="block text-sm font-medium text-slate-700 mb-2">
              Idade do Modelo
            </label>
            <div className="flex items-center gap-4">
              <UserIcon className="h-5 w-5 text-slate-400" />
              <input
                id="age-slider"
                type="range"
                min="2"
                max="80"
                value={config.age}
                onChange={(e) => onChange({ age: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <span className="font-semibold text-slate-800 bg-slate-100 rounded-md px-3 py-1 text-sm w-16 text-center">
                {config.age} anos
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gênero do Modelo</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {genders.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => onChange({ gender })}
                  className={`py-3 px-2 text-center rounded-lg border-2 transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                    config.gender === gender
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
