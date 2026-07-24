import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convexApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

/** Shared department manager used by both the Admin and HR "Departments" pages. */
const DepartmentsManager = () => {
  const departments = useQuery(api.departments.listByTenant);
  const createDepartment = useMutation(api.departments.create);
  const removeDepartment = useMutation(api.departments.remove);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;

    setIsSubmitting(true);
    try {
      await createDepartment({ name });
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create department");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (departmentId: string) => {
    try {
      await removeDepartment({ departmentId: departmentId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove department");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="flex gap-2">
        <Input name="name" placeholder="New department name" required className="max-w-xs" />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add department
        </Button>
      </form>

      {departments === undefined ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : departments.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-lg">No departments yet</CardTitle>
            <CardDescription>Create your first department above.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept._id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{dept.name}</CardTitle>
                  {dept.description && (
                    <CardDescription>{dept.description}</CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(dept._id)}
                  aria-label={`Remove ${dept.name}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsManager;
