import { Info } from "lucide-react";

interface AnnouncementProps {
  pricingBlueprintsLink?: string;
  signupLink?: string;
}

export const Announcement = ({
  pricingBlueprintsLink = "/pricing-blueprints",
  signupLink = "https://forms.gle/SUZae3rce4CcYdCS9"
}: AnnouncementProps) => {
  return (
    <div className="bg-secondary/10 pt-20 pb-4 px-4 md:px-6 md:pb-5">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-start gap-3 md:gap-4">
          <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
          <p className="text-sm text-foreground/90 leading-relaxed mt-0">
            <span className="font-semibold">Hey folks!</span> We're powering all AI builders to monetize their applicaitons with ready-to use agentic pricing models.
            Checkout AI pricing blueprints{" "}
            <a
              href={pricingBlueprintsLink}
              className="text-secondary hover:text-secondary/80 underline font-medium transition-colors"
            >
              here for sample
            </a>. Join the outlier alpha circle for early acccess{" "}
            <a
              href={signupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 underline font-medium transition-colors"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
