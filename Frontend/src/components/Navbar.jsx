import { Leaf, Info } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 border-b border-gray-200 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="p-1.5 bg-[#6BCB77] rounded-lg">
            <Leaf className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-[#6BCB77]">Fresh</span><span className="text-black">Sense</span>
          </span>
        </div>

        <div className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
          <Info className="w-5 h-5" />
        </div>
      </div>
    </nav>
  );
}
