import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  title: string;
  count: number;
  onChange: (newValue: number) => void;
  colorClass: string;
  description?: string;
}

const SimpleCounterInput: React.FC<Props> = ({ title, count, onChange, colorClass, description }) => {
  const handleChange = (delta: number) => {
    const newVal = Math.max(0, count + delta);
    onChange(newVal);
  };

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm shadow-sm transition-all hover:border-opacity-50 ${colorClass}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-200 text-lg tracking-wide">{title}</h3>
        <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider">
           <span className="text-primary-400 text-sm mr-1">{count}</span> Câu hỏi lớn
        </span>
      </div>
      
      {description && (
        <p className="text-xs text-slate-400 mb-5 italic border-l-2 border-slate-600 pl-3">
          {description}
        </p>
      )}
      
      <div className="flex items-center justify-center space-x-6 p-4 bg-slate-900/40 rounded-xl border border-white/5">
          <button
            onClick={() => handleChange(-1)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700 shadow-lg"
            disabled={count <= 0}
          >
            <Minus size={20} />
          </button>
          
          <div className="w-20 text-center">
            <span className="text-4xl font-bold text-slate-100">{count}</span>
          </div>
          
          <button
            onClick={() => handleChange(1)}
            className="p-3 rounded-xl bg-slate-800 hover:bg-primary-600/20 text-slate-400 hover:text-primary-400 transition-all border border-slate-700 shadow-lg"
          >
            <Plus size={20} />
          </button>
      </div>
      <div className="mt-4 text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
        Mỗi câu hỏi sẽ bao gồm 4 ý (a, b, c, d)
      </div>
    </div>
  );
};

export default SimpleCounterInput;