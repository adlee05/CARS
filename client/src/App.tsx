import "./App.css";
import Login from "@/components/login/page";
import HomePage from "@/components/homepage/page";
import EmailConfirmation from "@/components/auth/EmailConfirmation";
import BlogDetailPage from "@/components/article/page";
import { Routes, Route } from "react-router-dom";
import GeneralLayout from "@/layouts/generalLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import Page from "@/components/profile/page";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/auth/email-confirmation" element={<EmailConfirmation />} />
      {/* GeneralLayout is now a route element */}
      <Route path="/" element={<GeneralLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="article/:id"
          element={
            <ProtectedRoute>
              <BlogDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
