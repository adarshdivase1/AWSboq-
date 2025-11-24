import React from 'react';
import { ValidationResult } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import WarningIcon from './icons/WarningIcon';

interface ValidationFeedbackProps {
  result: ValidationResult;
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({ result }) => {
  const hasIssues = result.warnings.length > 0 || result.suggestions.length > 0 || result.missingComponents.length > 0;

  if (!hasIssues) {
    return (
      <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg relative my-4" role="alert">
        <div className="flex items-center">
          <CheckCircleIcon />
          <strong className="font-bold ml-2">Validation Passed!</strong>
          <span className="block sm:inline ml-2">The AI auditor found no critical issues. The BOQ appears complete and logical.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg relative my-4" role="alert">
      <div className="flex items-center mb-3">
        <WarningIcon />
        <strong className="font-bold ml-2">Validation Complete with Feedback</strong>
      </div>
      <div className="space-y-3 text-sm">
        {result.missingComponents.length > 0 && (
          <div>
            <h4 className="font-semibold text-yellow-200">Potentially Missing Components:</h4>
            <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
              {result.missingComponents.map((item, index) => <li key={`missing-${index}`}>{item}</li>)}
            </ul>
          </div>
        )}
        {result.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold text-yellow-200">Warnings:</h4>
            <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
              {result.warnings.map((item, index) => <li key={`warning-${index}`}>{item}</li>)}
            </ul>
          </div>
        )}
        {result.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-yellow-200">Suggestions for Improvement:</h4>
            <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
              {result.suggestions.map((item, index) => <li key={`suggestion-${index}`}>{item}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationFeedback;
