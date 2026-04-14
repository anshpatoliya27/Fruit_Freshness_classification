import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";
import Camera from "../components/Camera";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");

  const handlePredict = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult("");
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
      if (data.confidence !== undefined) {
        setConfidence(data.confidence);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />

        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner"
          >
            <Leaf size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Fruit <span className="text-emerald-600">Freshness</span> AI
          </h1>
          <p className="text-gray-500 mt-2 font-medium bg-emerald-50 inline-block px-4 py-1 rounded-full text-sm shadow-sm border border-emerald-100">
            Instantly detect if your fruit is fresh or rotten
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex w-full mb-6 bg-gray-100/80 rounded-xl p-1.5 shadow-inner">
          <button
            onClick={() => {
                setMode("upload");
                setResult("");
                setConfidence(null);
            }}
            className={`flex-1 py-2.5 flex items-center justify-center space-x-2 rounded-lg text-sm font-bold transition-all ${
              mode === "upload" ? "bg-white text-emerald-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => {
                setMode("camera");
                setResult("");
                setConfidence(null);
            }}
            className={`flex-1 py-2.5 flex items-center justify-center space-x-2 rounded-lg text-sm font-bold transition-all ${
              mode === "camera" ? "bg-white text-emerald-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Live Camera</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
            {mode === "upload" ? (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <UploadBox setImage={setImage} />
                    
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePredict}
                        disabled={!image || loading}
                        className={`w-full mt-6 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg text-white ${!image ? "bg-gray-300 cursor-not-allowed shadow-none" :
                            loading ? "bg-emerald-400 cursor-wait" : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        }`}
                    >
                        {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Analyzing...</span>
                        </div>
                        ) : (
                        "Analyze Fruit"
                        )}
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Camera setResult={setResult} setConfidence={setConfidence} />
                    <div className="mt-4 text-center text-sm text-gray-500 font-medium">
                        Position fruit in front of the camera. Auto-capturing every 2 seconds.
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0, mt: 0 }}
              animate={{ opacity: 1, height: "auto", mt: 24 }}
              exit={{ opacity: 0, height: 0, mt: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultCard result={result} confidence={confidence} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}