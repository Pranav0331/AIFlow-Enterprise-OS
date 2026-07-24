import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const NONE = "__none__";

/**
 * Shared employee roster used by both the Admin and HR "Employees" pages.
 * Lets admins/HR assign a department, assign a manager (from tenant users
 * with the "manager" role), and toggle a user's active status.
 */
const EmployeeManagementTable = () => {
  const users = useQuery(api.users.listByTenant);
  const departments = useQuery(api.departments.listByTenant);
  const managers = useQuery(api.users.listManagers);
  const updateEmployee = useMutation(api.users.updateEmployee);

  if (users === undefined || departments === undefined || managers === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleDepartmentChange = async (userId: string, value: string) => {
    try {
      await updateEmployee({
        userId: userId,
        departmentId: value === NONE ? null : (value),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update department");
    }
  };

  const handleManagerChange = async (userId: string, value: string) => {
    try {
      await updateEmployee({
        userId: userId,
        managerId: value === NONE ? null : (value),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update manager");
    }
  };

  const handleActiveChange = async (userId: string, isActive: boolean) => {
    try {
      await updateEmployee({ userId: userId, isActive });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Manager</TableHead>
          <TableHead>Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No employees yet.
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <div className="font-medium text-foreground">{user.name ?? "Unnamed"}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {user.role ?? "unassigned"}
              </Badge>
            </TableCell>
            <TableCell>
              <Select
                value={user.departmentId ?? NONE}
                onValueChange={(value) => handleDepartmentChange(user._id, value)}
                disabled={user.role === "admin"}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="No department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>No department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                value={user.managerId ?? NONE}
                onValueChange={(value) => handleManagerChange(user._id, value)}
                disabled={user.role === "admin" || user.role === "manager"}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="No manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>No manager</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager._id} value={manager._id}>
                      {manager.name ?? manager.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Switch
                checked={user.isActive ?? true}
                disabled={user.role === "admin"}
                onCheckedChange={(checked) => handleActiveChange(user._id, checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeManagementTable;
