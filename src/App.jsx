import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Waether from "./pages/weather";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path="dist/:distName" element={<Waether />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
