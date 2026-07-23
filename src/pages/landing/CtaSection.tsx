import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="container pb-24">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-elegant">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_bottom,_hsl(var(--primary-foreground))_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Ready to run your company on AIFlow?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Set up your workspace in minutes and start inviting your team.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link to="/signup">
              Create Company
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
