import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/use-auth";
import { useEffect } from "react";
import TokenService from "../api/token/tokenService";

const PublicRoute = () => {
  const { userRole } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const ref = searchParams.get("ref");

  // Check if user is trying to access register page with a referral code
  const isReferralRegister = location.pathname === "/register" && !!ref;

  useEffect(() => {
    // If user is logged in and trying to access register with referral, logout automatically
    if (userRole && isReferralRegister) {
      TokenService.removeToken();
      window.location.reload();
    }
  }, [userRole, isReferralRegister]);

  // If user is logged in, redirect them to their respective dashboard
  if (userRole && !isReferralRegister) {
    return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

