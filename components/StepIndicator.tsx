import React from 'react';
import { Camera, Settings, Sparkles, FileText } from 'lucide-react';
import { AppState } from '../types';

interface StepIndicatorProps {
  currentStep: AppState['step'];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'upload', icon: Camera, label: 'Capture' },
    { id: 'config', icon: Settings, label: 'Setup' },
    { id: 'processing', icon: Sparkles, label: 'Generate' },
    { id: 'results', icon: FileText, label: 'Lesson' },
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['upload', 'config', 'processing', 'results'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-4">
      <div className="flex justify-between items-center relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded" />
        
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';
          
          let bgColor = 'bg-white border-2 border-gray-300 text-gray-400';
          if (isActive) bgColor = 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200';
          if (isCompleted) bgColor = 'bg-green-500 border-green-500 text-white';

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${bgColor}`}>
                <step.icon size={18} />
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};