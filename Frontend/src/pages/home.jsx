import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ScanLine, ShieldCheck, Zap } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";
import Camera from "../components/Camera";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("camera"); // Default to live camera as it's cooler

  const handlePredict = async (fileParam = null) => {
    const targetImage = fileParam instanceof File ? fileParam : image;
    
    if (!targetImage) {
      alert("Please upload an image first.");
      return;
    }

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

  const features = [
    { icon: <ScanLine className="w-5 h-5 text-emerald-400" />, title: "Real-time Scan", desc: "Live camera inference with millisecond latency." },
    { icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, title: "High Accuracy", desc: "State-of-the-art CNN models ensure precision." },
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: "Instant Insights", desc: "Know instantly if produce is fresh or rotten." },
  ];

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center py-10 lg:py-16">
      
      {/* Left Column: Typography & Info */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-5/12 flex flex-col justify-center space-y-8"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold w-fit">
          <Sparkles className="w-4 h-4" />
          <span>V2.0 AI Engine Active</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight">
            Analyze <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500">
              Produce Quality
            </span><br className="hidden sm:block" />
            in Seconds.
          </h1>
          <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed">
            Harness the power of deep learning to instantly determine the freshness of fruits. Prevent waste and ensure absolute quality with enterprise-grade accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-8">
            {features.map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 shadow-inner">
                        {feature.icon}
                    </div>
                    <div>
                        <h4 className="text-slate-200 font-bold text-sm">{feature.title}</h4>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{feature.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </motion.div>

      {/* Right Column: Interaction Card */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full lg:w-7/12 max-w-xl lg:max-w-none"
      >
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500"></div>
          
          {/* Tab Toggle */}
          <div className="flex w-full mb-6 bg-slate-800/50 p-1.5 rounded-xl border border-white/5 relative z-10">
            <button
              onClick={() => { setMode("camera"); setResult(""); setConfidence(null); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                mode === "camera" ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Live Analysis</span>
            </button>
            <button
              onClick={() => { setMode("upload"); setResult(""); setConfidence(null); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                mode === "upload" ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
               <span>Upload Image</span>
            </button>
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
                {mode === "upload" ? (
                    <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <UploadBox onImageSelect={handleImageDropped} />
                        
                        <AnimatePresence>
                          {(image || loading) && (
                              <motion.button
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  whileHover={!loading ? { scale: 1.02 } : {}}
                                  whileTap={!loading ? { scale: 0.98 } : {}}
                                  onClick={() => handlePredict(image)}
                                  disabled={loading}
                                  className={`w-full py-4 rounded-2xl text-lg font-bold transition-all text-white relative overflow-hidden ${
                                      loading ? "bg-emerald-500/80 cursor-wait" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                                  }`}
                              >
                                  {loading ? (
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing Sequence...</span>
                                    </div>
                                  ) : (
                                    "Re-Analyze Condition"
                                  )}
                              </motion.button>
                           )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div key="camera" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Camera setResult={setResult} setConfidence={setConfidence} />
                        <div className="mt-5 flex items-center justify-center space-x-2 text-sm text-emerald-400/80 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>System active. Position produce within frame.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10"
              >
                <ResultCard result={result} confidence={confidence} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}