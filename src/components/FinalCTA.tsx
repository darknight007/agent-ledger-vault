import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-10"></div>
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <div className="animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Future of <span className="gradient-text">AI Economics</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Start pricing your agents or tracking AI ROI today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg group">
              For Builders → Get Early Access
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg group">
              For Enterprises → Request Demo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
