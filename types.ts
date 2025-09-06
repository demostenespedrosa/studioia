
export interface UploadedImage {
  file: File;
  base64: string;
  mimeType: string;
}

export interface ModelConfig {
  age: number;
  gender: 'Feminino' | 'Masculino' | 'Neutro';
}
