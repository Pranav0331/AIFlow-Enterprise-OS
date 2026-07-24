import { Navigate } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";
import { api } from "@/lib/convexApi";

type Role = "admin" | "hr" | "manager" | "employee";

interface RoleProtectedRouteProps extends PropsWithChildren {
  allowed: Role[];
}

/**
 * Gates a role-specific dashboard tree behind Convex authentication AND the
 * caller's stored role. Redirects to /login when unauthenticated, and to
 * /redirect (which resolves the correct dashboard) when the role doesn't
 * match — so users can never land on a dashboard for a role they don't have.
 */
const RoleProtectedRoute = ({ allowed, children }: RoleProtectedRouteProps) => {
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

  if (!currentUser?.role || !allowed.includes(currentUser.role as Role)) {
    return <Navigate to="/redirect" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
