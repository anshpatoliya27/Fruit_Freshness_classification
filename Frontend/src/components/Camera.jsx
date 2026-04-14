import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full relative rounded-2xl overflow-hidden bg-gray-100 h-[300px] flex flex-col items-center justify-center border border-gray-200"
    >
      {error ? (
        <div className="flex flex-col items-center text-center p-6 text-red-600">
          <AlertCircle size={32} className="mb-2" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center space-x-2 z-10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-800 uppercase tracking-widest">Live</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
