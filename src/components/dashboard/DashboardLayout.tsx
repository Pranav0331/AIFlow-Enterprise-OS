import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardNavItem } from "./dashboardNav";
import { LayoutDashboard, LogOut, Workflow } from "lucide-react";

interface DashboardLayoutProps {
  /** Nav items shown under the "Workspace" group, specific to the caller's role. */
  navItems: DashboardNavItem[];
  /** Route the "Overview" link and logo point to (e.g. "/admin"). */
  homePath: string;
}

/**
 * Shared shell layout reused by all 4 role dashboards (Admin, HR, Manager,
 * Employee): sidebar nav across that role's sections, plus a top bar with
 * the current company name, role, and logout.
 */
const DashboardLayout = ({ navItems, homePath }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.currentUser);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <Sidebar>
          <SidebarHeader>
            <Link to={homePath} className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
                <Workflow className="h-4 w-4" />
              </span>
              <span className="font-semibold text-sidebar-foreground">
                AIFlow
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === homePath}
                    >
                      <Link to={homePath}>
                        <LayoutDashboard />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-medium text-foreground">
                {currentUser?.name ?? "Your company"}
              </span>
              {currentUser?.role && (
                <Badge variant="secondary" className="capitalize">
                  {currentUser.role}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
