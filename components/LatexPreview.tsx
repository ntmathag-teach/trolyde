import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, FileCode, ExternalLink, Terminal, FileText } from 'lucide-react';

interface Props {
  latexCode: string;
}

const LatexPreview: React.FC<Props> = ({ latexCode }) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Synchronize scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([latexCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "exam_paper.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate line numbers
  const lineCount = latexCode.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  if (!latexCode) return null;

  return (
    <div className="mt-12 animate-fade-in">
        {/* Header / Actions Bar */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <FileCode size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Kết quả LaTeX</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Check size={12} className="text-emerald-500" />
                        Đã tạo thành công • {latexCode.length.toLocaleString()} ký tự
                    </p>
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <a
                    href="https://www.overleaf.com/project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-400 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-all hover:border-slate-600"
                >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Mở</span> Overleaf
                </a>
                <button
                    onClick={handleDownload}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                >
                    <Download size={16} />
                    Tải .tex
                </button>
                <button
                    onClick={handleCopy}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl focus:outline-none transition-all shadow-lg transform active:scale-95 ${
                    copied
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                        : 'bg-primary-600 hover:bg-primary-500 shadow-primary-900/20'
                    }`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Đã chép!' : 'Sao chép'}
                </button>
            </div>
        </div>

        {/* IDE Window */}
        <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-[#1e1e1e] shadow-2xl ring-1 ring-white/5">
            {/* IDE Tab Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-4">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] text-slate-300 text-xs font-mono rounded-t-md border-t border-l border-r border-slate-700/50 relative top-[5px]">
                        <FileText size={12} className="text-blue-400" />
                        exam_output.tex
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                        <Terminal size={12} />
                        UTF-8
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                        LaTeX
                    </div>
                </div>
            </div>

            {/* Code Editor Area */}
            <div className="relative flex h-[600px] font-mono text-sm bg-[#1e1e1e]">
                {/* Line Numbers Gutter */}
                <div 
                    ref={lineNumbersRef}
                    className="hidden md:block w-12 flex-shrink-0 bg-[#1e1e1e] border-r border-slate-800 text-right pr-3 pt-6 text-slate-600 select-none overflow-hidden"
                    style={{ fontFamily: "'Fira Code', 'Consolas', monospace", lineHeight: '1.5rem' }}
                >
                    {lineNumbers.map((num) => (
                        <div key={num} className="h-6">{num}</div>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    ref={textareaRef}
                    readOnly
                    value={latexCode}
                    onScroll={handleScroll}
                    className="w-full h-full p-6 bg-transparent text-[#d4d4d4] resize-none focus:outline-none focus:ring-0 selection:bg-[#264f78] selection:text-white whitespace-pre"
                    spellCheck={false}
                    style={{ lineHeight: '1.5rem' }}
                />
            </div>
        </div>

        {/* Footer Hint */}
        <p className="mt-4 text-center text-sm text-slate-500">
            * Mẹo: Sử dụng <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 hover:underline font-medium">Overleaf</a> hoặc <span className="text-slate-400 font-medium">TexStudio</span> để biên dịch mã nguồn này thành PDF.
        </p>
    </div>
  );
};

export default LatexPreview;