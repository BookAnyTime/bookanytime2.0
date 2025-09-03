import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  if (!parsedUser || !parsedUser.isAdmin) {
    // Redirect non-admin users to home or login
    return <Navigate to="" replace />;
  }

  return children;
};

export default AdminRoute;
