import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { WaitlistDialog } from "./WaitlistDialog";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const navItems = [
    { label: "Solution", href: "#solution" },
    { label: "For Builders", href: "#builders" },
    { label: "For Buyers", href: "#enterprises" },
    { label: "Pricing", href: "#pricing" },
    { label: "Blueprints", href: "#pricing-blueprints" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="no-underline">
              <h1 className="text-2xl font-bold gradient-text">AskScrooge</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button size="sm" onClick={() => setShowWaitlist(true)}>
              Get Early Access
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button size="sm" className="w-full" onClick={() => setShowWaitlist(true)}>
                Get Early Access
              </Button>
            </div>
          </div>
        )}
      </div>
      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </nav>
  );
};
