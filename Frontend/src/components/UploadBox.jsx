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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200 bg-gray-50/50 
              ${isDragActive ? "border-black bg-gray-100" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
          >
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? "bg-black text-white" : "bg-white text-gray-700 shadow-sm border border-gray-200"}`}>
                <UploadCloud size={32} />
              </div>
              <p className="mb-1 text-base text-gray-800 font-medium">
                Drag & drop your image here
              </p>
              <p className="text-sm text-gray-500">or click to browse from device</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </motion.label>
        ) : (
          <motion.div
            key="preview-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full relative group rounded-2xl overflow-hidden border border-gray-200 h-[300px] bg-gray-100"
          >
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
              <label className="cursor-pointer bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform">
                <ImageIcon size={18} />
                <span>Replace Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center space-x-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold text-gray-800">Uploaded</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}