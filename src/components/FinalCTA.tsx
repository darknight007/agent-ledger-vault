import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap } from "lucide-react";
import { WaitlistDialog } from "./WaitlistDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUtmParams } from "@/lib/utm";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email");

export const FinalCTA = () => {
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
        { name: "", email: email.trim(), ...utm },
      ]);

      if (error) throw error;

      toast({
        title: "You're in!",
        description: "We'll be in touch soon with early access.",
      });
      setEmail("");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-10"></div>
      <div className="container mx-auto max-w-3xl relative z-10 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            <span>Free forever on Builder plan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            Your agents deserve a{" "}
            <span className="gradient-text">revenue model</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Join the first 1,000 builders getting pricing blueprints, billing
            infra, and ROI dashboards — all before launch.
          </p>

          {/* Inline email capture */}
          <form
            onSubmit={handleInlineSignup}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
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
              {isSubmitting ? "Joining..." : "Claim My Spot"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setShowWaitlist(true)}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Or sign up with full details
          </button>

          <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
        </div>
      </div>
    </section>
  );
};
