import { Terminal } from "lucide-react";

const steps = [
  "npx convex login",
  "npx convex dev",
  "npx @convex-dev/auth",
];

/**
 * Shown instead of the app when no Convex deployment URL has been
 * configured yet in src/config/convex.ts. Convex must be provisioned via an
 * interactive CLI login, so this guides the user through that one-time setup
 * instead of letting the app crash on a missing client.
 */
const ConvexSetupNotice = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Terminal className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold text-card-foreground">
          Connect your Convex backend
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AIFlow Enterprise OS stores all application data in Convex. Run
          these commands locally, then paste the printed deployment URL into{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            src/config/convex.ts
          </code>
          .
        </p>
        <ol className="mt-6 space-y-2">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                {index + 1}
              </span>
              <code className="rounded bg-muted px-2 py-1 text-sm text-foreground">
                {step}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ConvexSetupNotice;
