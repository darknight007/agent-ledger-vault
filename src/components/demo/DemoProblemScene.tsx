import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DEMO_CHAT_MESSAGES } from "@/lib/demo-data";
import { Zap, CreditCard, HelpCircle } from "lucide-react";

interface Props {
  isActive: boolean;
}

export const DemoProblemScene = ({ isActive }: Props) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showStripeGap, setShowStripeGap] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisibleMessages(0);
      setShowStripeGap(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    DEMO_CHAT_MESSAGES.forEach((msg, i) => {
      timers.push(
        setTimeout(() => setVisibleMessages(i + 1), msg.delay + 500)
      );
    });

    timers.push(setTimeout(() => setShowStripeGap(true), 5000));

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: AI Support Bot */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-[hsl(158,64%,52%)]" />
            <span className="text-sm font-medium text-[hsl(220,10%,65%)] uppercase tracking-wider">
              AI Support Agent
            </span>
          </div>
          <Card className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-4 space-y-3">
            {DEMO_CHAT_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-[fadeSlideUp_0.3s_ease-out]`}
              >
                {msg.role === "system" ? (
                  <div className="w-full text-center py-2 px-3 rounded bg-[hsl(158,64%,52%,0.1)] border border-[hsl(158,64%,52%,0.3)]">
                    <span className="text-[hsl(158,64%,52%)] text-sm font-medium">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[hsl(220,50%,20%)] text-white"
                        : "bg-[hsl(158,64%,52%,0.12)] text-[hsl(158,64%,80%)] border border-[hsl(158,64%,52%,0.2)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {visibleMessages === 0 && (
              <div className="h-24 flex items-center justify-center text-[hsl(220,10%,35%)]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[hsl(220,10%,35%)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[hsl(220,10%,35%)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[hsl(220,10%,35%)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </Card>
          {visibleMessages >= 3 && (
            <p className="mt-3 text-sm text-[hsl(158,64%,52%)] font-medium animate-[fadeIn_0.4s_ease-in]">
              1,000 tickets resolved this month
            </p>
          )}
        </div>

        {/* Right: Stripe Gap */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-[hsl(220,10%,65%)]" />
            <span className="text-sm font-medium text-[hsl(220,10%,65%)] uppercase tracking-wider">
              Stripe Dashboard
            </span>
          </div>
          <Card className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(220,50%,18%)]">
                <span className="text-sm text-[hsl(220,10%,65%)]">Plan</span>
                <span className="text-sm text-white">Pro — $99/mo</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(220,50%,18%)]">
                <span className="text-sm text-[hsl(220,10%,65%)]">Status</span>
                <span className="text-sm text-green-400">Active</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[hsl(220,50%,18%)]">
                <span className="text-sm text-[hsl(220,10%,65%)]">AI Resolutions</span>
                <span className="text-sm text-[hsl(220,10%,45%)]">—</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[hsl(220,10%,65%)]">Usage Billing</span>
                <span className="text-sm text-[hsl(220,10%,45%)]">Not supported</span>
              </div>
            </div>

            {showStripeGap && (
              <div className="absolute inset-0 bg-[hsl(220,70%,8%,0.7)] flex items-center justify-center animate-[fadeIn_0.5s_ease-in]">
                <div className="text-center">
                  <HelpCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-400 font-semibold text-lg">
                    How do you charge for this?
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
