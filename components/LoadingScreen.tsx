import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Loader2 size={64} className="text-blue-600 animate-spin relative z-10" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-2">Generating Lesson...</h3>
      <p className="text-gray-500 max-w-sm">
        ClassLens is analyzing your image, translating concepts to the local language, and creating custom practice questions.
      </p>
      
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};