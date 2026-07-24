import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";

const ROLE_LABEL: Record<string, string> = {
  hr: "HR",
  manager: "Manager",
  employee: "Employee",
};

const ROLE_DESCRIPTION: Record<string, string> = {
  hr: "Share with anyone who should manage employees, departments, and policies.",
  manager: "Share with anyone who should manage a team and review their requests.",
  employee: "Share with anyone joining the workspace as a regular employee.",
};

const CompanyAccess = () => {
  const joinCodes = useQuery(api.tenants.listJoinCodes);
  const regenerate = useMutation(api.tenants.regenerateJoinCode);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Could not copy code");
    }
  };

  const handleRegenerate = async (role: string) => {
    try {
      await regenerate({ role: role });
      toast.success("Code regenerated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not regenerate code");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Company Access</h1>
        <p className="mt-1 text-muted-foreground">
          Share these codes so teammates can join your workspace with the right role.
        </p>
      </div>

      {joinCodes === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {["hr", "manager", "employee"].map((role) => {
            const joinCode = joinCodes.find((jc) => jc.role === role);
            return (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="text-base">{ROLE_LABEL[role]}</CardTitle>
                  <CardDescription>{ROLE_DESCRIPTION[role]}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="rounded-md border border-border bg-muted px-3 py-2 text-center font-mono text-lg tracking-wider text-foreground">
                    {joinCode?.code ?? "—"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => joinCode && handleCopy(joinCode.code)}
                      disabled={!joinCode}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRegenerate(role)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyAccess;
