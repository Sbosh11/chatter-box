import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-bold">Welcome to the App</h1>
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-bold">About Page</h1>
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-bold">Contact Page</h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
