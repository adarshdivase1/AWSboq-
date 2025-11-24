import React, { useState, useEffect } from 'react';
import LoaderIcon from './icons/LoaderIcon';
import WandIcon from './icons/WandIcon';

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (refinementPrompt: string) => void;
  isLoading: boolean;
}

const RefineModal: React.FC<RefineModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPrompt(''); // Clear prompt text when modal opens
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Refine BOQ with AI</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="refine-prompt" className="block text-md font-medium text-slate-600 dark:text-slate-300 mb-2">
                Describe your changes
              </label>
              <textarea
                id="refine-prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="e.g., 'Change all displays to a more budget-friendly brand like LG', 'Add a document camera', or 'Remove all wireless presentation devices and add more HDMI cables.'"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
              {isLoading ? <><LoaderIcon />Refining...</> : <><WandIcon />Refine</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefineModal;