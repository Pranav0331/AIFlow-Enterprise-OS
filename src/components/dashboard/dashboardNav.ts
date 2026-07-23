import {
  Users,
  UserCog,
  Building2,
  ScrollText,
  Inbox,
  Bot,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  title: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

/** The 8 core sections of the Admin Dashboard shell. */
export const dashboardNavItems: DashboardNavItem[] = [
  {
    title: "Employees",
    path: "/dashboard/employees",
    icon: Users,
    description: "Manage the people in your company workspace.",
  },
  {
    title: "Managers",
    path: "/dashboard/managers",
    icon: UserCog,
    description: "Assign managers and oversee their teams.",
  },
  {
    title: "Departments",
    path: "/dashboard/departments",
    icon: Building2,
    description: "Organize your company into departments.",
  },
  {
    title: "Policies",
    path: "/dashboard/policies",
    icon: ScrollText,
    description: "Define the rules AI agents and staff operate under.",
  },
  {
    title: "Requests",
    path: "/dashboard/requests",
    icon: Inbox,
    description: "Track approvals moving through your workspace.",
  },
  {
    title: "AI Agents",
    path: "/dashboard/agents",
    icon: Bot,
    description: "Configure the AI agents working for your company.",
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
    description: "Monitor how your company operates over time.",
  },
  {
    title: "Audit Trail",
    path: "/dashboard/audit-trail",
    icon: ShieldCheck,
    description: "Review every decision and approval on record.",
  },
];
