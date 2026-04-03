import React from 'react';

const colorMap = {
  slate:  { bar: 'bg-slate-400', text: 'text-slate-900' },
  amber:  { bar: 'bg-amber-400', text: 'text-amber-700' },
  blue:   { bar: 'bg-blue-400',  text: 'text-blue-700'  },
  indigo: { bar: 'bg-indigo-400',text: 'text-indigo-700'},
  green:  { bar: 'bg-green-500', text: 'text-green-700' },
  red:    { bar: 'bg-red-400',   text: 'text-red-700'   },
};

const StatsCard = ({ title, value, color = 'slate' }) => {
  const c = colorMap[color] || colorMap.slate;
  return (
    <div className="bg-white border border-border rounded-xl p-4 relative overflow-hidden shadow-sm">
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${c.bar}`} />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-2 mb-1">{title}</p>
      <h3 className={`text-3xl font-extrabold ml-2 ${c.text}`}>{value}</h3>
    </div>
  );
};

export default StatsCard;
