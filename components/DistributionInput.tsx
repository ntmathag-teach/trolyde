import React from 'react';
import { DifficultyDistribution } from '../types';
import { Minus, Plus } from 'lucide-react';

interface Props {
  title: string;
  value: DifficultyDistribution;
  onChange: (newValue: DifficultyDistribution) => void;
  colorClass: string;
}

const DistributionInput: React.FC<Props> = ({ title, value, onChange, colorClass }) => {
  const handleChange = (key: keyof DifficultyDistribution, delta: number) => {
    const newVal = Math.max(0, value[key] + delta);
    onChange({ ...value, [key]: newVal });
  };

  const levels = [
    { key: 'nb', label: 'Nhận biết' },
    { key: 'th', label: 'Thông hiểu' },
    { key: 'vd', label: 'Vận dụng' },
    { key: 'vdc', label: 'Vận dụng cao' },
  ] as const;

  const total = value.nb + value.th + value.vd + value.vdc;

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm shadow-sm transition-all hover:border-opacity-50 ${colorClass}`}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-slate-200 text-lg tracking-wide">{title}</h3>
        <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider">
          Tổng: <span className="text-primary-400 text-sm ml-1">{total}</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {levels.map((level) => (
          <div key={level.key} className="flex flex-col items-center bg-slate-900/40 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{level.label}</span>
            <div className="flex items-center space-x-3 w-full justify-between">
              <button
                onClick={() => handleChange(level.key, -1)}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={value[level.key] <= 0}
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center font-bold text-xl text-slate-100">
                {value[level.key]}
              </div>
              <button
                onClick={() => handleChange(level.key, 1)}
                className="p-1.5 rounded-lg hover:bg-primary-600/20 hover:text-primary-400 text-slate-500 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionInput;