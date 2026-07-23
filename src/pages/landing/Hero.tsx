import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_top,_hsl(var(--primary-glow))_0%,_transparent_60%)]" />
      <div className="container relative flex flex-col items-center gap-8 py-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/90">
          <Sparkles className="h-4 w-4 text-primary" />
          AI-Native Enterprise Operating System
        </span>
        <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl">
          Automate. Collaborate. Accelerate.
        </h1>
        <p className="max-w-2xl text-balance text-lg text-primary-foreground/70">
          Give every company an isolated workspace where employees, managers, and
          AI agents run operations together — approvals, policies, and budgets,
          without the manual back-and-forth.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="shadow-glow" asChild>
            <Link to="/signup">
              Create Company
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
