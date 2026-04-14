import { Plus, History as HistoryIcon, Leaf } from "lucide-react";

export default function Sidebar({ history, activeId, onSelect, onNew }) {
  return (
    <div className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full z-10 hidden md:flex overflow-hidden">
      <div className="p-4 py-5 border-b border-gray-100 flex flex-col w-full sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-2.5 font-semibold text-lg tracking-tight mb-5 text-gray-800 px-1">
          <div className="bg-[#6BCB77] p-1.5 rounded-lg shadow-sm">
            <Leaf size={18} className="text-white" strokeWidth={2.5}/>
          </div>
          <span>FreshSense AI</span>
        </div>
        <button 
          onClick={onNew}
          className="w-full flex items-center justify-start space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} className="opacity-70" />
          <span>New Analysis</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scroll-smooth">
        {history.length > 0 && <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2 mt-2">Recent</h3>}
        {history.length === 0 ? (
            <div className="px-2 py-6 text-xs text-gray-400 flex flex-col items-center justify-center text-center space-y-2 opacity-70">
              <HistoryIcon size={24} />
              <p>No history yet. Start by uploading an image.</p>
            </div>
        ) : history.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-sm border-transparent border ${activeId === item.id ? 'bg-[#F9FAFB] border-gray-200 font-medium text-gray-900' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <div className="w-6 h-6 rounded flex-shrink-0 bg-gray-100 overflow-hidden border border-gray-200">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>
              <span className="truncate flex-1 tracking-tight text-[13px]">{item.result || "Scan Analysis"}</span>
            </button>
        ))}
      </div>
    </div>
  );
}
