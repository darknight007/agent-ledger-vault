import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { WaitlistDialog } from "./WaitlistDialog";

export const ForBuilders = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  
  const features = [
    "Token metering for every agent call",
    "Outcome mapping (lead, sale, KYC pass)",
    "Automated invoicing & margin analytics"
  ];

  return (
    <section className="py-20 px-4 bg-[hsl(222,65%,18%)]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Price your agents like a <span className="text-[hsl(158,96%,61%)]">product</span>, not a project.
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              We help builders turn AI workflows into monetizable, outcome-based services.
            </p>
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(158,96%,61%)] mt-1 flex-shrink-0" />
                  <span className="text-lg text-white">{feature}</span>
                </div>
              ))}
            </div>
            <Button size="lg" variant="solid-green" className="text-lg" onClick={() => setShowWaitlist(true)}>
              Get Early Access
            </Button>
            <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
          </div>
          
          <Card className="p-8 hover:shadow-xl transition-all bg-white">
            <div className="space-y-6">
              <div className="pb-4 border-b border-border">
                <h4 className="text-sm text-muted-foreground mb-2">Agent Performance</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">$29.6K</span>
                  <span className="text-accent text-lg mb-1">+142%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Token Usage</p>
                  <p className="text-2xl font-bold">847K</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cost/Action</p>
                  <p className="text-2xl font-bold">$0.35</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Margin</p>
                  <p className="text-2xl font-bold text-accent">85%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                  <p className="text-2xl font-bold">99.8%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
