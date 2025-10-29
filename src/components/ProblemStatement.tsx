import { Card } from "@/components/ui/card";
import { X, ArrowRight } from "lucide-react";

export const ProblemStatement = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            AI delivers outcomes. Charge them accordingly
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-destructive/20 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-full bg-destructive/10">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">Old World</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-6">SaaS Subscriptions & Fixed Costs</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>Builders can't price per workflow or outcome</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>CFOs can't track ROI or audit AI spend</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                <span>No unified layer connects token spend with business value</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-8 border-accent/20 hover:shadow-lg transition-all animate-glow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-full bg-accent/10">
                <ArrowRight className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">New World</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-6">Outcome-Linked AI Agents</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Price by action, workflow, or business outcome</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Real-time ROI tracking and audit trails</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span>Unified telemetry layer for complete visibility</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};
