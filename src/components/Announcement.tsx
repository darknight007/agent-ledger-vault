import { Zap } from "lucide-react";

interface AnnouncementProps {
  pricingBlueprintsLink?: string;
}

export const Announcement = ({
  pricingBlueprintsLink = "#pricing-blueprints"
}: AnnouncementProps) => {
  return (
    <div className="bg-accent/5 pt-20 pb-3 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-accent flex-shrink-0" />
          <p className="text-foreground/90">
            <span className="font-semibold">New:</span>{" "}
            4 ready-to-use AI pricing blueprints are live —{" "}
            <a
              href={pricingBlueprintsLink}
              className="text-accent hover:text-accent/80 underline font-medium transition-colors"
            >
              explore them here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
