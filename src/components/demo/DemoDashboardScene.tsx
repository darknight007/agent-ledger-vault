import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";
import { DEMO_DASHBOARD } from "@/lib/demo-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { DollarSign, Zap, TrendingUp } from "lucide-react";

interface Props {
  isActive: boolean;
}

export const DemoDashboardScene = ({ isActive }: Props) => {
  const revenue = useCountUp({ end: DEMO_DASHBOARD.revenue, prefix: "$", enabled: isActive, duration: 1000, decimals: 0 });
  const cost = useCountUp({ end: DEMO_DASHBOARD.aiCost, prefix: "$", enabled: isActive, duration: 1000, delay: 200, decimals: 0 });
  const margin = useCountUp({ end: DEMO_DASHBOARD.margin, suffix: "%", enabled: isActive, duration: 1000, delay: 400, decimals: 0 });

  const metrics = [
    { label: "Revenue", value: revenue.formatted, icon: DollarSign, accent: true, sub: "/month" },
    { label: "AI Cost", value: cost.formatted, icon: Zap, accent: false, sub: "/month" },
    { label: "Margin", value: margin.formatted, icon: TrendingUp, accent: true, sub: "gross" },
  ];

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="max-w-4xl w-full space-y-6">
        <h2
          className="text-xl font-semibold text-white"
          style={{ fontFamily: "'Space Grotesk', system-ui" }}
        >
          Real-Time Economics
        </h2>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map(({ label, value, icon: Icon, accent, sub }) => (
            <Card
              key={label}
              className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4 w-4 ${accent ? "text-[hsl(158,64%,52%)]" : "text-[hsl(220,10%,55%)]"}`} />
                <span className="text-xs text-[hsl(220,10%,55%)] uppercase tracking-wider">{label}</span>
              </div>
              <div className={`text-3xl font-bold ${accent ? "text-[hsl(158,64%,52%)]" : "text-white"}`} style={{ fontFamily: "'Space Grotesk', system-ui" }}>
                {value}
              </div>
              <span className="text-xs text-[hsl(220,10%,40%)]">{sub}</span>
            </Card>
          ))}
        </div>

        {/* Revenue vs Cost Chart */}
        <Card className="bg-[hsl(220,60%,10%)] border-[hsl(220,50%,18%)] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[hsl(220,10%,65%)]">Revenue vs AI Cost</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-[hsl(158,64%,52%)]" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[hsl(220,10%,55%)]">
                <span className="w-3 h-1 rounded bg-[hsl(220,50%,35%)]" />
                AI Cost
              </span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_DASHBOARD.revenueChart}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(220,10%,45%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(220,10%,45%)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220, 60%, 10%)",
                    border: "1px solid hsl(220, 50%, 20%)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`$${value}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(158, 64%, 52%)"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="hsl(220, 50%, 35%)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <p className="text-sm text-[hsl(220,10%,55%)] text-center">
          Pricing becomes data-driven instead of guesswork.
        </p>
      </div>
    </div>
  );
};
