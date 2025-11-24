import React from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] border border-slate-200 dark:border-slate-700" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <img 
          src={imageUrl} 
          alt="Product Preview" 
          className="max-w-full max-h-[80vh] object-contain" 
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;