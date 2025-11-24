import React from 'react';
import { BrandingSettings, ClientDetails } from '../types';

interface PrintHeaderProps {
  branding: BrandingSettings;
  client: ClientDetails;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ branding, client }) => {
  return (
    <div className="hidden print:block mb-8 print-only-header">
      <div className="flex justify-between items-start pb-4 border-b-2 border-black">
        <div className="flex-shrink-0">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt="Company Logo" style={{ maxHeight: '80px', maxWidth: '250px' }} />
          )}
        </div>
        <div className="text-right text-xs">
          <h1 className="text-xl font-bold">{branding.companyInfo.name}</h1>
          <p>{branding.companyInfo.address}</p>
          <p>Phone: {branding.companyInfo.phone}</p>
          <p>Email: {branding.companyInfo.email}</p>
          <p>{branding.companyInfo.website}</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">{client.projectName || 'Project Proposal'}</h2>
        <table className="text-sm">
            <tbody>
                <tr>
                    <td className="font-bold pr-4 py-1">Client:</td>
                    <td>{client.clientName}</td>
                </tr>
                 <tr>
                    <td className="font-bold pr-4 py-1">Date:</td>
                    <td>{client.date}</td>
                </tr>
                <tr>
                    <td className="font-bold pr-4 py-1">Prepared By:</td>
                    <td>{client.preparedBy}</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintHeader;