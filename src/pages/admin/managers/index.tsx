import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const AdminManagers = () => {
  const users = useQuery(api.users.listByTenant);

  const managers = users?.filter((u) => u.role === "manager") ?? [];
  const teamSize = (managerId: string) =>
    users?.filter((u) => u.managerId === managerId).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Managers</h1>
        <p className="mt-1 text-muted-foreground">
          Assign managers and oversee their teams.
        </p>
      </div>

      {users === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Team size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No managers yet. Promote a teammate from the HR page.
                </TableCell>
              </TableRow>
            )}
            {managers.map((manager) => (
              <TableRow key={manager._id}>
                <TableCell className="font-medium text-foreground">
                  {manager.name ?? "Unnamed"}
                </TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{teamSize(manager._id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminManagers;
