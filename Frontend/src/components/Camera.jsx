import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera as CameraIcon } from "lucide-react";
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

  // Rendered as User Bubble
  return (
    <div className="w-full flex justify-end px-2 md:px-0">
        <div className="flex items-start max-w-[85%] sm:max-w-[75%] flex-row-reverse">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full shadow-sm border border-gray-200 ml-4 bg-white text-gray-500">
               <CameraIcon size={16} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col min-w-0">
                <div className="text-sm font-semibold tracking-wide text-gray-800 mb-1.5 text-right">
                  System Camera
                </div>

                <div className="w-[260px] sm:w-[300px] h-[340px] relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                  {error ? (
                    <div className="flex flex-col items-center text-center p-6 text-red-600">
                      <AlertCircle size={28} className="mb-2" />
                      <p className="text-xs font-semibold">{error}</p>
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
                      
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full border border-gray-200 shadow-sm flex items-center space-x-1.5 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Live</span>
                      </div>
                    </>
                  )}
                </div>
            </div>
        </div>
    </div>
  );
}
