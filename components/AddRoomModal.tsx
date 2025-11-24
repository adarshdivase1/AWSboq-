import React from 'react';
import { roomTemplates } from '../data/templateData';
import { RoomTemplate } from '../types';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (templateAnswers?: Record<string, any>, templateName?: string) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAddRoom }) => {
  if (!isOpen) return null;

  const handleSelect = (template?: RoomTemplate) => {
    if (template) {
      onAddRoom(template.answers, template.name);
    } else {
      // Blank room
      onAddRoom();
    }
  };
  
  const TemplateCard: React.FC<{ template: RoomTemplate | null, onClick: () => void }> = ({ template, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all duration-200 transform hover:scale-105 flex flex-col"
    >
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{template ? template.name : 'Start from Scratch'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{template ? template.description : 'Begin with a blank questionnaire for a fully custom setup.'}</p>
        </div>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
            <span>{template ? `👥 ${template.details.capacity}` : ''}</span>
            <span>{template ? `🖥️ ${template.details.display}` : ''}</span>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-4xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add a New Room</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-8 overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">Choose a starting point:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TemplateCard template={null} onClick={() => handleSelect()} />
                {roomTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} onClick={() => handleSelect(template)} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;