import { Navigation } from "@/components/Navigation";
import { Announcement } from "@/components/Announcement";
import { Hero } from "@/components/Hero";
import { PricingBlueprintsPreview } from "@/components/PricingBlueprintsPreview";
import { ProblemStatement } from "@/components/ProblemStatement";
import { SolutionOverview } from "@/components/SolutionOverview";
import { ForBuilders } from "@/components/ForBuilders";
import { DiagonalDivider } from "@/components/DiagonalDivider";
import { ForEnterprises } from "@/components/ForEnterprises";
import { Pricing } from "@/components/Pricing";
import { FinalCTA } from "@/components/FinalCTA";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Announcement />
      <main>
        <Hero />
        <PricingBlueprintsPreview />
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
      <StickyMobileCTA />
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/pricing-blueprints/research-agent"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing Blueprints
              </Link>
              <a
                href="https://www.linkedin.com/company/ask-scrooge/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 AskScrooge. Monetary Middleware for AI Work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
