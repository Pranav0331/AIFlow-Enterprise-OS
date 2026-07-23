import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { routers } from "./router";
import { convexClient, isConvexConfigured } from "./lib/convex";
import ConvexSetupNotice from "./components/system/ConvexSetupNotice";

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter(routers);

  if (!isConvexConfigured || !convexClient) {
    return <ConvexSetupNotice />;
  }

  return (
    <ConvexAuthProvider client={convexClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  );
};

export default App;
