import React from 'react';
import { Theme } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onOpenBrandingModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onOpenBrandingModal }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">Gen</span>BOQ
            </h1>
            <p className="ml-4 text-sm text-slate-500 dark:text-slate-400 hidden md:block">AI-Powered AV Bill of Quantities</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBrandingModal}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-blue-500"
              aria-label="Customize company branding"
              title="Customize Branding"
            >
              <BuildingOfficeIcon />
            </button>
            <ThemeSwitcher theme={theme} onToggle={onThemeToggle} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;