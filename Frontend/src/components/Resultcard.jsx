import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Resultcard({ result, confidence, live }) {
  const isFresh = result.toLowerCase().includes("fresh");
  const isUnknown = result.toLowerCase().includes("no fruit");

  return (
    <div className={`p-4 rounded-2xl border w-[260px] sm:w-[300px] ${live ? 'shadow-sm ring-1 ring-[#6BCB77]/20 border-[#6BCB77]/30' : 'shadow-sm'} bg-white border-gray-200`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-xl flex-shrink-0 ${isFresh ? "bg-[#6BCB77]/15 text-[#6BCB77]" : isUnknown ? "bg-gray-100 text-gray-500" : "bg-[#FF6B6B]/15 text-[#FF6B6B]"}`}>
          {isFresh ? <CheckCircle2 size={24} strokeWidth={2.5} /> : isUnknown ? <HelpCircle size={24} strokeWidth={2.5} /> : <AlertCircle size={24} strokeWidth={2.5} />}
        </div>
        <div className="flex-1">
          {live && <div className="text-[9px] font-bold uppercase tracking-wider text-red-500 mb-0.5 animate-pulse">Live Feed</div>}
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {result}
          </p>
        </div>
      </div>

      {confidence !== undefined && confidence !== null && !isUnknown && (
        <div className="w-full pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Confidence Score</span>
                <span className="text-sm font-bold text-gray-700">{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                    initial={live ? false : { width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${isFresh ? 'bg-[#6BCB77]' : 'bg-[#FF6B6B]'}`}
                />
            </div>
        </div>
      )}
    </div>
  );
}