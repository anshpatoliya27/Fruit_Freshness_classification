import React from 'react';
import Home from './pages/home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />
      <main className="pt-28 pb-12 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto flex flex-col min-h-screen">
        <Home />
      </main>
    </div>
  );
}

export default App;