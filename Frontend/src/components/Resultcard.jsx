import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Resultcard({ result, confidence, live }) {
  const isFresh = result.toLowerCase().includes("fresh");
  const isUnknown = result.toLowerCase().includes("no fruit");

  return (
    <div className={`w-full p-6 sm:p-8 rounded-[2rem] border ${isFresh ? 'bg-gradient-to-br from-fruit-primaryLight/60 to-white border-fruit-primary/30 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.2)]' : isUnknown ? 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm' : 'bg-gradient-to-br from-fruit-redLight/60 to-white border-fruit-red/30 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.2)]'} flex flex-col md:flex-row md:items-center justify-between`}>
      <div className="flex items-center space-x-6 mb-6 md:mb-0">
        <div className={`w-16 h-16 flex items-center justify-center rounded-[1.25rem] flex-shrink-0 shadow-sm border ${isFresh ? "bg-fruit-primary text-white border-fruit-primary/20" : isUnknown ? "bg-white text-gray-400 border-gray-200" : "bg-fruit-red text-white border-fruit-red/20"}`}>
          {isFresh ? <CheckCircle2 size={36} strokeWidth={2.5} /> : isUnknown ? <HelpCircle size={36} strokeWidth={2.5} /> : <AlertCircle size={36} strokeWidth={2.5} />}
        </div>
        <div>
          <h3 className={`text-[12px] font-extrabold uppercase tracking-[0.2em] mb-1.5 ${isFresh ? 'text-fruit-primary' : isUnknown ? 'text-gray-400' : 'text-fruit-red'}`}>
             {live ? 'Live Feed Output' : 'Analysis Complete'}
          </h3>
          <p className="text-3xl font-display font-black text-fruit-text tracking-tight">
            {result}
          </p>
        </div>
      </div>

      {confidence !== undefined && confidence !== null && !isUnknown && (
        <div className="w-full md:w-56 pt-5 md:pt-0 md:pl-8 md:border-l border-black/5 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2.5">
                <span className="text-[11px] font-extrabold text-fruit-textMuted uppercase tracking-widest">Confidence</span>
                <span className="text-lg font-black text-fruit-text leading-none">{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-3 overflow-hidden shadow-inner flex">
                <motion.div 
                    initial={live ? false : { width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-sm relative ${isFresh ? 'bg-gradient-to-r from-fruit-primary to-green-400' : 'bg-gradient-to-r from-fruit-red to-orange-400'}`}
                >
                   <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full"></div>
                </motion.div>
            </div>
        </div>
      )}
    </div>
  );
}