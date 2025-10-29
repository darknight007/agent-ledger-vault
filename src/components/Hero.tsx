import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-5"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              The Monetary Middleware for the{" "}
              <span className="gradient-text">AI-Agent Economy</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Price, transact, and audit AI-agent services — empowering builders to monetize outcomes and CFOs to measure real ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg group">
                I'm an AI Builder
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg group">
                I'm a CFO
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="animate-slide-up">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
