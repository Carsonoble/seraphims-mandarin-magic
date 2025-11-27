import { GoogleGenAI, Type } from "@google/genai";
import { ProficiencyLevel, Flashcard } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_BASE = `
You are "Luna", a friendly, magical purple cat who teaches Mandarin Chinese to a 2nd-grade girl named Seraphim.
Your tone is encouraging, playful, and simple.
You love the color purple and often make cat puns.
When teaching, focus on standard Mandarin (Putonghua).
Always be supportive.
`;

export const assessInitialLevel = async (interactionHistory: string[]): Promise<ProficiencyLevel> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Based on the following short interaction with Seraphim, estimate her Mandarin proficiency level.
    Interaction: ${JSON.stringify(interactionHistory)}
    
    Return ONLY one of the following strings: "Beginner", "Intermediate", "Advanced".
    If unsure, default to "Beginner".
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text?.trim();
    if (text?.includes("Intermediate")) return ProficiencyLevel.INTERMEDIATE;
    if (text?.includes("Advanced")) return ProficiencyLevel.ADVANCED;
    return ProficiencyLevel.BEGINNER;
  } catch (e) {
    console.error("Error assessing level:", e);
    return ProficiencyLevel.BEGINNER;
  }
};

export const generateFlashcards = async (level: ProficiencyLevel, topic: string): Promise<Flashcard[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Generate 5 Mandarin flashcards for a ${level} level 2nd-grade student.
    The topic is: ${topic} (or general vocabulary if topic is empty).
    Include Emoji where appropriate in the english definition.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hanzi: { type: Type.STRING, description: "Chinese Character" },
              pinyin: { type: Type.STRING, description: "Pinyin with tone marks" },
              english: { type: Type.STRING, description: "English translation" },
              category: { type: Type.STRING, description: "Word category (e.g., Animals, Colors)" }
            },
            required: ["hanzi", "pinyin", "english", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Flashcard[];
  } catch (error) {
    console.error("Flashcard generation error", error);
    // Fallback data
    return [
      { hanzi: "猫", pinyin: "māo", english: "Cat 🐱", category: "Animals" },
      { hanzi: "紫色", pinyin: "zǐ sè", english: "Purple 🟣", category: "Colors" },
      { hanzi: "你好", pinyin: "nǐ hǎo", english: "Hello 👋", category: "Greetings" },
    ];
  }
};

export const chatWithLuna = async (history: {role: string, parts: {text: string}[]}[], message: string, level: ProficiencyLevel): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  // Construct the chat history for the API
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION_BASE} 
      Current Student Level: ${level}. 
      Keep responses short (under 2 sentences) and include the Pinyin for any Chinese words you use.
      Ask her a question to keep the conversation going.`
    },
    history: history
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text || "Meow? I didn't catch that.";
  } catch (error) {
    console.error("Chat error", error);
    return "Oops! My magical connection is fuzzy. Can you say that again?";
  }
};

export const getGameContent = async (level: ProficiencyLevel): Promise<{pairId: string, item1: string, item2: string}[]> => {
  // Generate pairs for a matching game
  const model = "gemini-2.5-flash";
  const prompt = `Generate 6 pairs of matching Mandarin words for a ${level} student. Format: Hanzi and English.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pairId: { type: Type.STRING },
              item1: { type: Type.STRING, description: "The Chinese Character (Hanzi)" },
              item2: { type: Type.STRING, description: "The English Definition" }
            }
          }
        }
      }
    });
    const text = response.text;
    if(!text) throw new Error("No data");
    return JSON.parse(text);
  } catch(e) {
    return [
      { pairId: "1", item1: "猫", item2: "Cat" },
      { pairId: "2", item1: "狗", item2: "Dog" },
      { pairId: "3", item1: "鱼", item2: "Fish" },
      { pairId: "4", item1: "鸟", item2: "Bird" },
      { pairId: "5", item1: "紫色", item2: "Purple" },
      { pairId: "6", item1: "红色", item2: "Red" },
    ];
  }
}