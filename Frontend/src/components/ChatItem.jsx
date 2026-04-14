import { Leaf, User } from "lucide-react";
import Resultcard from "./Resultcard";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatItem({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} px-2 md:px-0`}>
      <div className={`flex items-start max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full shadow-sm border border-gray-200 ${isUser ? "ml-4 bg-white text-gray-500" : "mr-4 bg-[#6BCB77] text-white"}`}>
          {isUser ? <User size={16} strokeWidth={2.5} /> : <Leaf size={16} strokeWidth={2.5} />}
        </div>
        
        {/* Content */}
        <div className="flex flex-col min-w-0">
          <div className={`text-sm font-semibold tracking-wide text-gray-800 mb-1.5 ${isUser ? "text-right" : "text-left"}`}>
             {isUser ? "You" : "FreshSense AI"}
          </div>

          <div className="transition-all">
            {message.type === "welcome" && (
                <div className="text-gray-700 leading-relaxed text-[15px]">
                  Upload an image of a fruit or activate your device camera, and I will analyze its freshness instantly.
                </div>
            )}

            {message.type === "image" && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm max-w-[280px] bg-white p-1">
                  <img src={message.content} className="w-full h-auto rounded-xl object-contain" />
                </div>
            )}

            {message.type === "result" && (
                <Resultcard result={message.content.result} confidence={message.content.confidence} live={message.content.live} />
            )}

            {message.type === "loading" && (
                <div className="flex items-center space-x-3 text-gray-500 py-1">
                   <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   </div>
                </div>
            )}
            
            {message.type === "error" && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm">
                   {message.content}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
