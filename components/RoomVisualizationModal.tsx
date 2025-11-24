import React from 'react';
import LoaderIcon from './icons/LoaderIcon';
import WandIcon from './icons/WandIcon';
import TrashIcon from './icons/TrashIcon';

interface RoomVisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  onRegenerate: () => void;
  onDelete: () => void;
}

const RoomVisualizationModal: React.FC<RoomVisualizationModalProps> = ({ isOpen, onClose, isLoading, error, imageUrl, onRegenerate, onDelete }) => {
  if (!isOpen) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this visualization? You will need to generate it again.')) {
      onDelete();
      onClose(); // Close the modal after deleting
    }
  };

  const handleRegenerate = () => {
    onRegenerate();
    // Do not close the modal, it will show the new loading state
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] border border-slate-200 dark:border-slate-700 flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Room Visualization</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="flex-grow flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900/50 rounded-md">
          {isLoading && (
            <div className="text-center text-slate-500 dark:text-slate-400">
              <div className="flex justify-center">
                <LoaderIcon />
              </div>
              <p className="mt-4 text-lg">Generating high-quality visualization...</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">This can take up to a minute. Please be patient.</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="text-center text-red-600 dark:text-red-400 p-8">
              <h3 className="text-lg font-semibold">Visualization Failed</h3>
              <p>{error}</p>
            </div>
          )}
          {imageUrl && !isLoading && (
            <img 
              src={imageUrl} 
              alt="Generated room visualization" 
              className="max-w-full max-h-full object-contain rounded-md" 
            />
          )}
        </div>
        {((imageUrl && !isLoading) || (error && !isLoading)) && (
            <div className="flex-shrink-0 pt-4 flex justify-end items-center space-x-3">
                {imageUrl && (
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-red-600"
                    >
                        <TrashIcon /> <span className="ml-2">Delete</span>
                    </button>
                )}
                <button
                    onClick={handleRegenerate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
                >
                    <WandIcon /> Re-generate
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default RoomVisualizationModal;