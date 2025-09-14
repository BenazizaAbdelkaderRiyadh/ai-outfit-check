import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { UserProfile, Outfit } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const dataUrlToBase64 = (dataUrl: string): string => {
    if (!dataUrl || !dataUrl.includes(',')) {
        return '';
    }
    return dataUrl.split(',')[1];
};

export const generateOutfitImage = async (
  userProfile: UserProfile,
  outfit: Omit<Outfit, 'id' | 'isLoading' | 'generatedImages' | 'error'>
): Promise<string[]> => {

  const contentParts: Part[] = [];

  const userPhotoPart: Part = {
    inlineData: {
      data: dataUrlToBase64(userProfile.photo),
      mimeType: userProfile.photoMimeType,
    },
  };
  contentParts.push(userPhotoPart);

  if (outfit.photo && outfit.photoMimeType) {
    const outfitPhotoPart: Part = {
        inlineData: {
            data: dataUrlToBase64(outfit.photo),
            mimeType: outfit.photoMimeType,
        },
    };
    contentParts.push(outfitPhotoPart);
  }

  const textPromptParts = [
    "You are a virtual try-on fashion assistant.",
    `The first image provided is the person to model the clothes. The person's details are: Age: ${userProfile.age}, Height: ${userProfile.height} cm, Weight: ${userProfile.weight} kg.`
  ];

  if (outfit.photo) {
    textPromptParts.push("The second image provided is the outfit to be worn.");
  }
  
  if (outfit.description) {
    textPromptParts.push(`Outfit Description: ${outfit.description}.`);
  }

  textPromptParts.push(`The requested outfit size is ${outfit.size}.`);

  if (outfit.background === 'white') {
    textPromptParts.push("The background of the generated images must be plain white.");
  } else {
    textPromptParts.push("Preserve the original background from the user's photo as much as possible.");
  }
  
  textPromptParts.push("Generate 3 realistic, high-quality virtual try-on images showing the person wearing the outfit from the front, side, and back views.");
  textPromptParts.push("Return only the generated images.");

  const fullPromptText = textPromptParts.join(' ');
  contentParts.push({ text: fullPromptText });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: contentParts },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const generatedImages: string[] = [];
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                generatedImages.push(imageUrl);
            }
        }
    }
    
    if (generatedImages.length === 0) {
        let failureReason = "The AI model did not return any images. This might be due to a content policy or an issue with the request.";
        if (response.text) {
            failureReason += ` Model response: "${response.text.trim()}"`;
        }
        throw new Error(failureReason);
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Image generation failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};