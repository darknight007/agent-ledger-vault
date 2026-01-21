import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { WaitlistDialog } from "./WaitlistDialog";
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
    unitOfValue: "1 agent run = 1 research task",
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
    link: "/pricing-blueprints/customer-support-agent",
  },
  {
    title: "AI SDR Agent",
    subtitle: "Pricing Blueprint",
    pricingModels: "Per-lead · Per-meeting",
    unitOfValue: "1 qualified lead = 1 outcome",
    geography: "USD · EUR",
    link: "/pricing-blueprints/ai-sdr-agent",
  },
];

export const PricingBlueprintsPreview = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <section id="pricing-blueprints" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Pricing Blueprint Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready-to-use pricing models for AI agents
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore how real AI agents are priced across geographies, customer types, and pricing models. Clone, compare, and adapt pricing logic — no guesswork.
          </p>
        </div>

        {/* Carousel - Blueprint Cards */}
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {blueprints.map((blueprint, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                <BlueprintPreviewCard {...blueprint} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex gap-2 justify-center mt-8">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <Button size="lg" onClick={() => setShowWaitlist(true)}>
            Explore Pricing Blueprints
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
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
