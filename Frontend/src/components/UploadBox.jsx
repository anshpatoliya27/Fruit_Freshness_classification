import { useState } from "react";
import { UploadCloud, CheckCircle2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadBox({ onImageSelect }) {
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleUpload = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="upload-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-[280px] border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-in-out bg-slate-900/50 backdrop-blur-md group relative overflow-hidden
              ${isDragActive ? "border-emerald-500 bg-emerald-500/10 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]" : "border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800/80"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="flex flex-col items-center justify-center p-6 relative z-10 text-center">
              <div className={`p-5 rounded-2xl mb-4 transition-all duration-500 ${isDragActive ? "bg-emerald-500 font text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-slate-800 text-emerald-400 group-hover:bg-slate-700 group-hover:-translate-y-1 group-hover:shadow-lg"}`}>
                <UploadCloud size={44} className={`transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`} />
              </div>
              <p className="mb-2 text-base text-slate-300">
                <span className="font-bold text-emerald-400">Click to browse</span> or drag & drop
              </p>
              <p className="text-sm text-slate-500 font-medium tracking-wide">SVG, PNG, JPG or WEBP (Max 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </motion.label>
        ) : (
          <motion.div
            key="preview-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-[280px]"
          >
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 backdrop-blur-[2px]">
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold text-sm flex items-center space-x-2 transition-all shadow-xl">
                <ImageIcon size={18} />
                <span>Upload New Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
            <div className="absolute top-4 right-4 bg-[#0f172a]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">File Ready</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}