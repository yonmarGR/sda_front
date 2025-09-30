import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon, ExclamationTriangleIcon, ArrowRightIcon, HomeIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import api from "@/api";
import { jwtDecode } from "jwt-decode";

const NotFoundPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const redirectingRef = useRef(false);
  const countdownRef = useRef(null);

  // Clear authentication and tokens
  const clearSession = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    if (setIsAuthenticated) setIsAuthenticated(false);
  };

  // Validate tokens if authenticated
  const validateTokens = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");
      
      if (!accessToken || !refreshToken) {
        throw new Error("No tokens found");
      }

      // Check access token expiration
      const decoded = jwtDecode(accessToken);
      if (decoded.exp < Date.now() / 1000) {
        // Access token expired, try to refresh
        const response = await api.post("token_refresh/", { refresh: refreshToken });
        if (response.status === 200) {
          localStorage.setItem("access", response.data.access);
          return true;
        }
        throw new Error("Token refresh failed");
      }
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      clearSession();
      return false;
    }
  };

  // Handle manual navigation
  const handleManualNavigate = async (path) => {
    if (redirectingRef.current) return;
    
    redirectingRef.current = true;
    clearInterval(countdownRef.current);

    if (isAuthenticated) {
      setIsValidating(true);
      try {
        const isValid = await validateTokens();
        if (!isValid) {
          toast({
            title: "Session Expired",
            description: "Please sign in again",
            variant: "destructive",
          });
          path = "/";
        }
      } catch (error) {
        path = "/";
      }
    }

    navigate(path, { replace: true });
  };

  // Countdown effect
  useEffect(() => {
    if (countdown <= 0) return;

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, []);

  // Auto-redirect effect
  useEffect(() => {
    if (countdown > 0 || redirectingRef.current) return;

    const autoRedirect = async () => {
      redirectingRef.current = true;
      clearInterval(countdownRef.current);

      try {
        if (isAuthenticated) {
          setIsValidating(true);
          const isValid = await validateTokens();
          if (isValid) {
            navigate("/app", { replace: true });
          } else {
            toast({
              title: "Session Expired",
              description: "Please sign in again",
              variant: "destructive",
            });
            navigate("/", { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        navigate("/", { replace: true });
      }
    };

    autoRedirect();
  }, [countdown, isAuthenticated, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center rounded-lg bg-destructive/10 p-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
          <p className="text-muted-foreground">
            La página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        
        <div className="flex flex-col gap-3"> 
          <Button 
            onClick={() => handleManualNavigate(isAuthenticated ? "/app" : "/")}
            //variant="primary" 
            size="lg"
            className="w-full bg-[#4B6BFB]"
            disabled={isValidating}
          >
            {isAuthenticated ? (
              <>
                <RocketIcon className="mr-2 h-4 w-4" />
                {isValidating ? "Validando datos..." : "Ir al panel principal"}
              </>
            ) : (
              <>
                <HomeIcon className="mr-2 h-4 w-4" />
                Pagina de inicio
              </>
            )}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
          
          {isAuthenticated && (
            <Button 
              onClick={() => {
                clearSession();
                navigate("/", { replace: true });
              }}
              variant="outline" 
              size="lg"
              className="w-full text-destructive hover:text-destructive"
            >
              Cerrar sesión
            </Button>
          )}
          
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            {isValidating ? (
              "Validando datos..."
            ) : (
              `Redireccionando en ${countdown} segundos...`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;