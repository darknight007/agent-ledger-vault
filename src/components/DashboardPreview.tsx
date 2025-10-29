import { Card } from "@/components/ui/card";
import { TrendingUp, Activity } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <div className="relative">
      <Card className="p-6 bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Agent View</h3>
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-1">KYC Agent v2.1</h4>
            <p className="text-sm text-muted-foreground">Customer Onboarding</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Actions</p>
              <p className="text-2xl font-bold">12,480</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Token Cost</p>
              <p className="text-2xl font-bold">$4,320</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-accent">$29,600</p>
            </div>
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Margin</p>
                  <p className="text-2xl font-bold text-accent">85%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                ✓ Invoiced
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
