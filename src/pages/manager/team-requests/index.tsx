import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { buildTeamNames } from "@/lib/teamNames";
import { Loader2 } from "lucide-react";

const ManagerTeamRequests = () => {
  const requests = useQuery(api.requests.listForManagerTeam);
  const team = useQuery(api.users.listMyTeam);
  const requesterNames = buildTeamNames(team);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Team Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Every request raised by your direct reports.
        </p>
      </div>

      {requests === undefined || team === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <RequestsTable requests={requests} requesterNames={requesterNames} />
      )}
    </div>
  );
};

export default ManagerTeamRequests;
