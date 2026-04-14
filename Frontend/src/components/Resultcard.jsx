import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Resultcard({ result, confidence }) {
  const isFresh = result.toLowerCase().includes("fresh");

  const formattedResult = result.replace(
    /\b([a-zA-Z]+)\b/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col w-full"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-lg flex-shrink-0 ${isFresh ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {isFresh ? <CheckCircle2 size={24} strokeWidth={2} /> : <AlertCircle size={24} strokeWidth={2} />}
        </div>

        <div className="flex-1">
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Status
          </h3>
          <p className="text-xl font-bold text-gray-900">
            {formattedResult}
          </p>
        </div>
      </div>

      {confidence !== undefined && confidence !== null && (
        <div className="w-full pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Model Confidence</span>
                <span className="text-sm font-semibold text-gray-900">{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${isFresh ? 'bg-emerald-500' : 'bg-rose-500'}`}
                />
            </div>
        </div>
      )}
    </motion.div>
  );
}