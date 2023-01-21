import React from 'react';
import './App.css';
import Home from './pages/Home';
import InteractionDetail from './pages/InteractionDetail';
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interactions" element={<InteractionDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
