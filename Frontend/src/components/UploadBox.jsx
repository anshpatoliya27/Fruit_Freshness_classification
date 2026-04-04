import { useState } from "react";
import { UploadCloud, CheckCircle2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadBox({ setImage }) {
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out bg-white/50 backdrop-blur-sm group
              ${isDragActive ? "border-emerald-500 bg-emerald-50/80 shadow-inner" : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-500"}`}>
                <UploadCloud size={40} className={`transition-transform duration-300 ${isDragActive ? "scale-110 translate-y-1" : ""}`} />
              </div>
              <p className="mb-2 text-sm text-gray-600 font-medium">
                <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 font-medium">SVG, PNG, JPG or WEBP</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </motion.label>
        ) : (
          <motion.div
            key="preview-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full relative group rounded-2xl overflow-hidden shadow-md border-4 border-white"
          >
            <img
              src={preview}
              alt="preview"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <label className="cursor-pointer bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center space-x-2 transition-all">
                <ImageIcon size={16} />
                <span>Change Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              </label>
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1.5 hidden group-hover:flex">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-gray-700">Selected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}