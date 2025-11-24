import React from 'react';
import { Toast as ToastType } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import WarningIcon from './icons/WarningIcon';

interface ToastProps {
  toast: ToastType | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) {
    return null;
  }

  const isSuccess = toast.type === 'success';
  const baseClasses = 'fixed bottom-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center transition-all duration-300 ease-in-out z-50';
  const typeClasses = isSuccess 
    ? 'bg-green-600 border-green-700 text-white dark:bg-green-800 dark:border-green-600' 
    : 'bg-red-600 border-red-700 text-white dark:bg-red-800 dark:border-red-600';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex-shrink-0">
        {isSuccess ? <CheckCircleIcon /> : <WarningIcon />}
      </div>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
      <button 
        onClick={onClose} 
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-lg p-1.5 inline-flex h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-white/30"
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast;