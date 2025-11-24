import React from 'react';

const SaveIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 mr-2" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19 21V12a2 2 0 00-2-2H7a2 2 0 00-2 2v9" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M7 10V5a2 2 0 012-2h6a2 2 0 012 2v5"
    />
  </svg>
);

export default SaveIcon;
