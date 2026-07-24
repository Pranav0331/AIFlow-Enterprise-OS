import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserRound } from "lucide-react";

const EmployeeMyProfile = () => {
  const currentUser = useQuery(api.users.currentUser);
  const departments = useQuery(api.departments.listByTenant);
  const users = useQuery(api.users.listByTenant);

  const department = departments?.find((d) => d._id === currentUser?.departmentId);
  const manager = users?.find((u) => u._id === currentUser?.managerId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Your profile, department, and manager.
        </p>
      </div>

      {currentUser === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card className="max-w-lg">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <UserRound className="h-6 w-6" />
            </span>
            <div>
              <CardTitle>{currentUser?.name ?? "Unnamed"}</CardTitle>
              <CardDescription>{currentUser?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">
                {currentUser?.role ?? "unassigned"}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium text-foreground">
                {department?.name ?? "Unassigned"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Manager</span>
              <span className="font-medium text-foreground">
                {manager?.name ?? "Unassigned"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeMyProfile;
