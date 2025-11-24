import React, { useState, useEffect } from 'react';
import { questionnaire } from '../data/questionnaireData';
import { Question } from '../types';

interface QuestionnaireProps {
  onAnswersChange: (answers: Record<string, any>) => void;
  initialAnswers: Record<string, any>;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onAnswersChange, initialAnswers }) => {
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);

  useEffect(() => {
    onAnswersChange(answers);
  }, [answers, onAnswersChange]);

  const handleInputChange = (id: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };
  
  const handleMultiChoiceChange = (id: string, value: string) => {
    setAnswers(prev => {
      // Ensure currentSelection is always an array to prevent type errors
      const currentSelection = Array.isArray(prev[id]) ? prev[id] : [];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item: string) => item !== value)
        : [...currentSelection, value];
      return { ...prev, [id]: newSelection };
    });
  };

  const renderQuestion = (question: Question) => {
    const inputClass = "mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    
    switch (question.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={question.type}
            id={question.id}
            name={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={inputClass}
          />
        );
      case 'select':
        return (
          <select
            id={question.id}
            name={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className={inputClass}
          >
            <option value="">Select an option</option>
            {question.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'multiple-choice':
        return (
            <div className="mt-2 space-y-2">
                {question.options?.map(opt => (
                    <label key={opt.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name={question.id}
                            value={opt.value}
                            checked={answers[question.id]?.includes(opt.value) || false}
                            onChange={() => handleMultiChoiceChange(question.id, opt.value)}
                            className="h-4 w-4 rounded border-slate-400 dark:border-slate-500 bg-slate-200 dark:bg-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                    </label>
                ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {questionnaire.map(section => (
        <div key={section.title}>
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.questions.map(question => (
              <div key={question.id}>
                <label htmlFor={question.id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {question.text}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questionnaire;