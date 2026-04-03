import React from 'react';

const MLStatusBadge = ({ online }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border
    ${online ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
    {online ? 'ML API Online' : 'ML Offline (Mock)'}
  </span>
);

export default MLStatusBadge;
