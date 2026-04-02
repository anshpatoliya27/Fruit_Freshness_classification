import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
      
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Fruit Freshness AI 🍃
      </h1>
      <p className="text-gray-500 mb-6">
        Check if your fruit is fresh or rotten
      </p>

      {/* Upload */}
      <UploadBox setImage={setImage} />

      {/* Predict Button */}
      <button
        onClick={() => setResult("Fresh Apple 🍎")} // TEMP (backend later)
        className="mt-4 px-6 py-2 bg-[#6BCB77] text-white rounded-xl hover:scale-105 transition"
      >
        Predict
      </button>

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
}