import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, UploadCloud, Leaf, History } from "lucide-react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";
import Camera from "../components/Camera";

export default function Home() {
  const [history, setHistory] = useState([]);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("upload");

  const processPrediction = async (file) => {
    setImage(file);
    setLoading(true);
    setResult("");
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", file);

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

      setHistory(prev => [{
        id: Date.now(),
        image: URL.createObjectURL(file),
        result: data.result,
        confidence: data.confidence,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }, ...prev]);

    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleLivePrediction = (data) => {
    setResult(data.result);
    setConfidence(data.confidence);
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col selection:bg-fruit-primary selection:text-white">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200/60">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="bg-fruit-primary text-white p-2.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(34,197,94,0.5)] group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
             <Leaf size={24} strokeWidth={2.5} />
          </div>
          {/* Logo Request: light green and white combinations */}
          <div className="bg-fruit-dark px-3.5 py-1.5 rounded-xl shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] ring-1 ring-white/10">
            <span className="text-2xl font-display font-black tracking-tight">
              <span className="text-fruit-primary">Fresh</span>
              <span className="text-white">Sense</span>
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
           <span className="text-[13px] font-bold uppercase tracking-widest px-5 py-2.5 bg-white rounded-full border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-fruit-textMuted">
             Intelligence Workspace
           </span>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column: Analysis Console (span 8) */}
        <div className="xl:col-span-8 flex flex-col">
           <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-white overflow-hidden flex flex-col w-full h-full p-2 sm:p-4 ring-1 ring-black/5">
              
              {/* Toggler */}
              <div className="bg-gray-100/80 p-1.5 rounded-[1.25rem] flex relative w-full sm:max-w-sm mx-auto mb-8 mt-5 shadow-inner border border-black/5">
                 <button 
                  onClick={() => {setMode("upload"); setResult(""); setImage(null);}}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 ${mode === 'upload' ? 'bg-white text-fruit-text shadow-[0_2px_15px_-4px_rgba(0,0,0,0.1)]' : 'text-fruit-textMuted hover:text-fruit-text'}`}
                 >
                    <UploadCloud size={18} strokeWidth={2.5}/>
                    <span>Drop Photo</span>
                 </button>
                 <button 
                  onClick={() => {setMode("camera"); setResult(""); setImage(null);}}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 ${mode === 'camera' ? 'bg-white text-fruit-text shadow-[0_2px_15px_-4px_rgba(0,0,0,0.1)]' : 'text-fruit-textMuted hover:text-fruit-text'}`}
                 >
                    <CameraIcon size={18} strokeWidth={2.5}/>
                    <span>Live Lens</span>
                 </button>
              </div>

              {/* Console Body */}
              <div className="flex-1 flex flex-col items-center px-4 md:px-8 pb-10">
                 <div className="w-full max-w-2xl relative">
                    <AnimatePresence mode="wait">
                       {mode === "upload" ? (
                          <motion.div key="up" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                             <UploadBox onImageSelect={processPrediction} loading={loading} />
                          </motion.div>
                       ) : (
                          <motion.div key="cam" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                             <Camera onPrediction={handleLivePrediction} />
                          </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Result Placement */}
                    <AnimatePresence>
                       {(result || loading) && (
                          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1, marginTop: 24 }} exit={{ opacity: 0, scale: 0.95, height: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-full origin-top">
                             {loading ? (
                                <div className="w-full bg-fruit-primaryLight/50 border border-fruit-primary/20 rounded-[2rem] p-8 flex flex-col items-center justify-center space-y-4 shadow-[0_8px_30px_rgba(34,197,94,0.1)] backdrop-blur-md">
                                   <div className="w-12 h-12 border-[4px] border-fruit-primary/30 border-t-fruit-primary rounded-full animate-spin"></div>
                                   <p className="font-extrabold tracking-widest uppercase text-fruit-primary text-xs animate-pulse">Running Neural Engine</p>
                                </div>
                             ) : (
                                <ResultCard result={result} confidence={confidence} live={mode === 'camera'} />
                             )}
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>

           </div>
        </div>

        {/* Right Column: History Sidebar (span 4) */}
        <div className="xl:col-span-4 flex flex-col">
           <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] border border-white flex flex-col h-full overflow-hidden ring-1 ring-black/5">
              <div className="p-7 border-b border-gray-100/80 bg-gradient-to-b from-white to-transparent flex justify-between items-center relative z-10 shadow-sm">
                 <h2 className="font-display font-black text-xl text-fruit-text flex items-center space-x-2.5">
                    <History size={22} className="text-fruit-primary" strokeWidth={2.5}/>
                    <span>Analysis Log</span>
                 </h2>
                 <span className="bg-gray-100 border border-gray-200/60 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-fruit-textMuted">{history.length} Saved</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar relative z-0">
                 {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-5 opacity-60">
                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-inner border border-gray-200/50">
                          <History size={32} className="text-gray-400" />
                       </div>
                       <div>
                          <p className="text-base font-bold text-gray-800">No logs generated</p>
                          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">Predictions from this session will be preserved here securely.</p>
                       </div>
                    </div>
                 ) : history.map((item, index) => {
                     const isFresh = item.result?.toLowerCase().includes("fresh");
                     return (
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} key={item.id} className="p-3 bg-white border border-gray-100 rounded-[1.25rem] flex items-center space-x-4 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-default group hover:-translate-y-0.5 ring-1 ring-black/5">
                            <div className="w-16 h-16 rounded-[1rem] bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 relative">
                               <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                               <p className="text-sm font-black text-fruit-text truncate mb-1">{item.result}</p>
                               <div className="flex items-center space-x-2.5">
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest ${isFresh ? 'bg-fruit-primaryLight border border-fruit-primary/20 text-green-700' : 'bg-fruit-redLight border border-fruit-red/20 text-red-700'}`}>
                                     {(item.confidence || 0).toFixed(0)}% Conf
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400">{item.timestamp}</span>
                               </div>
                            </div>
                         </motion.div>
                     )
                 })}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}