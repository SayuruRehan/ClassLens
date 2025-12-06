import React from 'react';
import { TeacherConfig, Subject, Language } from '../types';
import { GRADES } from '../constants';
import { BookOpen, Globe, BarChart2, List, FileText, BrainCircuit } from 'lucide-react';

interface ConfigPanelProps {
  config: TeacherConfig;
  onConfigChange: (newConfig: TeacherConfig) => void;
  onNext: () => void;
  onBack: () => void;
  previewUrl: string | null;
  fileType: string;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, 
  onConfigChange, 
  onNext,
  onBack,
  previewUrl,
  fileType
}) => {
  
  const handleChange = (field: keyof TeacherConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  const isPdf = fileType === 'application/pdf';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Preview Side */}
        <div className="md:w-1/3 bg-gray-100 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selected Content</p>
          {previewUrl && (
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-white flex items-center justify-center border border-gray-200">
              {isPdf ? (
                <div className="text-center p-4">
                   <FileText size={48} className="mx-auto text-red-500 mb-3" />
                   <p className="text-sm text-gray-700 font-medium">PDF Document</p>
                   <p className="text-xs text-gray-500 mt-1">Ready to process</p>
                </div>
              ) : (
                <img src={previewUrl} alt="Lesson Material" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <button onClick={onBack} className="mt-4 text-sm text-gray-600 underline hover:text-gray-900">
            Choose different file
          </button>
        </div>

        {/* Form Side */}
        <div className="md:w-2/3 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lesson Settings</h2>
          
          <div className="space-y-5">
            {/* Subject & Grade Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <BookOpen size={14} /> Subject
                </label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={config.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                >
                  {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={config.grade}
                  onChange={(e) => handleChange('grade', parseInt(e.target.value))}
                >
                  {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
            </div>

            {/* Language & Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Globe size={14} /> Output Language
                </label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={config.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <BrainCircuit size={14} /> Difficulty
                </label>
                <select 
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={config.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Question Counts */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-blue-900 mb-3 flex items-center gap-1">
                 <List size={14} /> Question Configuration
              </label>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">MCQs</span>
                  <input 
                    type="number" min="0" max="10"
                    className="w-16 rounded border-gray-300 p-1 text-center"
                    value={config.mcqCount}
                    onChange={(e) => handleChange('mcqCount', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Short Answers</span>
                  <input 
                    type="number" min="0" max="10"
                    className="w-16 rounded border-gray-300 p-1 text-center"
                    value={config.shortAnswerCount}
                    onChange={(e) => handleChange('shortAnswerCount', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Fill-in-Blanks</span>
                  <input 
                    type="number" min="0" max="10"
                    className="w-16 rounded border-gray-300 p-1 text-center"
                    value={config.fillInBlankCount}
                    onChange={(e) => handleChange('fillInBlankCount', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={onNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <BarChart2 size={20} />
                Generate Lesson Plan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};