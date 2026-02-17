import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEMO_TERMINAL_EVENTS } from "@/lib/demo-data";
import { Rocket, CheckCircle, Terminal } from "lucide-react";

interface Props {
  isActive: boolean;
  autoplay: boolean;
}

export const DemoDeployScene = ({ isActive, autoplay }: Props) => {
  const [deployed, setDeployed] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDeployed(false);
      setVisibleEvents(0);
      return;
    }

    if (!autoplay) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setDeployed(true), 2000));

    DEMO_TERMINAL_EVENTS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleEvents(i + 1), 4000 + i * 1200));
    });

    return () => timers.forEach(clearTimeout);
  }, [isActive, autoplay]);

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-4xl w-full space-y-6">
        {/* Deploy button + status */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setDeployed(true)}
            disabled={deployed}
            className={`px-8 py-3 text-base font-semibold transition-all duration-300 ${
              deployed
                ? "bg-[hsl(158,64%,52%,0.15)] text-[hsl(158,64%,52%)] border border-[hsl(158,64%,52%,0.3)]"
                : "bg-[hsl(158,64%,52%)] text-[hsl(220,70%,8%)] hover:bg-[hsl(158,64%,45%)]"
            }`}
          >
            {deployed ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Deployed
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Deploy to Production
              </span>
            )}
          </Button>
          {deployed && (
            <span className="text-sm text-[hsl(158,64%,52%)] animate-[fadeIn_0.3s_ease-in]">
              Pricing rule is live
            </span>
          )}
        </div>

        {/* SDK Code Snippet */}
        <Card className="bg-[hsl(220,70%,6%)] border-[hsl(220,50%,18%)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(220,50%,10%)] border-b border-[hsl(220,50%,18%)]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[hsl(0,60%,50%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(45,80%,55%)]" />
              <span className="w-3 h-3 rounded-full bg-[hsl(120,50%,45%)]" />
            </div>
            <span className="text-xs text-[hsl(220,10%,45%)] ml-2">your_app.py</span>
          </div>
          <div className="p-5 font-mono text-sm leading-relaxed">
            <div className="text-[hsl(220,10%,40%)]"># One line. That's it.</div>
            <div className="mt-2">
              <span className="text-[hsl(200,80%,65%)]">scrooge</span>
              <span className="text-white">.</span>
              <span className="text-[hsl(45,80%,65%)]">track</span>
              <span className="text-white">(</span>
              <span
                className={`text-[hsl(158,64%,65%)] transition-all duration-500 ${
                  deployed ? "bg-[hsl(158,64%,52%,0.15)] px-1 rounded" : ""
                }`}
              >
                "ticket_resolved"
              </span>
              <span className="text-white">)</span>
            </div>
          </div>
        </Card>

        {/* Live Event Stream */}
        {deployed && (
          <Card className="bg-[hsl(220,70%,6%)] border-[hsl(220,50%,18%)] overflow-hidden animate-[fadeSlideUp_0.4s_ease-out]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(220,50%,10%)] border-b border-[hsl(220,50%,18%)]">
              <Terminal className="h-3.5 w-3.5 text-[hsl(158,64%,52%)]" />
              <span className="text-xs text-[hsl(220,10%,45%)]">Event Stream</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[hsl(158,64%,52%)] animate-pulse" />
                <span className="text-xs text-[hsl(158,64%,52%)]">Live</span>
              </span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5 max-h-40 overflow-hidden">
              {DEMO_TERMINAL_EVENTS.slice(0, visibleEvents).map((evt, i) => (
                <div key={i} className="flex gap-3 animate-[fadeIn_0.3s_ease-in]">
                  <span className="text-[hsl(220,10%,35%)] shrink-0">{evt.time}</span>
                  <span className={evt.event.includes("accepted") ? "text-[hsl(158,64%,52%)]" : "text-[hsl(220,10%,65%)]"}>
                    {evt.event}
                  </span>
                </div>
              ))}
              {visibleEvents > 0 && (
                <div className="flex gap-1 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(158,64%,52%)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(158,64%,52%)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(158,64%,52%)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
