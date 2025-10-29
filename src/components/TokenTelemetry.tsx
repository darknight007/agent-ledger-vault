import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const TokenTelemetry = () => {
  const flowSteps = [
    { label: "Agent Builder", description: "Deploy & monitor" },
    { label: "Transaction", description: "Execute & meter" },
    { label: "Telemetry", description: "Capture & verify" },
    { label: "Insights", description: "Analyze & benchmark" },
    { label: "Optimization", description: "Improve & price" }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Token Telemetry Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Verified Data. Trusted Transactions.
          </p>
        </div>
        
        <Card className="p-8 md:p-12 mb-12">
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Every transaction feeds token-level telemetry — verified data on agent cost, reliability, and performance. 
            This powers pricing benchmarks, ROI analytics, and future financial standards for AI labor.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-6">
                <Card className="p-6 hover:shadow-lg transition-all min-w-[160px]">
                  <h4 className="font-bold text-lg mb-1">{step.label}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-accent hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </Card>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">The Data Flywheel Behind Outcome-Based AI</p>
        </div>
      </div>
    </section>
  );
};
