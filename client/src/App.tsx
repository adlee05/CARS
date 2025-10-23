import "./App.css";
import Login from "@/components/login/page";
import HomePage from "@/components/homepage/page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GeneralLayout from "@/layouts/generalLayout";

function App() {
  return (
      <Routes>
        {/* GeneralLayout is now a route element */}
        <Route path="/" element={<GeneralLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="home" element={<HomePage />} />
        </Route>
      </Routes>
  );
}

export default App;
