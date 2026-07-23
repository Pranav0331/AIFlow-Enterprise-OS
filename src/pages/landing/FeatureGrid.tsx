import {
  Building2,
  ShieldCheck,
  Bot,
  Wallet,
  ScrollText,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Building2,
    title: "Multi-Tenant Workspaces",
    description:
      "Every company gets a fully isolated workspace — data never crosses tenant boundaries.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Admins, Managers, and Employees each get scoped permissions across the whole platform.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    description:
      "Delegate routine operations to AI agents that act within the policies you define.",
  },
  {
    icon: ScrollText,
    title: "Policies & Requests",
    description:
      "Codify approval rules once, then let requests flow through automatically.",
  },
  {
    icon: Wallet,
    title: "Departments & Budgets",
    description:
      "Organize teams and spending so every decision has the right context attached.",
  },
  {
    icon: ShieldCheck,
    title: "Audit Trail",
    description:
      "Every decision and approval is recorded, giving you a durable record of what happened.",
  },
];

const FeatureGrid = () => {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Everything an AI-run company needs
        </h2>
        <p className="mt-4 text-muted-foreground">
          One operating system for the people, policies, and agents that keep
          your company moving.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-elegant"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-card-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
