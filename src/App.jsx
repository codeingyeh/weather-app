import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import District from "./pages/District";

function App() {
  const [subscript, setSubscript] = useLocalStorage(
    [],
    "subscriptionDistricts"
  );

  function handleSubscriptAdd(dist) {
    setSubscript((data) => [...data, dist]);
  }

  function handleSubscriptDelete(dist) {
    setSubscript((data) => data.filter((el) => el.distName === dist.distName));
  }

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            index
            element={
              <Home
                subscriptDist={subscript}
                onSubscriptDelete={handleSubscriptDelete}
              />
            }
          />
          <Route
            path="district/"
            element={
              <District
                subscriptDist={subscript}
                onSubscriptAdd={handleSubscriptAdd}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
