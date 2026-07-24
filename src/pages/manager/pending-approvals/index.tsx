import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { buildTeamNames } from "@/lib/teamNames";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const ManagerPendingApprovals = () => {
  const requests = useQuery(api.requests.listForManagerTeam);
  const team = useQuery(api.users.listMyTeam);
  const setStatus = useMutation(api.requests.setStatus);
  const requesterNames = buildTeamNames(team);

  const pending = requests?.filter((r) => r.status === "pending") ?? [];

  const handleAction = async (requestId: string, status: "approved" | "rejected") => {
    try {
      await setStatus({ requestId: requestId, status });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update request");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pending Approvals</h1>
        <p className="mt-1 text-muted-foreground">
          Requests from your team awaiting your review.
        </p>
      </div>

      {requests === undefined || team === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <RequestsTable
          requests={pending}
          requesterNames={requesterNames}
          onApprove={(id) => handleAction(id, "approved")}
          onReject={(id) => handleAction(id, "rejected")}
          emptyLabel="Nothing pending — you're all caught up."
        />
      )}
    </div>
  );
};

export default ManagerPendingApprovals;
