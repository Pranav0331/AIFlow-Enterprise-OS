import { Navigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";

/**
 * Gates dashboard routes behind Convex authentication. Redirects to /login
 * when unauthenticated; shows a spinner while the auth state is resolving.
 */
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
