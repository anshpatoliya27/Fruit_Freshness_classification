import { CheckCircle, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";

export default function Resultcard({ result }) {
  const isFresh = result.toLowerCase().includes("fresh");

  // Format the result to properly title case the fruit name (e.g., "Fresh oranges 🍎" -> "Fresh Oranges 🍎")
  const formattedResult = result.replace(
    /\b([a-zA-Z]+)\b/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className={`relative overflow-hidden p-6 rounded-2xl shadow-xl flex items-center space-x-4 border-l-8 ${isFresh
          ? "bg-gradient-to-r from-emerald-50 to-green-100 border-emerald-500 text-emerald-900"
          : "bg-gradient-to-r from-red-50 to-rose-100 border-red-500 text-red-900"
        }`}
    >
      <div className={`p-3 rounded-full flex-shrink-0 shadow-sm ${isFresh ? "bg-emerald-200/50 text-emerald-600" : "bg-red-200/50 text-red-600"
        }`}>
        {isFresh ? <CheckCircle size={28} /> : <AlertOctagon size={28} />}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-1 opacity-70">
          Analysis Complete
        </h3>
        <p className="text-2xl font-black tracking-tight">
          {formattedResult}
        </p>
      </div>

      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none transform rotate-12">
        {isFresh ? <CheckCircle size={100} /> : <AlertOctagon size={100} />}
      </div>
    </motion.div>
  );
}