import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  archived: "outline",
};

/** Shared policy manager used by both the Admin and HR "Policies" pages. */
const PoliciesManager = () => {
  const policies = useQuery(api.policies.listByTenant);
  const createPolicy = useMutation(api.policies.create);
  const updatePolicy = useMutation(api.policies.update);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!title) return;

    setIsSubmitting(true);
    try {
      await createPolicy({ title, description: description || undefined, status: "draft" });
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create policy");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (policyId: string, status: string) => {
    try {
      await updatePolicy({ policyId: policyId, status: status });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update policy");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Input name="title" placeholder="Policy title" required className="sm:max-w-xs" />
        <Textarea name="description" placeholder="Description (optional)" className="sm:max-w-sm" />
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add policy
        </Button>
      </form>

      {policies === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : policies.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-lg">No policies yet</CardTitle>
            <CardDescription>Create your first policy above.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {policies.map((policy) => (
            <Card key={policy._id}>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{policy.title}</CardTitle>
                  <Badge variant={STATUS_VARIANT[policy.status]} className="capitalize">
                    {policy.status}
                  </Badge>
                </div>
                {policy.description && (
                  <CardDescription>{policy.description}</CardDescription>
                )}
                <Select value={policy.status} onValueChange={(value) => handleStatusChange(policy._id, value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliciesManager;
