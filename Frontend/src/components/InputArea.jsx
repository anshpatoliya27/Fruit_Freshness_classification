import { Upload, Camera as CameraIcon, X } from "lucide-react";

export default function InputArea({ onUpload, onCameraToggle, isCameraActive }) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-6 pt-2 shrink-0">
      <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] px-2 py-2 focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
        
        <label className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors" title="Upload Image">
          <Upload size={22} strokeWidth={2}/>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload(e.target.files[0]);
              }
              // Reset so same file can be uploaded consecutively
              e.target.value = null;
          }} />
        </label>
        
        <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
        
        <button 
          onClick={onCameraToggle}
          title={isCameraActive ? "Close Camera" : "Open Live Camera"}
          className={`p-2.5 rounded-xl transition-colors ${isCameraActive ? 'bg-[#FF6B6B]/15 text-[#FF6B6B]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          {isCameraActive ? <X size={22} strokeWidth={2.5}/> : <CameraIcon size={22} strokeWidth={2}/>}
        </button>
        
        <div className="flex-1 flex items-center justify-start pointer-events-none px-4">
            <span className="text-[15px] font-medium text-gray-400 select-none">
              {isCameraActive ? "Live camera active..." : "Upload an image or enable camera to analyze..."}
            </span>
        </div>

      </div>
      <div className="text-center mt-3 text-xs text-gray-400 font-medium">
        AI models can make mistakes. Consider checking fresh produce independently.
      </div>
    </div>
  );
}
