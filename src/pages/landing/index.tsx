import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import FeatureGrid from "./FeatureGrid";
import CtaSection from "./CtaSection";

const Landing = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <LandingNavbar />
      <Hero />
      <FeatureGrid />
      <CtaSection />
    </div>
  );
};

export default Landing;
