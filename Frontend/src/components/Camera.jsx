import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Camera({ onPrediction }) {
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
        if (isMounted) setError("Camera access denied.");
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
          if (data.result && isMounted && onPrediction) {
             onPrediction(data);
          }
        } catch (err) {
          console.error("Error during prediction:", err);
        }
      }, "image/jpeg", 0.6);
    };

    interval = setInterval(captureAndPredict, 2500);

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onPrediction]);

  return (
    <div className="w-full h-[360px] relative rounded-[2rem] overflow-hidden bg-fruit-dark border border-gray-200 shadow-sm flex flex-col justify-center items-center">
      {error ? (
        <div className="flex flex-col items-center text-center p-8 bg-fruit-redLight/10 rounded-2xl">
          <AlertCircle size={36} className="mb-3 text-fruit-red" />
          <p className="text-sm font-semibold text-fruit-red">{error}</p>
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
          
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 shadow-md flex items-center space-x-2 z-10">
            <div className="w-2 h-2 rounded-full bg-fruit-red shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
            <span className="text-[11px] font-bold text-fruit-text uppercase tracking-widest">Live Scan</span>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 flex items-center space-x-2 rounded-full border border-white/10">
                  <span className="text-xs font-medium text-white">Focus fruit within frame</span>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
