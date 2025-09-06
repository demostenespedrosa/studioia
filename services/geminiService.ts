
import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage, ModelConfig } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function createPrompt(config: ModelConfig): string {
  const genderMap = {
    'Feminino': 'uma modelo feminina',
    'Masculino': 'um modelo masculino',
    'Neutro': 'um modelo de gênero neutro'
  };

  return `Gere 4 fotos profissionais de alta qualidade. Cada foto deve mostrar ${genderMap[config.gender]}, com aproximadamente ${config.age} anos, usando o produto fornecido. 
  
As fotos devem ter ângulos e poses diferentes e dinâmicas, em um fundo de estúdio neutro e minimalista. A iluminação deve ser profissional e atraente.
  
O foco principal é criar um desejo de compra, destacando o produto de forma elegante.
  
IMPORTANTE: Recrie o produto com fidelidade absoluta aos detalhes da imagem original. Ignore completamente o fundo e quaisquer outros objetos na foto original, focando exclusivamente no produto.`;
}

export const generateProductPhotos = async (
  image: UploadedImage,
  config: ModelConfig
): Promise<string[]> => {
  const prompt = createPrompt(config);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('A IA não retornou nenhuma imagem. Tente uma imagem de produto diferente ou ajuste as configurações.');
    }

    const imageParts = response.candidates[0].content.parts.filter(part => part.inlineData);
    
    if (imageParts.length === 0) {
        throw new Error('Nenhuma imagem foi gerada. A resposta pode conter apenas texto. Verifique o prompt ou a imagem de entrada.');
    }

    return imageParts.map(part => {
        if (part.inlineData) {
            return part.inlineData.data;
        }
        return '';
    }).filter(data => data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Falha ao gerar imagens. A imagem pode ser inadequada ou houve um problema de conexão. Por favor, tente novamente.');
  }
};
