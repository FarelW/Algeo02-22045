import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Home from "./Home";
import Developers from "./Developers";
import Technology from "./Technology";
import Application from "./Application";

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/application" element={<Application />} />
        </Routes>
    </Router>
  );
}

export default App;
