import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Home from "./Home";
import Application from "./Application";

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Home />} />
          <Route path="/technology" element={<Home />} />
          <Route path="/developers" element={<Home />} />
          <Route path="/application" element={<Application />} />
        </Routes>
    </Router>
  );
}

export default App;
