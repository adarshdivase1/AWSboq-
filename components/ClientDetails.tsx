import React from 'react';
import { ClientDetails as ClientDetailsType } from '../types';

interface ClientDetailsProps {
  details: ClientDetailsType;
  onDetailsChange: (details: ClientDetailsType) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ details, onDetailsChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onDetailsChange({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = "mt-1 block w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Project & Client Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Project Name
          </label>
          <input type="text" name="projectName" id="projectName" value={details.projectName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Client Name
          </label>
          <input type="text" name="clientName" id="clientName" value={details.clientName} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="preparedBy" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Prepared By
          </label>
          <input type="text" name="preparedBy" id="preparedBy" value={details.preparedBy} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="designEngineer" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Design Engineer
          </label>
          <input type="text" name="designEngineer" id="designEngineer" value={details.designEngineer} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="accountManager" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Account Manager
          </label>
          <input type="text" name="accountManager" id="accountManager" value={details.accountManager} onChange={handleChange} className={inputClass} />
        </div>
         <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Date
          </label>
          <input type="date" name="date" id="date" value={details.date} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label htmlFor="keyClientPersonnel" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Key Client Personnel
          </label>
          <input type="text" name="keyClientPersonnel" id="keyClientPersonnel" value={details.keyClientPersonnel} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
            Location
          </label>
          <input type="text" name="location" id="location" value={details.location} onChange={handleChange} className={inputClass} />
        </div>

        <div className="md:col-span-2">
            <label htmlFor="keyComments" className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Key Comments for this version
            </label>
            <textarea
                name="keyComments"
                id="keyComments"
                rows={3}
                value={details.keyComments}
                onChange={handleChange}
                className={inputClass}
            />
        </div>

      </div>
    </div>
  );
};

export default ClientDetails;