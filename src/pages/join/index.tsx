import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
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

const ROLE_HOME: Record<string, string> = {
  hr: "/hr",
  manager: "/manager",
  employee: "/employee",
};

const JoinCompany = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const joinWithCode = useMutation(api.join.joinWithCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mirrors the Signup page's reactive pattern: sign up first, then once
  // `isAuthenticated` becomes true, redeem the join code exactly once.
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  useEffect(() => {
    if (pendingCode && isAuthenticated && !isLoading) {
      (async () => {
        try {
          const { role } = await joinWithCode({ code: pendingCode });
          setPendingCode(null);
          navigate(ROLE_HOME[role] ?? "/redirect");
        } catch (err) {
          setPendingCode(null);
          toast.error(
            err instanceof Error ? err.message : "Could not join that company"
          );
        }
      })();
    }
  }, [pendingCode, isAuthenticated, isLoading, joinWithCode, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("code") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);
    try {
      await signIn("password", { email, password, name, flow: "signUp" });
      setPendingCode(code);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create your account"
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
          <CardTitle className="mt-2">Join your company</CardTitle>
          <CardDescription>
            Use the company code your admin or HR shared with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="code">Company code</Label>
              <Input
                id="code"
                name="code"
                required
                placeholder="EMP-4F7QX2"
                className="uppercase"
              />
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
              Join Company
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Setting up a new company?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create Company
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinCompany;
