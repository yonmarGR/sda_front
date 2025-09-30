import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Navigate, useLocation } from "react-router-dom";
import api from "@/api";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthorized(false);
      return;
    }
    
    authorize().catch(() => setIsAuthorized(false));
  }, [isAuthenticated]);

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      setIsAuthorized(false);
      return;
    }

    try {
      const response = await api.post("token_refresh/", { refresh });
      if (response.status === 200) {
        localStorage.setItem("access", response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      setIsAuthorized(false);
      console.log(err);
    }
  }

  async function authorize() {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
  
    try {
      const decodedToken = jwtDecode(token);
      const tokenExpired = decodedToken.exp < Date.now() / 1000;
  
      if (tokenExpired) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
        // If this is a refresh, redirect to /app
        if (location.state?.fromRefresh) {
          navigate('/app', { replace: true });
        }
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      setIsAuthorized(false);
    }
  }

  if (isAuthorized === null) {
    return <Spinner />;
  }

  return isAuthorized ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
