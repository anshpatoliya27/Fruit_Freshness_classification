import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera as CameraIcon } from "lucide-react";
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
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current && isMounted) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (isMounted) setError("Could not access the camera. Please check permissions.");
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
      className="w-full relative group rounded-2xl overflow-hidden shadow-md border-4 border-white bg-black h-64 flex flex-col items-center justify-center"
    >
      {error ? (
        <div className="text-red-400 flex flex-col items-center text-center p-4">
          <AlertCircle size={40} className="mb-2" />
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
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider">LIVE RECORDING</span>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
             <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2">
                <CameraIcon size={16} className="text-white/80" />
                <span className="text-white/90 text-xs font-medium">Scanning perfectly framing fruits...</span>
             </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
