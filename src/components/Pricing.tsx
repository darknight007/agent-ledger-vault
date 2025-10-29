import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { WaitlistDialog } from "./WaitlistDialog";

export const Pricing = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const calendlyUrl = "https://calendly.com/cfoscrooge/30min";
  
  const tiers = [{
    name: "Builder Free",
    description: "Track up to 3 agents",
    idealFor: "Indie Devs",
    price: "$0",
    period: "month",
    features: ["3 active agents", "Basic token metering", "Community support", "API access"]
  }, {
    name: "Growth",
    description: "Meter usage, bill clients, audit outcomes",
    idealFor: "Startups & AI Service Providers",
    price: "$99",
    period: "month",
    featured: true,
    features: ["Unlimited agents", "Advanced analytics", "Client billing", "Priority support", "Custom integrations"]
  }, {
    name: "Enterprise",
    description: "Multi-agent telemetry, custom billing, CFO dashboard",
    idealFor: "Corporates / Fintechs",
    price: "Custom",
    period: "pricing",
    features: ["Everything in Growth", "CFO dashboard", "Custom billing rules", "Dedicated support", "SLA guarantees", "White-label options"]
  }, {
    name: "Platform API",
    description: "White-label token settlement rails",
    idealFor: "Infra Providers",
    price: "Usage",
    period: "based",
    features: ["API-first architecture", "White-label platform", "Transaction fee model", "Custom integrations", "Developer support"]
  }];
  return <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, index) => <Card key={index} className={`p-6 hover:shadow-xl transition-all ${tier.featured ? 'border-accent border-2 animate-glow' : ''}`}>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  
                </div>
                <p className="text-sm text-accent font-medium">{tier.idealFor}</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>)}
              </ul>
              
              <Button 
                className="w-full" 
                variant={tier.featured ? "default" : "outline"}
                onClick={() => {
                  if (tier.price === "Custom" || tier.price === "Usage") {
                    window.open(calendlyUrl, '_blank');
                  } else {
                    setShowWaitlist(true);
                  }
                }}
              >
                {tier.price === "Custom" || tier.price === "Usage" ? "Talk to Us" : "Join Beta"}
              </Button>
            </Card>)}
        </div>
        <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
      </div>
    </section>;
};