import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultCard from "../components/Resultcard";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handlePredict = async () => {
    if (!image) {
      alert("Upload image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-2">Fruit Freshness AI 🍃</h1>

      <UploadBox setImage={setImage} />

      <button
        onClick={handlePredict}
        className="mt-4 px-6 py-2 bg-[#6BCB77] text-white rounded-xl"
      >
        Predict
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}