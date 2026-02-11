import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getUtmParams } from "@/lib/utm";
import { z } from "zod";

const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
});

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WaitlistDialog = ({ open, onOpenChange }: WaitlistDialogProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = waitlistSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
      });

      setIsSubmitting(true);

      const utm = getUtmParams();

      const { error } = await supabase.from("waitlist").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          ...utm,
        },
      ]).select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      toast({
        title: "You're on the list!",
        description: "We'll reach out with early access details soon.",
      });

      setFormData({ name: "", email: "", phone: "" });
      onOpenChange(false);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        console.error("Waitlist submission error:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to join waitlist. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join waitlist. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Early Access</DialogTitle>
          <DialogDescription>
            Join 1,000 builders shaping the future of AI monetization. No credit card required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Claim My Spot"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Free forever on the Builder plan. Upgrade anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
