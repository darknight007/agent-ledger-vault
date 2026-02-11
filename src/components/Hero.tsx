import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";
import { WaitlistDialog } from "./WaitlistDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUtmParams } from "@/lib/utm";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email");

export const Hero = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInlineSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const utm = getUtmParams();
      const { error } = await supabase.from("waitlist").insert([
        {
          name: "",
          email: email.trim(),
          ...utm,
        },
      ]);

      if (error) throw error;

      toast({
        title: "You're in!",
        description: "Check your inbox — we'll be in touch soon.",
      });
      setEmail("");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or use the full form below.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pb-20 pt-0 px-4 overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-5"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>Early access — limited to first 1,000 builders</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
              Stop guessing what to{" "}
              <span className="gradient-text">charge for your AI agent</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              AskScrooge gives you pricing models, billing infra, and ROI
              dashboards — so you ship outcomes, not invoices.
            </p>

            {/* Inline email capture */}
            <form
              onSubmit={handleInlineSignup}
              className="flex flex-col sm:flex-row gap-3 mb-6 max-w-lg"
            >
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base flex-1"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 text-base font-semibold group whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Get Early Access"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setShowWaitlist(true)}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors mb-8 block"
            >
              Or sign up with full details
            </button>

            {/* Social proof row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>4 ready-to-use pricing blueprints</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" />
                <span>Ship in minutes, not months</span>
              </div>
            </div>

            <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
          </div>
          <div className="animate-slide-up">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
