
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GeneratedData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImageWithPrompt(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash-image';
    const fullPrompt = `Apply a "${prompt}" aesthetic to this photo. Keep the same face, identity, and general appearance consistent with the uploaded image. The output must be a visually stunning, cinematic, and modern image that looks natural yet artistically enhanced, suitable for social media.`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: fullPrompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart?.inlineData?.data) {
        const base64Image = firstPart.inlineData.data;
        const imageMimeType = firstPart.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64Image}`;
    }

    throw new Error('Image generation failed or API returned an unexpected response.');
}


export async function generateSuggestions(prompt: string): Promise<GeneratedData> {
    const model = 'gemini-2.5-flash';
    const fullPrompt = `Based on the photo editing keyword "${prompt}", generate creative suggestions. Provide a short, catchy caption suggestion. Provide 3 relevant and trending hashtags (without the # symbol). Provide 5 related, trending prompt keywords for re-edits. The related prompts should be based on global visual trends.`;
    
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    caption: { type: Type.STRING, description: "A short, catchy caption suggestion." },
                    hashtags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 3 relevant and trending hashtags."
                    },
                    relatedPrompts: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 5 related, trending prompt keywords for re-edits."
                    }
                },
                required: ["caption", "hashtags", "relatedPrompts"]
            },
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        // Basic validation
        if (data && data.caption && Array.isArray(data.hashtags) && Array.isArray(data.relatedPrompts)) {
            return data as GeneratedData;
        }
        throw new Error("Parsed JSON does not match the expected structure.");
    } catch (e) {
        console.error("Failed to parse suggestions JSON:", e);
        throw new Error("Could not get suggestions from the API. The response was not valid JSON.");
    }
}
