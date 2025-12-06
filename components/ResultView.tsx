
import React, { useState, useEffect } from 'react';
import { LessonPlan } from '../types';
import { Copy, Check, ChevronDown, ChevronUp, Printer, X, Download } from 'lucide-react';

interface ResultViewProps {
  lesson: LessonPlan;
  onReset: () => void;
}

interface PrintConfig {
  includeSummary: boolean;
  includeQuestions: boolean;
  includeAnswers: boolean;
}

const PrintModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: PrintConfig) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [config, setConfig] = useState<PrintConfig>({
    includeSummary: true,
    includeQuestions: true,
    includeAnswers: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Download Lesson Plan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4 border border-blue-100">
            <p className="font-semibold mb-1">How to download PDF:</p>
            <p>1. Click the button below.</p>
            <p>2. In the print window, change <strong>Destination</strong> to <strong>"Save as PDF"</strong>.</p>
          </div>
          
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={config.includeSummary} 
              onChange={e => setConfig(prev => ({ ...prev, includeSummary: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Lesson Summary</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={config.includeQuestions} 
              onChange={e => setConfig(prev => ({ ...prev, includeQuestions: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Practice Questions</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              checked={config.includeAnswers} 
              onChange={e => setConfig(prev => ({ ...prev, includeAnswers: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Answer Keys</span>
          </label>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(config)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2 shadow-sm transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResultView: React.FC<ResultViewProps> = ({ lesson, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  
  // Print State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    includeSummary: true,
    includeQuestions: true,
    includeAnswers: false
  });

  const handleCopy = () => {
    let text = `${lesson.topic}\n\nSummary:\n${lesson.summary}\n\n`;
    
    if (lesson.mcqs.length > 0) {
      text += `Multiple Choice Questions:\n`;
      lesson.mcqs.forEach((q, i) => {
        text += `${i + 1}. ${q.question}\n`;
        q.options.forEach((opt, j) => text += `   ${String.fromCharCode(65 + j)}. ${opt}\n`);
        text += `   Answer: ${q.correctAnswer}\n\n`;
      });
    }
    
    if (lesson.shortQuestions.length > 0) {
        text += `Short Questions:\n`;
        lesson.shortQuestions.forEach((q, i) => {
            text += `${i + 1}. ${q.question}\n   Answer: ${q.answerKey}\n\n`;
        });
    }

    if (lesson.fillInBlanks.length > 0) {
        text += `Fill in the Blanks:\n`;
        lesson.fillInBlanks.forEach((q, i) => {
            text += `${i + 1}. ${q.sentence}\n   Answer: ${q.answer}\n\n`;
        });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintConfirm = (config: PrintConfig) => {
    setPrintConfig(config);
    setIsPrintModalOpen(false);
    setIsPrinting(true);
    
    // Give React time to update DOM for print view
    setTimeout(() => {
      window.print();
      
      // Reset printing state. 
      // We set a long timeout to cover the browser preparing the preview.
      // Ideally we'd use 'afterprint' event but this is a simple fallback.
      setTimeout(() => setIsPrinting(false), 2000);
    }, 500);
  };
  
  // Use onafterprint to clean up state immediately if supported
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  // Visibility Logic
  const renderSummary = isPrinting ? printConfig.includeSummary : true;
  const renderQuestions = isPrinting ? printConfig.includeQuestions : true;
  const renderAnswers = isPrinting ? printConfig.includeAnswers : showAnswers;

  return (
    <div className="w-full max-w-4xl mx-auto pb-20">
      
      <PrintModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
        onConfirm={handlePrintConfirm} 
      />

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={onReset} className="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
          &larr; Create Another
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
           <button 
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Lesson Content */}
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:w-full print:overflow-visible ${isPrinting ? 'print:block' : ''}`}>
        
        {/* Topic Header */}
        <div className="bg-blue-600 p-8 text-white print:bg-white print:text-black print:p-0 print:mb-4 print:border-b-2 print:border-black">
          <h1 className="text-3xl font-bold mb-2">{lesson.topic}</h1>
          <div className="inline-block bg-blue-500 bg-opacity-50 rounded-full px-3 py-1 text-sm font-medium print:hidden">
            Generated by ClassLens
          </div>
        </div>

        {/* Sections */}
        {renderSummary && (
          <div className="p-8 border-b border-gray-100 print:p-0 print:mb-6 print:border-none">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 print:text-black">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm print:hidden">1</span>
              Explanation
            </h2>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-lg leading-relaxed text-gray-800 print:bg-transparent print:border-none print:p-0 print:text-black">
              {lesson.summary}
            </div>
          </div>
        )}

        {renderQuestions && lesson.mcqs.length > 0 && (
          <div className="p-8 border-b border-gray-100 print:p-0 print:mb-6 print:border-none print:break-inside-avoid">
             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:text-black">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm print:hidden">2</span>
                Multiple Choice
             </h2>
             <div className="grid gap-6 print:gap-4">
               {lesson.mcqs.map((q, idx) => (
                 <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-200 print:bg-transparent print:border-none print:p-0 print:break-inside-avoid">
                   <p className="font-semibold text-gray-900 mb-3 print:text-black">{idx + 1}. {q.question}</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-2">
                     {q.options.map((opt, oIdx) => (
                       <div key={oIdx} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 print:border-black print:border-dashed">
                         <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold print:hidden">
                           {String.fromCharCode(65 + oIdx)}
                         </span>
                         <span className="hidden print:inline font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                         <span className="text-gray-700 print:text-black">{opt}</span>
                       </div>
                     ))}
                   </div>
                   {renderAnswers && (
                     <div className="mt-4 pt-3 border-t border-gray-200 text-green-700 font-medium flex items-start gap-2 print:text-black print:border-black">
                       <Check size={18} className="mt-0.5 print:hidden" /> 
                       <div>
                        <strong>Answer:</strong> {q.correctAnswer}
                        {q.explanation && <p className="text-sm text-gray-600 font-normal mt-1 print:text-gray-800">{q.explanation}</p>}
                       </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>
        )}

        {renderQuestions && lesson.shortQuestions.length > 0 && (
          <div className="p-8 border-b border-gray-100 print:p-0 print:mb-6 print:border-none print:break-inside-avoid">
             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:text-black">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm print:hidden">3</span>
                Short Questions
             </h2>
             <div className="space-y-4">
                {lesson.shortQuestions.map((q, idx) => (
                  <div key={idx} className="bg-white p-0 print:break-inside-avoid">
                    <p className="font-medium text-gray-900 mb-2 print:text-black">{idx + 1}. {q.question}</p>
                    <div className="h-20 border-b-2 border-gray-200 border-dashed w-full print:border-black print:h-16"></div>
                     {renderAnswers && (
                     <div className="mt-2 bg-orange-50 p-3 rounded-lg text-orange-800 text-sm print:bg-transparent print:text-black print:border print:border-black">
                       <strong>Model Answer:</strong> {q.answerKey}
                     </div>
                   )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {renderQuestions && lesson.fillInBlanks.length > 0 && (
          <div className="p-8 border-b border-gray-100 print:p-0 print:mb-6 print:border-none print:break-inside-avoid">
             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:text-black">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm print:hidden">4</span>
                Fill in the Blanks
             </h2>
             <div className="space-y-4">
                {lesson.fillInBlanks.map((q, idx) => (
                  <div key={idx} className="bg-teal-50/50 p-4 rounded-lg print:bg-transparent print:p-0 print:break-inside-avoid">
                    <p className="font-medium text-gray-900 print:text-black">{idx + 1}. {q.sentence}</p>
                     {renderAnswers && (
                     <div className="mt-2 text-teal-700 font-semibold text-sm print:text-black">
                       Answer: {q.answer}
                     </div>
                   )}
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
      
      {/* Footer Toggle - Hidden during print */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg flex justify-center z-50 print:hidden">
        <button 
          onClick={() => setShowAnswers(!showAnswers)}
          className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-800 transition-transform active:scale-95 flex items-center gap-2"
        >
          {showAnswers ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          {showAnswers ? 'Hide Answers' : 'Show Answers Key'}
        </button>
      </div>

    </div>
  );
};
