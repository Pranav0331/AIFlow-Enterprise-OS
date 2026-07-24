import { useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const EmployeeOverview = () => {
  const currentUser = useQuery(api.users.currentUser);
  const myRequests = useQuery(api.requests.listMine);

  const pendingCount = myRequests?.filter((r) => r.status === "pending").length ?? 0;
  const approvedCount = myRequests?.filter((r) => r.status === "approved").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's a snapshot of your requests.
        </p>
      </div>

      {myRequests === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total requests</CardDescription>
              <CardTitle className="text-3xl">{myRequests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl">{approvedCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeeOverview;
