import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts/user";
import Loader from "../../components/Loader";

interface AuthGuardProps {
  only?: "admin" | "loggedIn" | "guest" | "notBanned";
  fallbackPath?: string;
}

const AuthGuard = ({ only, fallbackPath }: AuthGuardProps) => {
  const user = useUser();
  console.log("AuthGuard user:", user);

  if (user.loading) {
    return <Loader fill />;
  }

  if (!user.user && (!only || only === "loggedIn")) {
    return <Navigate to={fallbackPath || "/login"} />;
  }

  if (user.user && only === "guest") {
    return <Navigate to={fallbackPath || "/"} />;
  }

  if (only === "admin" && (!user.user || !user.user.admin)) {
    return <Navigate to={fallbackPath || "/"} />;
  }

  if (only === "notBanned" && (!user.user || user.user.banned)) {
    return <Navigate to={fallbackPath || "/"} />;
  }

  return <Outlet />;
};

export default AuthGuard;
