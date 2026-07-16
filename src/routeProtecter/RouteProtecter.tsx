import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/use-auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { userRole } = useAuth();

  if (!userRole) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to={`/${userRole.toLowerCase()}/dashboard`} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
