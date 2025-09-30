import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./ui_components/AppLayout";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ui_components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import { getUsername } from "./services/apiBlog";
import { useQuery } from "@tanstack/react-query";
import NotFoundPage from "./pages/NotFoundPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem("access");
    return !!token;
  });

  const { data } = useQuery({
    queryKey: ["username"],
    queryFn: getUsername,
    enabled: isAuthenticated,
  });

  useEffect(
    function () {
      if (data) {
        setUsername(data.username);
        setIsAuthenticated(true);
      }
    },
    [data]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("access");
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <LoginPage 
              setIsAuthenticated={setIsAuthenticated} 
              setUsername={setUsername} 
            />
          } 
        />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AppLayout
                isAuthenticated={isAuthenticated}
                username={username}
                setUsername={setUsername}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="profile/:username" element={<ProfilePage authUsername={username} />} />
          <Route path="blogs/:slug" element={<DetailPage username={username} isAuthenticated={isAuthenticated} />} />
          <Route path="create" element={<CreatePostPage isAuthenticated={isAuthenticated} />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="*" element={<NotFoundPage  isAuthenticated={isAuthenticated} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
