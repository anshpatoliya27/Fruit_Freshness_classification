import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera as CameraIcon, Focus } from "lucide-react";
import { motion } from "framer-motion";

export default function Camera({ setResult, setConfidence }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let interval = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (isMounted) setError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    const captureAndPredict = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");

        try {
          const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.result && isMounted) {
            setResult(data.result);
            if (data.confidence !== undefined) {
                setConfidence(data.confidence);
            }
          }
        } catch (err) {
          console.error("Error during prediction:", err);
        }
      }, "image/jpeg", 0.8);
    };

    interval = setInterval(captureAndPredict, 2500);

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setResult, setConfidence]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0B1120] h-[280px] flex flex-col items-center justify-center ring-1 ring-white/5"
    >
      {error ? (
        <div className="text-rose-400 flex flex-col items-center text-center p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20">
          <AlertCircle size={44} className="mb-3 opacity-80" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-90 transition-opacity duration-700"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg flex items-center space-x-2 z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">REC</span>
          </div>

          <div className="absolute inset-x-8 inset-y-8 border-2 border-white/20 rounded-2xl pointer-events-none group-hover:border-emerald-500/40 transition-colors duration-500 flex items-center justify-center">
             <Focus className="w-12 h-12 text-white/20 group-hover:text-emerald-500/40 transition-all duration-500 transform group-hover:scale-110" strokeWidth={1} />
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
             <div className="bg-slate-900/80 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center space-x-3 shadow-2xl">
                <CameraIcon size={16} className="text-emerald-400" />
                <span className="text-slate-200 text-[11px] font-bold tracking-wider uppercase">Auto-Scanning</span>
             </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
