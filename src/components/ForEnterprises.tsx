import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const ForEnterprises = () => {
  const features = [
    "Budget by outcome, not seat count",
    "Forecast ROI and compliance per department",
    "See live AI labor efficiency and savings"
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Card className="p-8 hover:shadow-xl transition-all order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-muted-foreground mb-2">Department: Customer Support</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Human Cost</p>
                  <p className="text-2xl font-bold">$180K</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10">
                  <p className="text-sm text-muted-foreground mb-1">AI Cost</p>
                  <p className="text-2xl font-bold text-accent">$52K</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10">
                  <p className="text-sm text-muted-foreground mb-1">ROI</p>
                  <p className="text-2xl font-bold text-accent">+3.4x</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">SLA</p>
                  <p className="text-2xl font-bold">99.3%</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Annual Savings</span>
                  <span className="text-xl font-bold text-accent">$128K</span>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="animate-fade-in order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bring AI spend under <span className="gradient-text">control</span> — and tie it to real results.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We help CFOs and finance teams budget AI with precision.
            </p>
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="text-lg">
              See CFO Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
