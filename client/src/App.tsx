import "./App.css";
import Login from "@/components/login/page";
import HomePage from "@/components/homepage/page";
import BlogDetailPage from "@/components/article/page";
import { Routes, Route } from "react-router-dom";
import GeneralLayout from "@/layouts/generalLayout";

function App() {
  return (
    <Routes>
      {/* GeneralLayout is now a route element */}
      <Route path="/" element={<GeneralLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="home" element={<HomePage />} />
        <Route path="article" element={<BlogDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
