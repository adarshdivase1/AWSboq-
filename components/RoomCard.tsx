import React from 'react';
import { Room } from '../types';
import LoaderIcon from './icons/LoaderIcon';
import TrashIcon from './icons/TrashIcon';
import DuplicateIcon from './icons/DuplicateIcon';

interface RoomCardProps {
  room: Room;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdateName: (id: string, newName: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isActive, onSelect, onDelete, onDuplicate, onUpdateName }) => {
  const activeClasses = 'bg-slate-200 dark:bg-slate-700 border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 scale-105 shadow-lg';
  const inactiveClasses = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-[1.02]';

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateName(room.id, e.target.value);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate(room.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default action
    e.stopPropagation(); // Stop the click from bubbling up to the card
    onDelete(room.id);
  };
  
  return (
    <div 
      onClick={() => onSelect(room.id)}
      className={`p-4 rounded-lg border transform transition-all duration-300 ease-in-out cursor-pointer flex justify-between items-center ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="flex-grow">
        <input
            type="text"
            value={room.name}
            onChange={handleNameChange}
            onClick={(e) => e.stopPropagation()} // Prevent card selection when editing name
            className="text-lg font-semibold bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -ml-1 text-slate-900 dark:text-white"
        />
        {room.isLoading && <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1"><LoaderIcon /> Generating...</div>}
        {room.error && <div className="text-xs text-red-500 dark:text-red-400 mt-1">{room.error}</div>}
        {room.boq && !room.isLoading && <div className="text-xs text-green-600 dark:text-green-400 mt-1">{room.boq.length} items generated.</div>}
      </div>
      <div className="ml-4 flex-shrink-0 flex items-center space-x-1">
        <button 
          onClick={handleDuplicateClick} 
          className="text-slate-500 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Duplicate room"
        >
          <DuplicateIcon />
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="text-slate-500 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
          aria-label="Delete room"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default RoomCard;