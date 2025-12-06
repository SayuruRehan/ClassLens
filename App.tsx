import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { ImageUploader } from './components/ImageUploader';
import { ConfigPanel } from './components/ConfigPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultView } from './components/ResultView';
import { AppState, TeacherConfig, LessonPlan } from './types';
import { DEFAULT_CONFIG } from './constants';
import { generateLessonContent } from './services/geminiService';
import { Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    imageFile: null,
    imagePreviewUrl: null,
    config: DEFAULT_CONFIG,
    lessonPlan: null,
    error: null
  });

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ 
      ...prev, 
      imageFile: file, 
      imagePreviewUrl: url,
      step: 'config',
      error: null
    }));
  };

  const handleConfigChange = (newConfig: TeacherConfig) => {
    setState(prev => ({ ...prev, config: newConfig }));
  };

  const handleGenerate = async () => {
    if (!state.imageFile) return;
    
    setState(prev => ({ ...prev, step: 'processing', error: null }));

    try {
      const lessonPlan = await generateLessonContent(state.imageFile, state.config);
      setState(prev => ({
        ...prev,
        step: 'results',
        lessonPlan: lessonPlan
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        step: 'config',
        error: "Failed to generate lesson. Please try a clearer image/document or different settings."
      }));
    }
  };

  const handleReset = () => {
    // Keep config but reset image and results
    setState(prev => ({
      ...prev,
      step: 'upload',
      imageFile: null,
      imagePreviewUrl: null,
      lessonPlan: null,
      error: null
    }));
  };

  const handleBackToUpload = () => {
    setState(prev => ({ ...prev, step: 'upload', error: null }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">ClassLens</h1>
          </div>
          <div className="hidden sm:block text-sm text-gray-500 font-medium">
            AI Co-Teacher for Multilingual Classrooms
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 p-4 md:p-8 print:bg-white print:p-0">
        <div className="max-w-6xl mx-auto print:max-w-none">
          
          {/* Progress Indicator (only if not in results view and not printing) */}
          {state.step !== 'results' && (
            <div className="print:hidden">
              <StepIndicator currentStep={state.step} />
            </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 print:hidden">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}

          {/* View Switcher */}
          <div className="mt-4">
            {state.step === 'upload' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                   <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Snap. Localize. Teach.</h2>
                   <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                     Upload a textbook page, PDF, or whiteboard photo. We'll generate a lesson plan and quizzes in your local language instantly.
                   </p>
                </div>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            )}

            {state.step === 'config' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <ConfigPanel 
                  config={state.config}
                  onConfigChange={handleConfigChange}
                  onNext={handleGenerate}
                  onBack={handleBackToUpload}
                  previewUrl={state.imagePreviewUrl}
                  fileType={state.imageFile?.type || ''}
                />
              </div>
            )}

            {state.step === 'processing' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <LoadingScreen />
              </div>
            )}

            {state.step === 'results' && state.lessonPlan && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <ResultView lesson={state.lessonPlan} onReset={handleReset} />
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 print:hidden">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            AI can make mistakes. Please verify generated content. <br/><br/>
            &copy; 2025 ClassLens. Powered by Google Gemini 2.5 Flash.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;