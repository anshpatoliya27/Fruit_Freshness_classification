import { useState } from "react";
import { UploadCloud, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadBox({ onImageSelect, loading }) {
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
       handleFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    if(e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`w-full relative transition-all duration-300 ${loading ? "opacity-60 scale-[0.98] pointer-events-none" : "opacity-100 scale-100"}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop Target Overlay when dragging over an existing preview */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             className="absolute inset-0 z-50 bg-fruit-primary/10 backdrop-blur-sm border-2 border-fruit-primary rounded-[2rem] flex flex-col items-center justify-center shadow-inner"
          >
             <div className="bg-white text-fruit-primary font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)] scale-110 animate-pulse">
                Drop to Replace
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="upload-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex flex-col items-center justify-center w-full h-[360px] border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300 bg-white
              ${isDragActive ? "border-fruit-primary bg-fruit-primaryLight/30 scale-[1.02] shadow-[0_0_40px_rgba(34,197,94,0.1)]" : "border-gray-200 shadow-sm hover:border-fruit-primary/50 hover:bg-fruit-bg hover:shadow-md"}`}
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className={`p-4 rounded-[1.5rem] mb-6 transition-all duration-300 ${isDragActive ? "bg-fruit-primary text-white shadow-lg shadow-fruit-primary/30 -translate-y-2" : "bg-fruit-bg text-fruit-primary shadow-sm border border-gray-100 group-hover:-translate-y-1"}`}>
                <UploadCloud size={44} strokeWidth={2.5} />
              </div>
              <p className="mb-2 text-xl text-fruit-text font-extrabold tracking-tight">
                Drop your produce photo
              </p>
              <p className="text-sm text-fruit-textMuted font-medium tracking-wide">or click to browse from your device</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </motion.label>
        ) : (
          <motion.div
            key="preview-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full relative group rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] h-[360px] bg-gray-100"
          >
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fruit-dark/60 via-fruit-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <label className="cursor-pointer bg-white/95 text-fruit-text px-8 py-3.5 rounded-full font-extrabold text-[13px] uppercase tracking-wider flex items-center space-x-2 shadow-2xl hover:scale-105 hover:bg-white transition-all ring-1 ring-black/5">
                <ImageIcon size={18} strokeWidth={2.5} className="text-fruit-primary" />
                <span>Replace Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}