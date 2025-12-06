import { TeacherConfig, Language, Subject } from './types';

export const DEFAULT_CONFIG: TeacherConfig = {
  subject: Subject.SCIENCE,
  grade: 7,
  language: Language.SINHALA,
  mcqCount: 5,
  shortAnswerCount: 3,
  fillInBlankCount: 0,
  difficulty: 'Medium',
};

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const MOCK_LESSON_PLAN = {
  topic: "Photosynthesis",
  summary: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
  mcqs: [
    {
      question: "What gas do plants absorb?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
      correctAnswer: "Carbon Dioxide"
    }
  ],
  shortQuestions: [],
  fillInBlanks: []
};