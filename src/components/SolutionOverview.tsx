import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, BarChart3 } from "lucide-react";
import { WaitlistDialog } from "./WaitlistDialog";

export const SolutionOverview = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const features = [
    {
      icon: DollarSign,
      title: "Pricing Engine",
      description: "Create pricing models per action, per outcome, or per replacement. Define exactly how your agents generate value."
    },
    {
      icon: FileText,
      title: "Billing & Settlement",
      description: "Generate invoices, automate reconciliation, and manage token-based payments seamlessly."
    },
    {
      icon: BarChart3,
      title: "Audit & ROI Dashboards",
      description: "Track token costs, business returns, and compliance metrics in one unified system of record."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            A Financial Operating Layer for{" "}
            <span className="gradient-text">Agentic Work</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-3 rounded-lg bg-accent/10 w-fit mb-6">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" className="text-lg" onClick={() => setShowWaitlist(true)}>
            Explore Pricing Engine
          </Button>
        </div>
        <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
      </div>
    </section>
  );
};
