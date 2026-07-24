import {
  Users,
  UserCog,
  UserPlus,
  Building2,
  ScrollText,
  Inbox,
  Bot,
  BarChart3,
  ShieldCheck,
  KeyRound,
  Clock,
  History,
  FilePlus2,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

/** Admin dashboard workspace sections. */
export const adminNavItems: DashboardNavItem[] = [
  {
    title: "Company Access",
    path: "/admin/company-access",
    icon: KeyRound,
    description: "Share join codes so teammates can access this workspace.",
  },
  {
    title: "Employees",
    path: "/admin/employees",
    icon: Users,
    description: "Manage the people in your company workspace.",
  },
  {
    title: "HR",
    path: "/admin/hr",
    icon: UserPlus,
    description: "Promote teammates to HR, Manager, or Employee roles.",
  },
  {
    title: "Managers",
    path: "/admin/managers",
    icon: UserCog,
    description: "Assign managers and oversee their teams.",
  },
  {
    title: "Departments",
    path: "/admin/departments",
    icon: Building2,
    description: "Organize your company into departments.",
  },
  {
    title: "Policies",
    path: "/admin/policies",
    icon: ScrollText,
    description: "Define the rules AI agents and staff operate under.",
  },
  {
    title: "Requests",
    path: "/admin/requests",
    icon: Inbox,
    description: "Track approvals moving through your workspace.",
  },
  {
    title: "AI Agents",
    path: "/admin/agents",
    icon: Bot,
    description: "Configure the AI agents working for your company.",
  },
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    description: "Monitor how your company operates over time.",
  },
  {
    title: "Audit Trail",
    path: "/admin/audit-trail",
    icon: ShieldCheck,
    description: "Review every decision and approval on record.",
  },
];

/** HR dashboard workspace sections. */
export const hrNavItems: DashboardNavItem[] = [
  {
    title: "Employees",
    path: "/hr/employees",
    icon: Users,
    description: "Manage the people in your company workspace.",
  },
  {
    title: "Departments",
    path: "/hr/departments",
    icon: Building2,
    description: "Organize your company into departments.",
  },
  {
    title: "Requests",
    path: "/hr/requests",
    icon: Inbox,
    description: "Review and action employee requests.",
  },
  {
    title: "Policies",
    path: "/hr/policies",
    icon: ScrollText,
    description: "Define the rules staff operate under.",
  },
];

/** Manager dashboard workspace sections. */
export const managerNavItems: DashboardNavItem[] = [
  {
    title: "Team Requests",
    path: "/manager/team-requests",
    icon: Inbox,
    description: "See every request raised by your direct reports.",
  },
  {
    title: "Pending Approvals",
    path: "/manager/pending-approvals",
    icon: Clock,
    description: "Approve or reject requests awaiting your review.",
  },
  {
    title: "Request History",
    path: "/manager/request-history",
    icon: History,
    description: "Look back at requests you've already reviewed.",
  },
];

/** Employee dashboard workspace sections. */
export const employeeNavItems: DashboardNavItem[] = [
  {
    title: "New Request",
    path: "/employee/new-request",
    icon: FilePlus2,
    description: "Submit a new leave, expense, or equipment request.",
  },
  {
    title: "My Requests",
    path: "/employee/my-requests",
    icon: Inbox,
    description: "See every request you've submitted.",
  },
  {
    title: "Request Status",
    path: "/employee/request-status",
    icon: Clock,
    description: "Track your requests grouped by status.",
  },
  {
    title: "My Profile",
    path: "/employee/my-profile",
    icon: UserRound,
    description: "View your profile, department, and manager.",
  },
];
