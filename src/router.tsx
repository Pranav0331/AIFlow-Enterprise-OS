import Landing from "./pages/landing";
import Signup from "./pages/signup";
import Login from "./pages/login";
import JoinCompany from "./pages/join";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import RoleRedirect from "./components/auth/RoleRedirect";
import {
  adminNavItems,
  hrNavItems,
  managerNavItems,
  employeeNavItems,
} from "./components/dashboard/dashboardNav";

import AdminOverview from "./pages/admin";
import AdminCompanyAccess from "./pages/admin/company-access";
import AdminEmployees from "./pages/admin/employees";
import AdminHr from "./pages/admin/hr";
import AdminManagers from "./pages/admin/managers";
import AdminDepartments from "./pages/admin/departments";
import AdminPolicies from "./pages/admin/policies";
import AdminRequests from "./pages/admin/requests";
import AdminAgents from "./pages/admin/agents";
import AdminAnalytics from "./pages/admin/analytics";
import AdminAuditTrail from "./pages/admin/audit-trail";

import HrOverview from "./pages/hr";
import HrEmployees from "./pages/hr/employees";
import HrDepartments from "./pages/hr/departments";
import HrRequests from "./pages/hr/requests";
import HrPolicies from "./pages/hr/policies";

import ManagerOverview from "./pages/manager";
import ManagerTeamRequests from "./pages/manager/team-requests";
import ManagerPendingApprovals from "./pages/manager/pending-approvals";
import ManagerRequestHistory from "./pages/manager/request-history";

import EmployeeOverview from "./pages/employee";
import EmployeeNewRequest from "./pages/employee/new-request";
import EmployeeMyRequests from "./pages/employee/my-requests";
import EmployeeRequestStatus from "./pages/employee/request-status";
import EmployeeMyProfile from "./pages/employee/my-profile";

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
    path: "/join",
    name: "join",
    element: <JoinCompany />,
  },
  {
    path: "/redirect",
    name: "redirect",
    element: <RoleRedirect />,
  },
  {
    path: "/admin",
    name: "admin",
    element: (
      <RoleProtectedRoute allowed={["admin"]}>
        <DashboardLayout navItems={adminNavItems} homePath="/admin" />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, name: "admin-overview", element: <AdminOverview /> },
      { path: "company-access", name: "admin-company-access", element: <AdminCompanyAccess /> },
      { path: "employees", name: "admin-employees", element: <AdminEmployees /> },
      { path: "hr", name: "admin-hr", element: <AdminHr /> },
      { path: "managers", name: "admin-managers", element: <AdminManagers /> },
      { path: "departments", name: "admin-departments", element: <AdminDepartments /> },
      { path: "policies", name: "admin-policies", element: <AdminPolicies /> },
      { path: "requests", name: "admin-requests", element: <AdminRequests /> },
      { path: "agents", name: "admin-agents", element: <AdminAgents /> },
      { path: "analytics", name: "admin-analytics", element: <AdminAnalytics /> },
      { path: "audit-trail", name: "admin-audit-trail", element: <AdminAuditTrail /> },
    ],
  },
  {
    path: "/hr",
    name: "hr",
    element: (
      <RoleProtectedRoute allowed={["hr"]}>
        <DashboardLayout navItems={hrNavItems} homePath="/hr" />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, name: "hr-overview", element: <HrOverview /> },
      { path: "employees", name: "hr-employees", element: <HrEmployees /> },
      { path: "departments", name: "hr-departments", element: <HrDepartments /> },
      { path: "requests", name: "hr-requests", element: <HrRequests /> },
      { path: "policies", name: "hr-policies", element: <HrPolicies /> },
    ],
  },
  {
    path: "/manager",
    name: "manager",
    element: (
      <RoleProtectedRoute allowed={["manager"]}>
        <DashboardLayout navItems={managerNavItems} homePath="/manager" />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, name: "manager-overview", element: <ManagerOverview /> },
      { path: "team-requests", name: "manager-team-requests", element: <ManagerTeamRequests /> },
      {
        path: "pending-approvals",
        name: "manager-pending-approvals",
        element: <ManagerPendingApprovals />,
      },
      {
        path: "request-history",
        name: "manager-request-history",
        element: <ManagerRequestHistory />,
      },
    ],
  },
  {
    path: "/employee",
    name: "employee",
    element: (
      <RoleProtectedRoute allowed={["employee"]}>
        <DashboardLayout navItems={employeeNavItems} homePath="/employee" />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, name: "employee-overview", element: <EmployeeOverview /> },
      { path: "new-request", name: "employee-new-request", element: <EmployeeNewRequest /> },
      { path: "my-requests", name: "employee-my-requests", element: <EmployeeMyRequests /> },
      {
        path: "request-status",
        name: "employee-request-status",
        element: <EmployeeRequestStatus />,
      },
      { path: "my-profile", name: "employee-my-profile", element: <EmployeeMyProfile /> },
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
