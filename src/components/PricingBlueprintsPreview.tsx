import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { WaitlistDialog } from "./WaitlistDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
    <>
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
      <TechCostAnalyzerSection />
    </>
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

const TechCostAnalyzerSection = () => {
  const [repoLink, setRepoLink] = useState("");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const saveRepositoryLink = async (link: string) => {
    if (!link.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository link",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([
          {
            repo_link: link.trim(),
            email: "repo-submission@example.com", // Placeholder email for repo submissions
            name: "Repository Submission",
            phone: null,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your repository link has been submitted. Opening waitlist...",
      });

      setRepoLink("");
      setShowWaitlist(true);
    } catch (error: any) {
      console.error("Error saving repository link:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit repository link",
        variant: "destructive",
      });
      // Still open waitlist for better UX even if saving fails
      setShowWaitlist(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = () => {
    saveRepositoryLink(repoLink);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleAnalyze();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <>
      <section id="tech-cost-analyzer" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Get your product's tech running cost and recommended pricing model
            </h2>
          </div>

          {/* Input and Button Container */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Input
              type="text"
              placeholder="Paste your code repository link..."
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 min-w-0"
              disabled={isSubmitting}
            />
            <Button
              size="lg"
              onClick={handleAnalyze}
              className="sm:w-auto"
              disabled={isSubmitting}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </>
  );
};
