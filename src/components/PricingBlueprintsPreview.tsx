import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BlueprintCard {
  title: string;
  subtitle: string;
  pricingModels: string;
  unitOfValue: string;
  geography: string;
  link?: string;
  comingSoon?: boolean;
}

const blueprints: BlueprintCard[] = [
  {
    title: "Research Agent",
    subtitle: "Pricing Blueprint",
    pricingModels: "Per-output · Per-seat · Hybrid",
    unitOfValue: "1 agent run = 1 task",
    geography: "USD · EUR · INR",
    link: "/pricing-blueprints/research-agent",
  },
  {
    title: "Social Content Creator Agent",
    subtitle: "Pricing Blueprint",
    pricingModels: "Per-output · Subscription",
    unitOfValue: "1 content piece = 1 credit",
    geography: "USD · EUR",
    link: "/pricing-blueprints/social-content-creator-agent",
  },
  {
    title: "Customer Support Agent",
    subtitle: "Pricing Blueprint",
    pricingModels: "Per-resolution · Per-seat",
    unitOfValue: "1 ticket resolved = 1 unit",
    geography: "USD · GBP · EUR",
    comingSoon: true,
  },
  {
    title: "AI SDR Agent",
    subtitle: "Pricing Blueprint",
    pricingModels: "Per-lead · Per-meeting",
    unitOfValue: "1 qualified lead = 1 outcome",
    geography: "USD · EUR",
    comingSoon: true,
  },
];

export const PricingBlueprintsPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          {/* Left Column - Context */}
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Pricing Blueprint Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Ready-to-use pricing models for AI agents
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Explore how real AI agents are priced across geographies, customer types, and pricing models.
              </p>
              <p>
                Clone, compare, and adapt pricing logic — no guesswork.
              </p>
            </div>
            <Button asChild size="lg" className="mt-2">
              <Link to="/pricing-blueprints">
                Explore Pricing Blueprints
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right Column - Blueprint Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {blueprints.map((blueprint, index) => (
              <BlueprintPreviewCard key={index} {...blueprint} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BlueprintPreviewCard = ({
  title,
  subtitle,
  pricingModels,
  unitOfValue,
  geography,
  link,
  comingSoon,
}: BlueprintCard) => {
  const cardContent = (
    <Card className={`h-full transition-all duration-200 ${!comingSoon ? 'hover:shadow-md hover:border-primary/20 cursor-pointer' : 'opacity-75'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold leading-tight">
          {title}
          <span className="block text-sm font-normal text-muted-foreground mt-1">
            {subtitle}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <MetadataLine label="Pricing models" value={pricingModels} />
        <MetadataLine label="Unit of value" value={unitOfValue} />
        <MetadataLine label="Geography" value={geography} />
      </CardContent>
      <CardFooter className="pt-0">
        {comingSoon ? (
          <span className="text-sm text-muted-foreground italic">Coming soon</span>
        ) : (
          <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            View pricing blueprint
            <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </CardFooter>
    </Card>
  );

  if (comingSoon || !link) {
    return <div className="group">{cardContent}</div>;
  }

  return (
    <Link to={link} className="group block">
      {cardContent}
    </Link>
  );
};

const MetadataLine = ({ label, value }: { label: string; value: string }) => (
  <p className="text-xs text-muted-foreground">
    <span className="font-medium">{label}:</span> {value}
  </p>
);
