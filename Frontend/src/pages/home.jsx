import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, Cpu, Zap } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";
import Camera from "../components/Camera";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("camera");

  const handlePredict = async (fileParam = null) => {
    const targetImage = fileParam instanceof File ? fileParam : image;
    
    if (!targetImage) return;

    setLoading(true);
    setResult("");
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", targetImage);

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

  const handleImageDropped = (file) => {
    setImage(file);
    handlePredict(file);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-12 lg:gap-24 items-center justify-center py-12">
      
      {/* Left Column: Minimalist Typography */}
      <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-gray-900">
          Determine produce freshness instantly.
        </h1>
        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
          Powered by state-of-the-art vision models. Drop an image or open your camera to verify quality in milliseconds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
            <div className="flex items-center space-x-3 text-gray-700">
                <Scan className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Auto-focusing Camera</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
                <Zap className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Sub-second Inference</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
                <Cpu className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">TensorFlow Accelerated</span>
            </div>
        </div>
      </div>

      {/* Right Column: Clean White Card Component */}
      <div className="w-full md:w-1/2 max-w-md">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200">
          
          {/* Segmented Control */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setMode("camera"); setResult(""); setConfidence(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "camera" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => { setMode("upload"); setResult(""); setConfidence(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "upload" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
               Upload
            </button>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
                {mode === "upload" ? (
                    <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <UploadBox onImageSelect={handleImageDropped} />
                    </motion.div>
                ) : (
                    <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Camera setResult={setResult} setConfidence={setConfidence} />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {(loading || result) && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                {loading ? (
                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center space-x-3">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        <span className="text-sm font-medium text-gray-500">Processing...</span>
                    </div>
                ) : (
                    <>
                      {result && <ResultCard result={result} confidence={confidence} />}
                    </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}