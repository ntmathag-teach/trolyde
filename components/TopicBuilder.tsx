import React from 'react';
import { DetailedTopic, DifficultyDistribution } from '../types';
import { Plus, Trash2, Layers, AlertCircle } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  topics: DetailedTopic[];
  onChange: (topics: DetailedTopic[]) => void;
  colorClass?: string;
}

const TopicBuilder: React.FC<Props> = ({ 
  title = "Ma Trận Kiến Thức Chi Tiết", 
  description,
  topics, 
  onChange,
  colorClass = "bg-indigo-900/20 border-indigo-500/20" 
}) => {
  const addTopic = () => {
    const newTopic: DetailedTopic = {
      id: Date.now().toString(),
      name: '',
      distribution: { nb: 1, th: 0, vd: 0, vdc: 0 }
    };
    onChange([...topics, newTopic]);
  };

  const removeTopic = (id: string) => {
    onChange(topics.filter(t => t.id !== id));
  };

  const updateTopicName = (id: string, name: string) => {
    onChange(topics.map(t => t.id === id ? { ...t, name } : t));
  };

  const updateDistribution = (id: string, key: keyof DifficultyDistribution, delta: number) => {
    onChange(topics.map(t => {
      if (t.id === id) {
        const newVal = Math.max(0, t.distribution[key] + delta);
        return { ...t, distribution: { ...t.distribution, [key]: newVal } };
      }
      return t;
    }));
  };

  const calculateTopicTotal = (dist: DifficultyDistribution) => dist.nb + dist.th + dist.vd + dist.vdc;

  const totalQuestions = topics.reduce((acc, t) => acc + calculateTopicTotal(t.distribution), 0);

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg overflow-hidden mb-4">
      <div className={`p-5 ${colorClass} border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-3`}>
        <div>
           <h3 className="font-bold text-slate-200 flex items-center gap-2 text-lg">
             <Layers size={18} className="text-primary-400" />
             {title}
           </h3>
           {description && <p className="text-xs text-slate-400 mt-1 opacity-80">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
             Tổng: <span className="text-slate-200 ml-1">{totalQuestions} câu</span>
          </span>
          <button
            onClick={addTopic}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600/10 border border-primary-500/30 text-primary-400 hover:bg-primary-600/20 text-sm font-semibold rounded-lg transition-all"
          >
            <Plus size={16} /> Thêm dòng
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {topics.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
            <p>Chưa có dữ liệu chuyên đề. Hãy bấm "Thêm dòng" để xây dựng ma trận.</p>
          </div>
        ) : (
          <div className="space-y-3">
             {/* Header Row - Hide on mobile, show on md */}
            <div className="hidden md:grid grid-cols-12 gap-3 text-[10px] font-bold text-slate-500 uppercase px-3 tracking-wider">
                <div className="col-span-5">Tên Chuyên đề / Bài học</div>
                <div className="col-span-6 grid grid-cols-4 text-center">
                    <span>Nhận biết</span>
                    <span>Thông hiểu</span>
                    <span>Vận dụng</span>
                    <span>VD Cao</span>
                </div>
                <div className="col-span-1 text-center">Xóa</div>
            </div>

            {topics.map((topic, index) => (
              <div key={topic.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-primary-500/30 hover:bg-slate-800/80 transition-all group">
                {/* Topic Name Input */}
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder={`VD: Hàm số lũy thừa...`}
                    value={topic.name}
                    onChange={(e) => updateTopicName(topic.id, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm text-slate-200 placeholder-slate-600"
                    autoFocus={index === topics.length - 1 && !topic.name}
                  />
                  <div className="md:hidden text-xs text-slate-500 mt-2 font-medium">Tổng: {calculateTopicTotal(topic.distribution)} câu</div>
                </div>

                {/* Distribution Controls */}
                <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-2">
                   {(['nb', 'th', 'vd', 'vdc'] as const).map((level) => (
                     <div key={level} className="flex flex-col items-center bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/50">
                        <span className="md:hidden text-[9px] uppercase text-slate-500 font-bold mb-1">{level}</span>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => updateDistribution(topic.id, level, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:bg-slate-800 rounded transition-colors"
                            >
                                <div className="text-lg leading-none mb-0.5">-</div>
                            </button>
                            <span className="w-5 text-center font-bold text-slate-200 text-sm">{topic.distribution[level]}</span>
                            <button 
                                onClick={() => updateDistribution(topic.id, level, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-primary-400 hover:bg-slate-800 rounded transition-colors"
                            >
                                <div className="text-lg leading-none mb-0.5">+</div>
                            </button>
                        </div>
                     </div>
                   ))}
                </div>

                {/* Delete Action */}
                <div className="md:col-span-1 flex justify-center">
                    <button
                        onClick={() => removeTopic(topic.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa dòng"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicBuilder;