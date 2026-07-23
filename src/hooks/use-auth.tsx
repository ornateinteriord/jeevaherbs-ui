import { useState, useEffect } from "react";
import TokenService from "../api/token/tokenService";

const useAuth = () => {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const urlToken = urlParams?.get("token");
  if (urlToken) {
    TokenService.setToken(urlToken, true);
  }

  const [userRole, setUserRole] = useState<string | null>(TokenService.getRole());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!TokenService.getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      const token = TokenService.getToken();
      setUserRole(TokenService.getRole());
      setIsLoggedIn(!!token);
    };

    // Update state on render
    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { isLoggedIn, userRole };
};

export default useAuth;
