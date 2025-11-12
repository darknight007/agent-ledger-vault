import { Info } from "lucide-react";

export const Announcement = () => {
  return (
    <div className="bg-secondary/10 border-y border-secondary/20 py-8 px-4 md:py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-start gap-3 md:gap-4">
          <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-semibold">Hey folks!</span> We're powering SaaS/software founders to transition from feature-based pricing to AI-native, agentic pricing models. 
            If you or someone from your circle runs a SaaS/software business and thinking agentic transformation before 2026,{" "}
            <a 
              href="https://forms.gle/SUZae3rce4CcYdCS9" 
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
