import "./App.css";
import Login from "@/components/login/page";
import HomePage from "@/components/homepage/page";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
