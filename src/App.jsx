import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import District from "./pages/District";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="district/" element={<District />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
