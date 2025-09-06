
import React, { useState, useCallback } from 'react';
import type { UploadedImage } from '../types';
import { UploadIcon } from './IconComponents';

interface ImageUploadProps {
  onImageUpload: (image: UploadedImage) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        if (base64) {
          onImageUpload({ file, base64, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
  }

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 bg-slate-50'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
        <div className="bg-violet-100 text-violet-600 p-4 rounded-full mb-4">
          <UploadIcon className="h-8 w-8" />
        </div>
        <p className="text-slate-700 font-medium">
          <span className="text-violet-600">Clique para enviar</span> ou arraste e solte
        </p>
        <p className="text-sm text-slate-500 mt-1">PNG, JPG, WEBP (max. 10MB)</p>
      </label>
    </div>
  );
};
