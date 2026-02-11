import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "./WaitlistDialog";

export const StickyMobileCTA = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border px-4 py-3">
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => setShowWaitlist(true)}
        >
          Get Early Access — It's Free
        </Button>
      </div>
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </>
  );
};
