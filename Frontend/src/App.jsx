import React from 'react';
import Home from './pages/home';

function App() {
  return (
    <div className="min-h-screen bg-fruit-bg text-fruit-text font-sans selection:bg-fruit-primary selection:text-white overflow-y-auto w-full">
      <Home />
    </div>
  );
}

export default App;