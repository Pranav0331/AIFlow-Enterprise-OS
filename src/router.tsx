import Landing from "./pages/landing";
import Signup from "./pages/signup";
import Login from "./pages/login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardOverview from "./pages/dashboard";
import Employees from "./pages/dashboard/employees";
import Managers from "./pages/dashboard/managers";
import Departments from "./pages/dashboard/departments";
import Policies from "./pages/dashboard/policies";
import Requests from "./pages/dashboard/requests";
import Agents from "./pages/dashboard/agents";
import Analytics from "./pages/dashboard/analytics";
import AuditTrail from "./pages/dashboard/audit-trail";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    name: "home",
    element: <Landing />,
  },
  {
    path: "/signup",
    name: "signup",
    element: <Signup />,
  },
  {
    path: "/login",
    name: "login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, name: "dashboard-overview", element: <DashboardOverview /> },
      { path: "employees", name: "dashboard-employees", element: <Employees /> },
      { path: "managers", name: "dashboard-managers", element: <Managers /> },
      { path: "departments", name: "dashboard-departments", element: <Departments /> },
      { path: "policies", name: "dashboard-policies", element: <Policies /> },
      { path: "requests", name: "dashboard-requests", element: <Requests /> },
      { path: "agents", name: "dashboard-agents", element: <Agents /> },
      { path: "analytics", name: "dashboard-analytics", element: <Analytics /> },
      { path: "audit-trail", name: "dashboard-audit-trail", element: <AuditTrail /> },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
