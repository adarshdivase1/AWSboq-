import React from 'react';
import LoaderIcon from './icons/LoaderIcon';
import SparklesIcon from './icons/SparklesIcon';

interface RequirementInputProps {
  requirements: string;
  setRequirements: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const RequirementInput: React.FC<RequirementInputProps> = ({
  requirements,
  setRequirements,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">Describe Your Project Requirements</h2>
      <textarea
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        rows={8}
        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500"
        placeholder="e.g., 'A medium-sized conference room for 12 people. Needs a large 4K display, video conferencing capabilities with ceiling microphones, and wireless presentation.'"
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isLoading || !requirements.trim()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoaderIcon />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon />
              Generate BOQ
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RequirementInput;
