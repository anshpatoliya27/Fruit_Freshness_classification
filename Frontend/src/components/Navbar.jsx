import { Leaf, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-card bg-[#0B1120]/80 border-b border-white/10 backdrop-blur-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="p-2 bg-gradient-to-tr from-emerald-500 to-green-400 rounded-xl shadow-lg ring-4 ring-emerald-500/20 transition-all group-hover:scale-105 group-hover:rotate-6">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-display font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Fresh<span className="text-emerald-500">Sense UI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="hidden sm:flex text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
            Documentation
          </a>
          <a href="#" className="flex items-center justify-center p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <Info className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
