import React, { useState, useEffect } from 'react';
import { BrandingSettings, CompanyInfo } from '../types';
import UploadIcon from './icons/UploadIcon';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrandingSettings;
  onSave: (settings: BrandingSettings) => void;
}

const BrandingModal: React.FC<BrandingModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<BrandingSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [name]: value,
      }
    }));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings(prev => ({ ...prev, primaryColor: e.target.value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
  };
  
  if (!isOpen) return null;

  const inputClass = "mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Branding</h2>
          <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Company Logo</label>
                    <div className="mt-1 flex items-center">
                        <span className="inline-block h-20 w-20 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                            {localSettings.logoUrl ? (
                                <img src={localSettings.logoUrl} alt="Company Logo Preview" className="h-full w-full object-contain" />
                            ) : (
                                <svg className="h-full w-full text-slate-300 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </span>
                        <label htmlFor="logo-upload" className="ml-5 bg-white dark:bg-slate-700 py-2 px-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer inline-flex items-center">
                            <UploadIcon />
                            <span>Change</span>
                            <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/svg+xml" />
                        </label>
                    </div>
                </div>
                <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Primary Brand Color</label>
                    <div className="relative">
                        <input type="text" value={localSettings.primaryColor} onChange={handleColorChange} className={`${inputClass} font-mono`} maxLength={7} />
                        <input
                            type="color"
                            id="primaryColor"
                            value={localSettings.primaryColor}
                            onChange={handleColorChange}
                            className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-10 p-1 border-0 bg-transparent cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4 border-t border-slate-200 dark:border-slate-700 pt-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Company Name</label>
                        <input type="text" name="name" id="name" value={localSettings.companyInfo.name} onChange={handleInfoChange} className={inputClass} />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={localSettings.companyInfo.phone} onChange={handleInfoChange} className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Address</label>
                        <input type="text" name="address" id="address" value={localSettings.companyInfo.address} onChange={handleInfoChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                        <input type="email" name="email" id="email" value={localSettings.companyInfo.email} onChange={handleInfoChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Website</label>
                        <input type="url" name="website" id="website" value={localSettings.companyInfo.website} onChange={handleInfoChange} className={inputClass} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-shrink-0 p-6 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-blue-500"
            >
              Save Settings
            </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingModal;