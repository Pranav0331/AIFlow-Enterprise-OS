import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/lib/convexApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Workflow } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createCompany = useMutation(api.tenants.createCompany);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When the user successfully signs up we set `pendingCreate` to the
  // company name. An effect watches `isAuthenticated` and when it becomes
  // true and `pendingCreate` is set, it executes the `createCompany`
  // mutation exactly once. This avoids polling and relies on the
  // reactive `useConvexAuth()` state.
  const [pendingCreate, setPendingCreate] = useState<string | null>(null);

  useEffect(() => {
    console.debug("signup effect: pendingCreate", pendingCreate, "isAuthenticated", isAuthenticated, "isLoading", isLoading);
    if (pendingCreate && isAuthenticated && !isLoading) {
      (async () => {
        try {
          console.debug("Creating company after auth:", pendingCreate);
          await createCompany({ companyName: pendingCreate });
          setPendingCreate(null);
          navigate("/dashboard");
        } catch (err) {
          setPendingCreate(null);
          console.error("Error creating company after auth:", err);
        }
      })();
    }
  }, [pendingCreate, isAuthenticated, isLoading, createCompany, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const companyName = String(formData.get("companyName") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    try {
      await signIn("password", { email, password, name, flow: "signUp" });

      // Do not call createCompany here. Instead set the pending company name
      // and let the effect above call the mutation once `isAuthenticated`
      // becomes `true`.
      setPendingCreate(companyName);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create your company"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-elegant">
            <Workflow className="h-5 w-5" />
          </span>
          <CardTitle className="mt-2">Create your company</CardTitle>
          <CardDescription>
            You'll become the Admin of a new, isolated workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input id="companyName" name="companyName" required placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Company
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a workspace?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
