import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Loader2 } from "lucide-react";

const AdminRequests = () => {
  const requests = useQuery(api.requests.listByTenant);
  const users = useQuery(api.users.listByTenant);

  const requesterNames =
    users?.reduce<Record<string, string>>((acc, user) => {
      acc[user._id] = user.name ?? user.email ?? "Unknown";
      return acc;
    }, {}) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Requests</h1>
        <p className="mt-1 text-muted-foreground">
          Track approvals moving through your workspace.
        </p>
      </div>

      {requests === undefined || users === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <RequestsTable requests={requests} requesterNames={requesterNames} />
      )}
    </div>
  );
};

export default AdminRequests;
