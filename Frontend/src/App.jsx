import React from 'react';
import Home from './pages/home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="relative min-h-screen bg-[#0B1120] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none animate-blob"></div>
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-blob animation-delay-4000"></div>
      
      <Navbar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col min-h-screen">
        <Home />
      </main>
    </div>
  );
}

export default App;