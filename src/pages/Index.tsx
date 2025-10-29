import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { SolutionOverview } from "@/components/SolutionOverview";
import { ForBuilders } from "@/components/ForBuilders";
import { DiagonalDivider } from "@/components/DiagonalDivider";
import { ForEnterprises } from "@/components/ForEnterprises";
import { Pricing } from "@/components/Pricing";
import { FinalCTA } from "@/components/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <ProblemStatement />
        <section id="solution">
          <SolutionOverview />
        </section>
        <section id="builders">
          <ForBuilders />
        </section>
        <DiagonalDivider />
        <section id="enterprises">
          <ForEnterprises />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <FinalCTA />
      </main>
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 AgentFi. Monetary Middleware for AI Work.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
