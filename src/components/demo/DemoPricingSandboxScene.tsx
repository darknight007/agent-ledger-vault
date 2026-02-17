import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountUp } from "@/hooks/use-count-up";
import { useTypewriter } from "@/hooks/use-typewriter";
import { DEMO_SIMULATION, DEMO_METRICS } from "@/lib/demo-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Zap, DollarSign, TrendingUp, BarChart3, Settings, FileText, LayoutDashboard } from "lucide-react";

interface Props {
  isActive: boolean;
  autoplay: boolean;
}

type Phase = "form" | "simulating" | "results";

export const DemoPricingSandboxScene = ({ isActive, autoplay }: Props) => {
  const [phase, setPhase] = useState<Phase>("form");
  const [selectedMetric, setSelectedMetric] = useState("");
  const [price, setPrice] = useState("");

  // Autoplay: auto-fill fields and run simulation
  useEffect(() => {
    if (!isActive) {
      setPhase("form");
      setSelectedMetric("");
      setPrice("");
      return;
    }

    if (!autoplay) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSelectedMetric("ticket_resolved"), 1500));
    timers.push(setTimeout(() => setPrice("1.00"), 3500));
    timers.push(setTimeout(() => setPhase("simulating"), 6000));
    timers.push(setTimeout(() => setPhase("results"), 8000));
    return () => timers.forEach(clearTimeout);
  }, [isActive, autoplay]);

  const { displayed: priceTyped } = useTypewriter({
    text: "1.00",
    speed: 120,
    delay: 3500,
    enabled: isActive && autoplay,
  });

  const showResults = phase === "results";

  const revenueCount = useCountUp({ end: DEMO_SIMULATION.revenue, prefix: "$", enabled: showResults, duration: 800 });
  const costCount = useCountUp({ end: DEMO_SIMULATION.aiCost, prefix: "$", enabled: showResults, duration: 800, delay: 200 });
  const marginCount = useCountUp({ end: DEMO_SIMULATION.margin, suffix: "%", enabled: showResults, duration: 800, delay: 400 });

  const chartData = [
    { name: "Revenue", value: DEMO_SIMULATION.revenue, color: "hsl(158, 64%, 52%)" },
    { name: "AI Cost", value: DEMO_SIMULATION.aiCost, color: "hsl(220, 50%, 40%)" },
    { name: "Margin", value: DEMO_SIMULATION.marginAmount, color: "hsl(158, 64%, 42%)" },
  ];

  const handleRunSimulation = () => {
    setPhase("simulating");
    setTimeout(() => setPhase("results"), 2000);
  };

  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="max-w-6xl w-full flex gap-4">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-52 bg-[hsl(220,60%,8%)] border border-[hsl(220,50%,16%)] rounded-lg p-3 gap-1 shrink-0">
          <div className="text-xs font-semibold text-[hsl(220,10%,45%)] uppercase tracking-wider mb-2 px-2">
            Scrooge
          </div>
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: false },
            { icon: DollarSign, label: "Pricing", active: true },
            { icon: FileText, label: "Billing", active: false },
            { icon: BarChart3, label: "Analytics", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm ${
                active
                  ? "bg-[hsl(158,64%,52%,0.12)] text-[hsl(158,64%,52%)]"
                  : "text-[hsl(220,10%,55%)] hover:bg-[hsl(220,50%,12%)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
              Pricing Sandbox
            </h2>
            <span className="text-xs text-[hsl(220,10%,45%)] bg-[hsl(220,50%,12%)] px-2 py-1 rounded">
              Live Environment
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Form */}
            <Card className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-5">
              <h3 className="text-sm font-medium text-[hsl(220,10%,65%)] uppercase tracking-wider mb-4">
                Create Pricing Rule
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-[hsl(220,10%,65%)] text-xs mb-1.5 block">Billable Metric</Label>
                  <Select
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}
                  >
                    <SelectTrigger className="bg-[hsl(220,50%,12%)] border-[hsl(220,50%,20%)] text-white">
                      <SelectValue placeholder="Select metric..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,20%)]">
                      {DEMO_METRICS.map((m) => (
                        <SelectItem key={m.key} value={m.key} className="text-white">
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[hsl(220,10%,65%)] text-xs mb-1.5 block">Price per Event (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,45%)]">$</span>
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={autoplay ? priceTyped : price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-7 bg-[hsl(220,50%,12%)] border-[hsl(220,50%,20%)] text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleRunSimulation}
                  disabled={phase === "simulating"}
                  className="w-full bg-[hsl(158,64%,52%)] text-[hsl(220,70%,8%)] hover:bg-[hsl(158,64%,45%)] font-semibold"
                >
                  {phase === "simulating" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[hsl(220,70%,8%)] border-t-transparent rounded-full animate-spin" />
                      Simulating...
                    </span>
                  ) : (
                    "Run Simulation"
                  )}
                </Button>
              </div>
            </Card>

            {/* Results */}
            <Card className={`bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-5 transition-opacity duration-500 ${showResults ? "opacity-100" : "opacity-30"}`}>
              <h3 className="text-sm font-medium text-[hsl(220,10%,65%)] uppercase tracking-wider mb-4">
                Simulation Results
              </h3>
              {showResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Revenue/mo", value: revenueCount.formatted, icon: DollarSign, accent: true },
                      { label: "AI Cost/mo", value: costCount.formatted, icon: Zap, accent: false },
                      { label: "Margin", value: marginCount.formatted, icon: TrendingUp, accent: true },
                    ].map(({ label, value, icon: Icon, accent }) => (
                      <div key={label} className="bg-[hsl(220,50%,12%)] rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`h-3.5 w-3.5 ${accent ? "text-[hsl(158,64%,52%)]" : "text-[hsl(220,10%,55%)]"}`} />
                          <span className="text-[10px] text-[hsl(220,10%,55%)] uppercase">{label}</span>
                        </div>
                        <span className={`text-xl font-bold ${accent ? "text-[hsl(158,64%,52%)]" : "text-white"}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barSize={32}>
                        <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-[hsl(220,10%,35%)] text-sm">
                  Run simulation to see results
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
