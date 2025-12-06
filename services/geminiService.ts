import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TeacherConfig, LessonPlan } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64," or "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The main topic of the lesson." },
    summary: { type: Type.STRING, description: "A concise explanation/summary of the content in the target language." },
    mcqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text in the target language." },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options for the MCQ." },
          correctAnswer: { type: Type.STRING, description: "The correct option text." },
          explanation: { type: Type.STRING, description: "Why this answer is correct." }
        },
        required: ["question", "options", "correctAnswer"]
      }
    },
    shortQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question text in the target language." },
          answerKey: { type: Type.STRING, description: "The model answer or key points." }
        }
      }
    },
    fillInBlanks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING, description: "The sentence with a missing word represented by underscores." },
          answer: { type: Type.STRING, description: "The word that fills the blank." }
        }
      }
    }
  },
  required: ["topic", "summary", "mcqs", "shortQuestions", "fillInBlanks"]
};

export const generateLessonContent = async (
  imageFile: File,
  config: TeacherConfig
): Promise<LessonPlan> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
      You are an expert teacher's assistant named ClassLens. 
      Analyze the provided image or document (which could be a textbook page, PDF document, whiteboard notes, or a worksheet).
      
      Your goal is to create a lesson plan and practice questions for a Grade ${config.grade} class.
      The subject is ${config.subject}.
      The output language MUST be ${config.language}.
      The difficulty level is ${config.difficulty}.

      Please generate:
      1. A summary/explanation of the core concept found in the content.
      2. ${config.mcqCount} Multiple Choice Questions (MCQs).
      3. ${config.shortAnswerCount} Short Answer Questions.
      4. ${config.fillInBlankCount} Fill-in-the-blank questions.

      Ensure the content is age-appropriate for Grade ${config.grade}.
      Even though the JSON keys are in English, the VALUE content (questions, summary, options) MUST be in ${config.language}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.4, // Lower temperature for more factual educational content
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    return JSON.parse(text) as LessonPlan;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};