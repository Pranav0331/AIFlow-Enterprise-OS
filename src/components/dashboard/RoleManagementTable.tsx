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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/** Admin-only: lets the admin promote/demote teammates between hr/manager/employee. */
const RoleManagementTable = () => {
  const currentUser = useQuery(api.users.currentUser);
  const users = useQuery(api.users.listByTenant);
  const updateRole = useMutation(api.users.updateRole);

  if (users === undefined || currentUser === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const teammates = users.filter((u) => u._id !== currentUser?._id);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRole({ userId: userId, role: role });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update role");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teammates.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No teammates yet — share a company code to invite them.
            </TableCell>
          </TableRow>
        )}
        {teammates.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium text-foreground">
              {user.name ?? "Unnamed"}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                value={user.role ?? "employee"}
                onValueChange={(value) => handleRoleChange(user._id, value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoleManagementTable;
