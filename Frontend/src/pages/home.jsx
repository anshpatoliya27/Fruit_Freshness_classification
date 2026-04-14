import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import InputArea from "../components/InputArea";
import ChatItem from "../components/ChatItem";
import Camera from "../components/Camera";
import { Menu, X } from "lucide-react"; 

export default function Home() {
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", type: "welcome" }]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading, isCameraActive]);

  const selectHistory = (id) => {
    setActiveId(id);
    setIsCameraActive(false);
    setSidebarOpen(false);
    const item = history.find(h => h.id === id);
    if(item) {
      setMessages([
        { role: "user", type: "image", content: item.image },
        { role: "assistant", type: "result", content: { result: item.result, confidence: item.confidence } }
      ]);
    }
  };

  const handleNew = () => {
    setActiveId(null);
    setIsCameraActive(false);
    setSidebarOpen(false);
    setMessages([{ role: "assistant", type: "welcome" }]);
  };

  const processImage = async (file) => {
    setIsCameraActive(false);
    const previewUrl = URL.createObjectURL(file);
    
    // Create new temporary session identifier
    const tempId = Date.now();
    setActiveId(tempId);
    
    setMessages([
      { role: "user", type: "image", content: previewUrl }
    ]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "result", content: { result: data.result, confidence: data.confidence } }
      ]);

      // Add to history
      setHistory(prev => [{
        id: tempId,
        image: previewUrl,
        result: data.result,
        confidence: data.confidence,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "error", content: "Failed to connect to analysis server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLivePrediction = (data) => {
    setMessages([{ role: "assistant", type: "result", content: { result: data.result, confidence: data.confidence, live: true } }]);
  };

  return (
    <div className="flex w-full h-full relative">
      <Sidebar history={history} activeId={activeId} onSelect={selectHistory} onNew={handleNew} />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[260px] h-full bg-white flex flex-col shadow-xl">
             <Sidebar history={history} activeId={activeId} onSelect={selectHistory} onNew={handleNew} />
             <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-[-48px] bg-white text-black p-2 rounded-lg shadow-lg">
                <X size={24} />
             </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full bg-white md:bg-[#F9FAFB] relative transition-all min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm z-10 sticky top-0">
           <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} />
           </button>
           <span className="font-semibold text-gray-800">FreshSense</span>
           <div className="w-10"></div>
        </div>
        
        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto w-full" ref={scrollRef}>
          <div className="max-w-3xl mx-auto flex flex-col space-y-8 pb-10 pt-8 px-4 sm:px-6">
            {!isCameraActive && messages.map((msg, idx) => (
              <ChatItem key={idx} message={msg} />
            ))}
            
            {loading && <ChatItem message={{ role: "assistant", type: "loading" }} />}
            
            {isCameraActive && (
               <>
                 <Camera onPrediction={handleLivePrediction} />
                 {messages.map((msg, idx) => (
                    msg.type === "result" && <ChatItem key={idx} message={msg} />
                 ))}
               </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full bg-gradient-to-t from-white via-white/80 to-transparent pt-6 sticky bottom-0">
          <InputArea 
              onUpload={processImage} 
              isCameraActive={isCameraActive}
              onCameraToggle={() => {
                  setIsCameraActive(!isCameraActive);
                  if (!isCameraActive) setMessages([]);
                  else handleNew(); 
              }} 
          />
        </div>
      </div>
    </div>
  );
}