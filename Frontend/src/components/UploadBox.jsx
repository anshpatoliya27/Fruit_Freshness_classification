import { useState } from "react";

export default function UploadBox({ setImage }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
      
      <input type="file" onChange={handleUpload} className="mb-4" />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-48 h-48 object-cover mx-auto rounded-xl"
        />
      )}
    </div>
  );
}