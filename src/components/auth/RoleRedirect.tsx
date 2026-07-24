import { Navigate } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/convexApi";

/**
 * Mounted at /redirect. Sends an authenticated user to the dashboard that
 * matches their stored role, sends a tenant-less authenticated user to
 * /signup (they never finished creating/joining a company), and sends an
 * unauthenticated visitor to /login.
 */
const RoleRedirect = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.currentUser, isAuthenticated ? undefined : "skip");

  if (isLoading || (isAuthenticated && currentUser === undefined)) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser?.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "hr":
      return <Navigate to="/hr" replace />;
    case "manager":
      return <Navigate to="/manager" replace />;
    case "employee":
      return <Navigate to="/employee" replace />;
    default:
      return <Navigate to="/signup" replace />;
  }
};

export default RoleRedirect;
