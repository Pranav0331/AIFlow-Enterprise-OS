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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const ManagerOverview = () => {
  const team = useQuery(api.users.listMyTeam);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Team</h1>
        <p className="mt-1 text-muted-foreground">
          The people who report directly to you.
        </p>
      </div>

      {team === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No direct reports yet.
                </TableCell>
              </TableRow>
            )}
            {team.map((member) => (
              <TableRow key={member._id}>
                <TableCell className="font-medium text-foreground">
                  {member.name ?? "Unnamed"}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.isActive === false ? "outline" : "secondary"}>
                    {member.isActive === false ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManagerOverview;
