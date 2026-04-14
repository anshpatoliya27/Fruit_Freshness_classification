import { CheckCircle, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

export default function Resultcard({ result, confidence }) {
  const isFresh = result.toLowerCase().includes("fresh");

  const formattedResult = result.replace(
    /\b([a-zA-Z]+)\b/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative overflow-hidden p-6 rounded-2xl shadow-2xl flex flex-col w-full border ${isFresh
          ? "bg-[#0f1d18] border-emerald-500/30 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]"
          : "bg-[#1f1113] border-rose-500/30 shadow-[0_10px_40px_-10px_rgba(244,63,94,0.3)]"
        }`}
    >
      {/* Glossy highlight line at the top */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${isFresh ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-400 to-transparent'}`}></div>

      <div className="flex items-center space-x-5 mb-5 relative z-10">
        <div className={`p-4 rounded-2xl flex-shrink-0 shadow-inner ${isFresh ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/20 text-rose-400 border border-rose-500/20"
          }`}>
          {isFresh ? <CheckCircle size={32} strokeWidth={2.5} /> : <AlertOctagon size={32} strokeWidth={2.5} />}
        </div>

        <div className="flex-1">
          <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ${isFresh ? "text-emerald-500/80" : "text-rose-500/80"}`}>
            Analysis Complete
          </h3>
          <p className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            {formattedResult}
          </p>
        </div>
      </div>

      {confidence !== undefined && confidence !== null && (
        <div className="w-full mt-1 relative z-10 p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-400">Statistical Confidence</span>
                <span className={`text-sm font-bold ${isFresh ? "text-emerald-400" : "text-rose-400"}`}>{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-2 rounded-full relative ${isFresh ? 'bg-emerald-500' : 'bg-rose-500'}`}
                >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20.w-[50%] blur-sm mask-image:linear-gradient(90deg,transparent,white,transparent) animate-shimmer"></div>
                </motion.div>
            </div>
        </div>
      )}

      {/* Abstract Background Decoration */}
      <div className="absolute -right-8 -top-8 opacity-5 pointer-events-none transform rotate-12 scale-150">
        {isFresh ? <CheckCircle size={120} /> : <AlertOctagon size={120} />}
      </div>
    </motion.div>
  );
}