import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const HrRequests = () => {
  const requests = useQuery(api.requests.listByTenant);
  const users = useQuery(api.users.listByTenant);
  const setStatus = useMutation(api.requests.setStatus);

  const requesterNames =
    users?.reduce<Record<string, string>>((acc, user) => {
      acc[user._id] = user.name ?? user.email ?? "Unknown";
      return acc;
    }, {}) ?? {};

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
        <h1 className="text-2xl font-semibold text-foreground">Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Review and action employee requests.
        </p>
      </div>

      {requests === undefined || users === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <RequestsTable
          requests={requests}
          requesterNames={requesterNames}
          onApprove={(id) => handleAction(id, "approved")}
          onReject={(id) => handleAction(id, "rejected")}
        />
      )}
    </div>
  );
};

export default HrRequests;
