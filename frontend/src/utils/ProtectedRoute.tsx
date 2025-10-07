// ProtectedRoute.tsx
import React from "react";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // Optional roles prop for future role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (roles && !user.roles.some((role: string) => roles.includes(role))) {
    navigate("/unauthorized");
    return null;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
