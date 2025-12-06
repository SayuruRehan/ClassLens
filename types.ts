export enum Language {
  ENGLISH = 'English',
  SINHALA = 'Sinhala',
  TAMIL = 'Tamil'
}

export enum Subject {
  SCIENCE = 'Science',
  MATH = 'Mathematics',
  HISTORY = 'History',
  ENGLISH_LANG = 'English Language',
  OTHER = 'General'
}

export interface TeacherConfig {
  subject: Subject;
  grade: number;
  language: Language;
  mcqCount: number;
  shortAnswerCount: number;
  fillInBlankCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string; // The letter (A, B, C, D) or the text
  explanation?: string;
}

export interface ShortAnswer {
  question: string;
  answerKey: string;
}

export interface FillInBlank {
  sentence: string; // "The sky is ______."
  answer: string;
}

export interface LessonPlan {
  topic: string;
  summary: string; // Localized explanation
  mcqs: MCQ[];
  shortQuestions: ShortAnswer[];
  fillInBlanks: FillInBlank[];
}

export interface AppState {
  step: 'upload' | 'config' | 'processing' | 'results';
  imageFile: File | null;
  imagePreviewUrl: string | null;
  config: TeacherConfig;
  lessonPlan: LessonPlan | null;
  error: string | null;
}