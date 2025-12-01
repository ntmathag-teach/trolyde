
import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, GraduationCap, Layers, Sparkles, AlertCircle, Brain, Zap, PencilLine, List, Grid, Key, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_CONFIG, ExamConfig, SUBJECTS, GRADES, BOOKS } from './types';
import DistributionInput from './components/DistributionInput';
import SimpleCounterInput from './components/SimpleCounterInput';
import LatexPreview from './components/LatexPreview';
import TopicBuilder from './components/TopicBuilder';
import { generateExamLatex } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_CONFIG);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [latexResult, setLatexResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        setApiKey(savedKey);
    }
  }, []);

  // Save API Key to localStorage when it changes
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
        setError("Vui lòng nhập Gemini API Key để khởi tạo đề thi.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setLatexResult('');
    
    try {
      // Pass the apiKey to the service
      const result = await generateExamLatex(config, apiKey);
      setLatexResult(result);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to preview when result is generated
  useEffect(() => {
    if (latexResult && previewRef.current) {
        // Small timeout to ensure DOM is ready
        setTimeout(() => {
            previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [latexResult]);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Space Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] opacity-50 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[80px] opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-900/80 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-float backdrop-blur-md">
              <GraduationCap className="w-12 h-12 text-primary-400" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-cyan-200 to-blue-400 drop-shadow-sm">
            MathSetter <span className="font-light italic text-white">Pro</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Hệ thống kiến tạo đề thi LaTeX thông minh với sức mạnh từ Gemini AI.
          </p>
        </div>

        {/* Main Content Card - Glassmorphism */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          
          {/* API Key Section */}
          <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/80">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                    <Key size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-100">Cấu hình API Key</h2>
                    <p className="text-xs text-slate-500">Key của bạn được lưu cục bộ trên trình duyệt và không chia sẻ ra ngoài.</p>
                </div>
             </div>
             
             <div className="relative">
                <input 
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Nhập Google Gemini API Key của bạn (bắt đầu bằng AIza...)"
                    className="w-full pl-4 pr-12 py-3 bg-black/40 border border-yellow-500/30 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 text-yellow-100 placeholder-slate-600 outline-none transition-all font-mono text-sm"
                />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
             <p className="mt-2 text-[10px] text-slate-500 text-right">
                 Chưa có key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-yellow-500 hover:underline">Lấy miễn phí tại đây</a>
             </p>
          </div>

          {/* Header Configuration */}
          <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/40">
             <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                <PencilLine size={20} />
              </div>
              Thiết lập tiêu đề
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-300 uppercase tracking-wider">Tên Trường / Đơn vị</label>
                    <input 
                      type="text"
                      value={config.schoolName}
                      onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-slate-100 placeholder-slate-500 outline-none transition-all"
                      placeholder="VD: Trường THPT Chuyên..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-300 uppercase tracking-wider">Tên Bài Thi</label>
                    <input 
                      type="text"
                      value={config.examTitle}
                      onChange={(e) => setConfig({ ...config, examTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-slate-100 placeholder-slate-500 outline-none transition-all"
                      placeholder="VD: Đề Kiểm Tra 15 Phút..."
                    />
                </div>
            </div>
          </div>

          {/* Top Configuration Section */}
          <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/40">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                <Layers size={20} />
              </div>
              Thông số chung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Môn học</label>
                <div className="relative">
                  <select 
                    value={config.subject}
                    onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-800"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lớp</label>
                <div className="relative">
                  <select 
                    value={config.grade}
                    onChange={(e) => setConfig({ ...config, grade: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-800"
                  >
                    {GRADES.map(g => <option key={g} value={g}>Lớp {g}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Book */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bộ sách</label>
                <div className="relative">
                  <select 
                    value={config.book}
                    onChange={(e) => setConfig({ ...config, book: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-800"
                  >
                    {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* General Topic Context */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-primary-300 uppercase tracking-wider">
                    Chủ đề bao quát / Nội dung trọng tâm
                </label>
                <input 
                  type="text"
                  placeholder="VD: Ôn tập chương Hàm số, Hình học không gian..."
                  value={config.topic}
                  onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
            </div>
          </div>

          {/* Exam Structure Section */}
          <div className="p-6 md:p-8 bg-slate-900/20">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                      <BookOpen size={20} />
                   </div>
                  Cấu trúc đề thi
                </h2>
                
                {/* Global Toggle Mode */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <button 
                      onClick={() => setConfig({...config, useDetailedTopics: false})}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${!config.useDetailedTopics ? 'bg-slate-700 text-cyan-400 shadow-sm border border-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       <List size={16} /> Cơ bản
                    </button>
                    <button 
                      onClick={() => setConfig({...config, useDetailedTopics: true})}
                       className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${config.useDetailedTopics ? 'bg-slate-700 text-cyan-400 shadow-sm border border-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                       <Grid size={16} /> Ma trận chi tiết
                    </button>
                </div>
             </div>
            
            <div className="space-y-8">
              
              {/* PHẦN 1 */}
              <div>
                {!config.useDetailedTopics ? (
                   <DistributionInput 
                      title="Phần 1: Trắc nghiệm (4 lựa chọn)" 
                      value={config.multipleChoice}
                      onChange={(val) => setConfig({ ...config, multipleChoice: val })}
                      colorClass="border-blue-500/20 bg-blue-500/5"
                   />
                ) : (
                   <TopicBuilder 
                      title="Ma trận Phần 1: Trắc nghiệm nhiều lựa chọn"
                      description="Nhập chi tiết các chuyên đề và mức độ cho câu hỏi trắc nghiệm."
                      topics={config.part1Topics}
                      onChange={(val) => setConfig({ ...config, part1Topics: val })}
                      colorClass="bg-blue-900/20 border-blue-500/20"
                   />
                )}
              </div>

              {/* PHẦN 2 */}
              <div>
                {!config.useDetailedTopics ? (
                   <SimpleCounterInput 
                      title="Phần 2: Trắc nghiệm Đúng / Sai"
                      description="Câu hỏi dạng chùm. Mỗi câu gồm 4 ý a, b, c, d với độ khó tăng dần (lũy tiến)."
                      count={config.trueFalse}
                      onChange={(val) => setConfig({ ...config, trueFalse: val })}
                      colorClass="border-orange-500/20 bg-orange-500/5"
                   />
                ) : (
                   <TopicBuilder 
                      title="Ma trận Phần 2: Trắc nghiệm Đúng/Sai"
                      description="Mỗi dòng tương ứng với 1 câu hỏi lớn."
                      topics={config.part2Topics}
                      onChange={(val) => setConfig({ ...config, part2Topics: val })}
                      colorClass="bg-orange-900/20 border-orange-500/20"
                   />
                )}
              </div>

              {/* PHẦN 3 */}
              <div>
                {!config.useDetailedTopics ? (
                   <DistributionInput 
                      title="Phần 3: Trả lời ngắn" 
                      value={config.shortAnswer}
                      onChange={(val) => setConfig({ ...config, shortAnswer: val })}
                      colorClass="border-emerald-500/20 bg-emerald-500/5"
                   />
                ) : (
                   <TopicBuilder 
                      title="Ma trận Phần 3: Trả lời ngắn"
                      description="Ưu tiên các bài toán thực tế, liên môn cho phần này."
                      topics={config.part3Topics}
                      onChange={(val) => setConfig({ ...config, part3Topics: val })}
                      colorClass="bg-emerald-900/20 border-emerald-500/20"
                   />
                )}
              </div>

            </div>

            {/* Advanced Options */}
            <div className="mt-10 pt-8 border-t border-white/10">
               <div className={`relative overflow-hidden flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${config.useDeepThinking ? 'bg-fuchsia-900/20 border-fuchsia-500/40 shadow-[0_0_30px_rgba(192,38,211,0.1)]' : 'bg-slate-800/40 border-slate-700/50'}`}>
                  
                  {config.useDeepThinking && <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>}

                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-3 rounded-xl mt-1 ${config.useDeepThinking ? 'bg-fuchsia-500/20 text-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.3)]' : 'bg-slate-700/50 text-slate-500'}`}>
                      {config.useDeepThinking ? <Brain size={24} /> : <Zap size={24} />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg flex items-center gap-2 ${config.useDeepThinking ? 'text-fuchsia-100' : 'text-slate-300'}`}>
                        Deep Thinking Mode
                        {config.useDeepThinking && <span className="text-[10px] bg-fuchsia-500 text-white px-2 py-0.5 rounded-full font-bold tracking-wide uppercase">Pro</span>}
                      </h3>
                      <p className={`text-sm mt-1 leading-relaxed ${config.useDeepThinking ? 'text-fuchsia-200/70' : 'text-slate-500'}`}>
                         Kích hoạt <strong>Gemini 3.0 Pro</strong> với chuỗi suy luận sâu (Deep Reasoning).
                         <br/>Tối ưu cho đề thi học sinh giỏi, toán hình học phức tạp.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={config.useDeepThinking}
                          onChange={(e) => setConfig({...config, useDeepThinking: e.target.checked})} 
                        />
                        <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-fuchsia-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-fuchsia-600 peer-checked:shadow-[0_0_15px_rgba(232,121,249,0.6)]"></div>
                      </label>
                  </div>
               </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 flex items-start gap-3 text-red-200 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <p className="font-bold text-red-400">Đã xảy ra lỗi hệ thống:</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-10 flex justify-center pb-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                  group relative flex items-center justify-center gap-3 px-10 py-5
                  text-lg font-bold text-white rounded-2xl shadow-lg 
                  transition-all duration-300 transform border border-white/20
                  ${isLoading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'}
                `}
              >
                 {/* Button Glow Effect */}
                 {!isLoading && <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>}

                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">AI đang phân tích & khởi tạo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    KHỞI TẠO ĐỀ THI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div ref={previewRef}>
            {latexResult && <LatexPreview latexCode={latexResult} />}
        </div>

      </div>
    </div>
  );
};

export default App;
