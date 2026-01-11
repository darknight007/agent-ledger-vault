import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Download, Settings, AlertTriangle, TrendingUp, Info } from "lucide-react";

interface PricingCalculatorProps {
  blueprint?: string;
}

type PricingModel =
  | "Tiered Usage Bundles"
  | "Seat + Usage Hybrid"
  | "JTBD Pricing"
  | "Outcome-Weighted Hybrid"
  | "ROI-Anchored Enterprise";

type TierPlan = "Starter" | "Pro" | "Scale";
type JTBDType = "Market Scan" | "Competitor Deep Dive" | "Lead Research Pack";

interface CalculatorInputs {
  monthlyCustomers: number;
  reportsPerCustomer: number;
  pricingModel: PricingModel;
  // Tiered Usage Bundles
  selectedTier?: TierPlan;
  // Seat + Usage Hybrid
  seatCount?: number;
  // JTBD Pricing
  jtbdType?: JTBDType;
  // Outcome-Weighted Hybrid
  outcomeRate?: number;
  outcomeBonus?: number;
  baseSubscription?: number;
  // ROI-Anchored Enterprise
  roiPercentage?: number;
  hoursSaved?: number;
  hourlyValue?: number;
}

interface Assumptions {
  infrastructureCostPerCustomer: number;
  llmTokenCostPerReport: number;
  apiCostPerReport: number; // Moved here from inputs
  growthRate: number;
  churnRate: number;
  fixedMonthlyExpenses: number;
  // Model-specific assumptions
  seatUsageIncludedReports?: number; // For Seat + Usage Hybrid only
  overageRate?: number; // For Seat + Usage Hybrid
  // JTBD pricing & frequency
  jtbdPricing?: {
    "Market Scan": { price: number; avgReports: number; frequency: number };
    "Competitor Deep Dive": { price: number; avgReports: number; frequency: number };
    "Lead Research Pack": { price: number; avgReports: number; frequency: number };
  };
}

// Tier definitions for Tiered Usage Bundles
const TIER_PLANS = {
  Starter: { reports: 20, price: 29 },
  Pro: { reports: 100, price: 99 },
  Scale: { reports: 300, price: 249 },
};

export const PricingCalculator = ({ blueprint = "researcher-agent" }: PricingCalculatorProps) => {
  const { toast } = useToast();

  // Default inputs
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyCustomers: 50,
    reportsPerCustomer: 20,
    pricingModel: "Tiered Usage Bundles",
    selectedTier: "Pro",
    seatCount: 1,
    jtbdType: "Market Scan",
    outcomeRate: 60,
    outcomeBonus: 10,
    baseSubscription: 39,
    roiPercentage: 15,
    hoursSaved: 10,
    hourlyValue: 100,
  });

  const [assumptions, setAssumptions] = useState<Assumptions>({
    infrastructureCostPerCustomer: 2.00,
    llmTokenCostPerReport: 0.15,
    apiCostPerReport: 0.05, // Moved from inputs
    growthRate: 20,
    churnRate: 5,
    fixedMonthlyExpenses: 2000,
    seatUsageIncludedReports: 50, // For Seat + Usage Hybrid
    overageRate: 1.0,
    jtbdPricing: {
      "Market Scan": { price: 29, avgReports: 10, frequency: 1 },
      "Competitor Deep Dive": { price: 79, avgReports: 25, frequency: 1 },
      "Lead Research Pack": { price: 99, avgReports: 30, frequency: 1 },
    },
  });

  const [showAssumptions, setShowAssumptions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  // Update reports per customer when switching to Seat + Usage Hybrid
  useEffect(() => {
    if (inputs.pricingModel === "Seat + Usage Hybrid") {
      setInputs(prev => ({
        ...prev,
        reportsPerCustomer: assumptions.seatUsageIncludedReports || 50
      }));
    }
  }, [inputs.pricingModel, assumptions.seatUsageIncludedReports]);

  // Analytics tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pricing_calculator_viewed', {
        blueprint,
        referrer: document.referrer,
      });
    }
  }, [blueprint]);

  const trackSliderChange = useCallback((sliderName: string, newValue: number | string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'slider_changed', {
        slider_name: sliderName,
        new_value: newValue,
      });
    }
  }, []);

  const trackModelSelection = useCallback((selectedModel: PricingModel) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'model_selected', {
        selected_model: selectedModel,
      });
    }
  }, []);

  // Calculations
  const calculations = (() => {
    const {
      monthlyCustomers,
      reportsPerCustomer,
      pricingModel,
      selectedTier,
      seatCount,
      jtbdType,
      outcomeRate,
      outcomeBonus,
      baseSubscription,
      roiPercentage,
      hoursSaved,
      hourlyValue,
    } = inputs;
    const {
      infrastructureCostPerCustomer,
      llmTokenCostPerReport,
      apiCostPerReport,
      growthRate,
      churnRate,
      fixedMonthlyExpenses,
      seatUsageIncludedReports,
      overageRate,
      jtbdPricing,
    } = assumptions;

    // COGS calculations
    const cogsPerReport = llmTokenCostPerReport + apiCostPerReport;
    const cogsPerCustomer = reportsPerCustomer * cogsPerReport + infrastructureCostPerCustomer;
    const totalReportsPerMonth = monthlyCustomers * reportsPerCustomer;

    let arpu = 0;
    let displayMetrics: any = {};

    // Model-specific calculations
    switch (pricingModel) {
      case "Tiered Usage Bundles": {
        const tier = TIER_PLANS[selectedTier || "Pro"];
        arpu = tier.price;
        const tierCOGS = tier.reports * cogsPerReport + infrastructureCostPerCustomer;
        const effectivePerReport = tier.price / tier.reports;
        const grossMargin = ((tier.price - tierCOGS) / tier.price) * 100;

        displayMetrics = {
          plan: selectedTier,
          reportsIncluded: tier.reports,
          effectivePerReport: effectivePerReport.toFixed(2),
          tierCOGS: tierCOGS.toFixed(2),
          grossMargin: grossMargin.toFixed(1),
        };
        break;
      }

      case "Seat + Usage Hybrid": {
        const basePlatformFee = 49;
        const includedReports = seatUsageIncludedReports || 50;
        const overage = Math.max(0, reportsPerCustomer - includedReports);
        const overageCharge = overage * (overageRate || 1.0);
        arpu = (basePlatformFee + overageCharge) * (seatCount || 1);

        const totalCOGS = reportsPerCustomer * cogsPerReport + infrastructureCostPerCustomer;
        const grossMargin = ((arpu - totalCOGS) / arpu) * 100;

        displayMetrics = {
          baseFee: basePlatformFee,
          seats: seatCount || 1,
          includedReports,
          overage,
          overageCharge: overageCharge.toFixed(2),
          totalRevenue: arpu.toFixed(2),
          totalCOGS: totalCOGS.toFixed(2),
          grossMargin: grossMargin.toFixed(1),
        };
        break;
      }

      case "JTBD Pricing": {
        const jobConfig = jtbdPricing?.[jtbdType || "Market Scan"] || { price: 29, avgReports: 10, frequency: 1 };
        const monthlyRevenue = jobConfig.price * jobConfig.frequency;
        arpu = monthlyRevenue;
        const jobCOGS = jobConfig.avgReports * cogsPerReport * jobConfig.frequency;
        const grossMargin = ((monthlyRevenue - jobCOGS) / monthlyRevenue) * 100;

        displayMetrics = {
          jobType: jtbdType,
          pricePerJob: jobConfig.price,
          frequency: jobConfig.frequency,
          monthlyRevenue,
          avgReports: jobConfig.avgReports,
          jobCOGS: jobCOGS.toFixed(2),
          grossMargin: grossMargin.toFixed(1),
        };
        break;
      }

      case "Outcome-Weighted Hybrid": {
        const base = baseSubscription || 39;
        const includedReports = 20;
        const avgOutcomeBonus = (outcomeBonus || 10) * ((outcomeRate || 60) / 100);
        arpu = base + avgOutcomeBonus;

        // Fixed: Consider ALL reports for COGS, not just verified ones
        const totalCOGS = includedReports * cogsPerReport + infrastructureCostPerCustomer;
        const grossProfit = arpu - totalCOGS;
        const grossMargin = (grossProfit / arpu) * 100;

        displayMetrics = {
          baseSubscription: base,
          includedReports,
          outcomeBonus: outcomeBonus || 10,
          outcomeRate: outcomeRate || 60,
          avgOutcomeBonus: avgOutcomeBonus.toFixed(2),
          totalRevenue: arpu.toFixed(2),
          totalCOGS: totalCOGS.toFixed(2),
          grossProfit: grossProfit.toFixed(2),
          grossMargin: grossMargin.toFixed(1),
          marginCalculation: `(Revenue ${arpu.toFixed(2)} - COGS ${totalCOGS.toFixed(2)}) / Revenue ${arpu.toFixed(2)} × 100 = ${grossMargin.toFixed(1)}%`,
        };
        break;
      }

      case "ROI-Anchored Enterprise": {
        const monthlyValue = (hoursSaved || 10) * (hourlyValue || 100);
        arpu = monthlyValue * ((roiPercentage || 15) / 100);

        const estimatedReports = 20; // Assumed for ROI model
        const totalCOGS = estimatedReports * cogsPerReport + infrastructureCostPerCustomer;
        const grossMargin = ((arpu - totalCOGS) / arpu) * 100;

        displayMetrics = {
          hoursSaved: hoursSaved || 10,
          hourlyValue: hourlyValue || 100,
          monthlyValue,
          roiPercentage: roiPercentage || 15,
          pricePerSeat: arpu.toFixed(2),
          estimatedCOGS: totalCOGS.toFixed(2),
          grossMargin: grossMargin.toFixed(1),
        };
        break;
      }
    }

    // MRR calculations
    const month1Customers = monthlyCustomers;
    const month1Revenue = month1Customers * arpu;

    // Month 6 calculation: Start with month 1, apply growth/churn for 5 months
    let customersAtMonth6 = month1Customers;
    for (let i = 0; i < 5; i++) {
      const newCustomers = customersAtMonth6 * (growthRate / 100);
      const churnedCustomers = customersAtMonth6 * (churnRate / 100);
      customersAtMonth6 = customersAtMonth6 + newCustomers - churnedCustomers;
    }
    const month6Revenue = customersAtMonth6 * arpu;
    const month6Calculation = `Starting: ${month1Customers} customers. Each month: +${growthRate}% growth, -${churnRate}% churn. After 5 months: ${Math.round(customersAtMonth6)} customers × $${arpu.toFixed(2)} ARPU = $${Math.round(month6Revenue).toLocaleString()}`;

    // Breakeven: customers needed so gross profit covers fixed expenses
    const grossProfitPerCustomer = arpu - cogsPerCustomer;
    const breakevenCustomers = grossProfitPerCustomer > 0
      ? Math.ceil(fixedMonthlyExpenses / grossProfitPerCustomer)
      : Infinity;
    const breakevenCalculation = `Fixed expenses $${fixedMonthlyExpenses} ÷ Gross profit per customer $${grossProfitPerCustomer.toFixed(2)} = ${breakevenCustomers} customers`;

    // Runway to $10K MRR
    let active = month1Customers;
    let runwayMRR = active * arpu;
    let runwayMonths = 0;
    while (runwayMRR < 10000 && runwayMonths < 120) {
      runwayMonths++;
      const newC = active * (growthRate / 100);
      const churnC = active * (churnRate / 100);
      active = active + newC - churnC;
      runwayMRR = active * arpu;
    }
    const runwayCalculation = `Starting ${month1Customers} customers at $${arpu.toFixed(2)} ARPU. With ${growthRate}% growth and ${churnRate}% churn monthly, reaching $10K MRR in ${runwayMonths} months with ${Math.round(active)} customers.`;

    return {
      totalReportsPerMonth,
      cogsPerCustomer,
      cogsPerReport,
      arpu,
      month1Revenue,
      month6Revenue,
      month6Calculation,
      customersAtMonth6: Math.round(customersAtMonth6),
      breakevenCustomers,
      breakevenCalculation,
      runwayMonths: runwayMRR >= 10000 ? runwayMonths : 'N/A',
      runwayCalculation,
      grossProfitPerCustomer,
      displayMetrics,
    };
  })();

  // Handle input changes
  const handleInputChange = useCallback((key: keyof CalculatorInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      if (key !== 'pricingModel') {
        trackSliderChange(key, value);
      }
    }, 300);
    setDebounceTimer(timer);
  }, [debounceTimer, trackSliderChange]);

  const handleModelChange = (model: PricingModel) => {
    setInputs(prev => ({ ...prev, pricingModel: model }));
    trackModelSelection(model);
  };

  // Model descriptions
  const getModelDescription = () => {
    switch (inputs.pricingModel) {
      case "Tiered Usage Bundles":
        return "Sell bundles of reports, not per-report pricing. Anchors value at plan level. Best for fast self-serve adoption.";
      case "Seat + Usage Hybrid":
        return "Platform fee + usage allowance with aggressive overage pricing. Strong for teams and collaborative workflows.";
      case "JTBD Pricing":
        return "Price research jobs, not reports. Buyers understand value instantly. Strong differentiation vs generic AI tools.";
      case "Outcome-Weighted Hybrid":
        return "Base subscription + outcome bonus. Protects margin while capturing upside from customer success.";
      case "ROI-Anchored Enterprise":
        return "Price as 10-20% of quantified value delivered. For customers with proven ROI and sales motion.";
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Model Description */}
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>{inputs.pricingModel}:</strong> {getModelDescription()}
          </AlertDescription>
        </Alert>

        {/* Input Controls */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pricing Model Selector */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3">
              <Label className="text-sm font-medium">Pricing Model</Label>
            </CardHeader>
            <CardContent>
              <Select value={inputs.pricingModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiered Usage Bundles">Tiered Usage Bundles</SelectItem>
                  <SelectItem value="Seat + Usage Hybrid">Seat + Usage Hybrid</SelectItem>
                  <SelectItem value="JTBD Pricing">JTBD Pricing</SelectItem>
                  <SelectItem value="Outcome-Weighted Hybrid">Outcome-Weighted Hybrid</SelectItem>
                  <SelectItem value="ROI-Anchored Enterprise">ROI-Anchored Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Monthly Customers */}
          <Card>
            <CardHeader className="pb-3">
              <Label className="text-sm font-medium">Monthly paying customers</Label>
              <div className="text-2xl font-bold text-accent">{inputs.monthlyCustomers}</div>
            </CardHeader>
            <CardContent>
              <Slider
                value={[inputs.monthlyCustomers]}
                onValueChange={([value]) => handleInputChange('monthlyCustomers', value)}
                min={10}
                max={1000}
                step={10}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Number of paying customers in month 1
              </p>
            </CardContent>
          </Card>

          {/* Model-Specific Inputs */}
          {inputs.pricingModel === "Tiered Usage Bundles" && (
            <Card>
              <CardHeader className="pb-3">
                <Label className="text-sm font-medium">Selected Tier</Label>
              </CardHeader>
              <CardContent>
                <Select
                  value={inputs.selectedTier}
                  onValueChange={(value: TierPlan) => handleInputChange('selectedTier', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter (20 reports @ $29)</SelectItem>
                    <SelectItem value="Pro">Pro (100 reports @ $99)</SelectItem>
                    <SelectItem value="Scale">Scale (300 reports @ $249)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Choose the plan tier for analysis
                </p>
              </CardContent>
            </Card>
          )}

          {inputs.pricingModel === "Seat + Usage Hybrid" && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Seat Count</Label>
                  <div className="text-2xl font-bold text-accent">{inputs.seatCount}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.seatCount || 1]}
                    onValueChange={([value]) => handleInputChange('seatCount', value)}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Number of seats per customer
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Reports per seat</Label>
                  <div className="text-2xl font-bold text-accent">{inputs.reportsPerCustomer}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.reportsPerCustomer]}
                    onValueChange={([value]) => handleInputChange('reportsPerCustomer', value)}
                    min={assumptions.seatUsageIncludedReports || 50}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {assumptions.seatUsageIncludedReports || 50} included, ${assumptions.overageRate || 1}/report overage
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {inputs.pricingModel === "JTBD Pricing" && (
            <Card>
              <CardHeader className="pb-3">
                <Label className="text-sm font-medium">Job Type</Label>
              </CardHeader>
              <CardContent>
                <Select
                  value={inputs.jtbdType}
                  onValueChange={(value: JTBDType) => handleInputChange('jtbdType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Market Scan">
                      Market Scan (${assumptions.jtbdPricing?.["Market Scan"].price || 29})
                    </SelectItem>
                    <SelectItem value="Competitor Deep Dive">
                      Competitor Deep Dive (${assumptions.jtbdPricing?.["Competitor Deep Dive"].price || 79})
                    </SelectItem>
                    <SelectItem value="Lead Research Pack">
                      Lead Research Pack (${assumptions.jtbdPricing?.["Lead Research Pack"].price || 99})
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Research job to be done (customize in assumptions)
                </p>
              </CardContent>
            </Card>
          )}

          {inputs.pricingModel === "Outcome-Weighted Hybrid" && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Base Subscription ($)</Label>
                  <div className="text-2xl font-bold text-accent">${inputs.baseSubscription}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.baseSubscription || 39]}
                    onValueChange={([value]) => handleInputChange('baseSubscription', value)}
                    min={10}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Monthly base subscription fee
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Outcome Rate (%)</Label>
                  <div className="text-2xl font-bold text-accent">{inputs.outcomeRate}%</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.outcomeRate || 60]}
                    onValueChange={([value]) => handleInputChange('outcomeRate', value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    % of reports producing verified outcomes
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Outcome Bonus ($)</Label>
                  <div className="text-2xl font-bold text-accent">${inputs.outcomeBonus}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.outcomeBonus || 10]}
                    onValueChange={([value]) => handleInputChange('outcomeBonus', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Bonus per verified outcome
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {inputs.pricingModel === "ROI-Anchored Enterprise" && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Hours Saved/Month</Label>
                  <div className="text-2xl font-bold text-accent">{inputs.hoursSaved}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.hoursSaved || 10]}
                    onValueChange={([value]) => handleInputChange('hoursSaved', value)}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Research time saved per month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">Hourly Value ($)</Label>
                  <div className="text-2xl font-bold text-accent">${inputs.hourlyValue}</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.hourlyValue || 100]}
                    onValueChange={([value]) => handleInputChange('hourlyValue', value)}
                    min={50}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Customer's hourly labor cost
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Label className="text-sm font-medium">ROI % Captured</Label>
                  <div className="text-2xl font-bold text-accent">{inputs.roiPercentage}%</div>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={[inputs.roiPercentage || 15]}
                    onValueChange={([value]) => handleInputChange('roiPercentage', value)}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    % of value delivered as price
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Output Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Pricing & Revenue */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Pricing & Revenue</h3>

            {/* Model-Specific Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{inputs.pricingModel} Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inputs.pricingModel === "Tiered Usage Bundles" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-semibold">{calculations.displayMetrics.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports included:</span>
                      <span className="font-semibold">{calculations.displayMetrics.reportsIncluded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Effective $/report:</span>
                      <span className="font-semibold">${calculations.displayMetrics.effectivePerReport}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">ARPU:</span>
                      <span className="font-semibold text-accent">${calculations.arpu.toFixed(2)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Margin:</span>
                      <span className="font-semibold text-accent">{calculations.displayMetrics.grossMargin}%</span>
                    </div>
                  </>
                )}

                {inputs.pricingModel === "Seat + Usage Hybrid" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base fee/seat:</span>
                      <span className="font-semibold">${calculations.displayMetrics.baseFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats:</span>
                      <span className="font-semibold">{calculations.displayMetrics.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included reports:</span>
                      <span className="font-semibold">{calculations.displayMetrics.includedReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overage reports:</span>
                      <span className="font-semibold">{calculations.displayMetrics.overage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overage charge:</span>
                      <span className="font-semibold">${calculations.displayMetrics.overageCharge}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Total Revenue:</span>
                      <span className="font-semibold text-accent">${calculations.displayMetrics.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Margin:</span>
                      <span className="font-semibold text-accent">{calculations.displayMetrics.grossMargin}%</span>
                    </div>
                  </>
                )}

                {inputs.pricingModel === "JTBD Pricing" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Type:</span>
                      <span className="font-semibold">{calculations.displayMetrics.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per job:</span>
                      <span className="font-semibold">${calculations.displayMetrics.pricePerJob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency/month:</span>
                      <span className="font-semibold">{calculations.displayMetrics.frequency}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly revenue:</span>
                      <span className="font-semibold text-accent">${calculations.displayMetrics.monthlyRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg reports/job:</span>
                      <span className="font-semibold">{calculations.displayMetrics.avgReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly COGS:</span>
                      <span className="font-semibold">${calculations.displayMetrics.jobCOGS}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Gross Margin:</span>
                      <span className="font-semibold text-accent">{calculations.displayMetrics.grossMargin}%</span>
                    </div>
                  </>
                )}

                {inputs.pricingModel === "Outcome-Weighted Hybrid" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base subscription:</span>
                      <span className="font-semibold">${calculations.displayMetrics.baseSubscription}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Included reports:</span>
                      <span className="font-semibold">{calculations.displayMetrics.includedReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outcome rate:</span>
                      <span className="font-semibold">{calculations.displayMetrics.outcomeRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus/outcome:</span>
                      <span className="font-semibold">${calculations.displayMetrics.outcomeBonus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg outcome bonus:</span>
                      <span className="font-semibold">${calculations.displayMetrics.avgOutcomeBonus}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Total ARPU:</span>
                      <span className="font-semibold text-accent">${calculations.displayMetrics.totalRevenue}/mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gross Margin:</span>
                      <span className="font-semibold text-accent">
                        {calculations.displayMetrics.grossMargin}%
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <sup className="ml-0.5 inline-block">
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </sup>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{calculations.displayMetrics.marginCalculation}</p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    </div>
                  </>
                )}

                {inputs.pricingModel === "ROI-Anchored Enterprise" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hours saved/mo:</span>
                      <span className="font-semibold">{calculations.displayMetrics.hoursSaved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly value:</span>
                      <span className="font-semibold">${calculations.displayMetrics.hourlyValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly value:</span>
                      <span className="font-semibold">${calculations.displayMetrics.monthlyValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI % captured:</span>
                      <span className="font-semibold">{calculations.displayMetrics.roiPercentage}%</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Price/seat:</span>
                      <span className="font-semibold text-accent">${calculations.displayMetrics.pricePerSeat}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Margin:</span>
                      <span className="font-semibold text-accent">{calculations.displayMetrics.grossMargin}%</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Monthly Revenue Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Revenue Projection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Month 1 MRR:</span>
                  <span className="font-semibold">${Math.round(calculations.month1Revenue).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Month 6 MRR:</span>
                  <span className="font-semibold">
                    ${Math.round(calculations.month6Revenue).toLocaleString()}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <sup className="ml-0.5 inline-block">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </sup>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">{calculations.month6Calculation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on {inputs.monthlyCustomers} customers @ ${calculations.arpu.toFixed(2)} ARPU
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Cost Breakdown */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Cost Analysis</h3>

            {/* COGS Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">COGS Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LLM tokens/report:</span>
                    <span>${assumptions.llmTokenCostPerReport.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">APIs/report:</span>
                    <span>${assumptions.apiCostPerReport.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Infrastructure/customer:</span>
                    <span>${assumptions.infrastructureCostPerCustomer.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total COGS/report:</span>
                  <span className="font-semibold">${calculations.cogsPerReport.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Breakeven Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Breakeven Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Breakeven customers:</span>
                  <span className="font-semibold">
                    {calculations.breakevenCustomers}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <sup className="ml-0.5 inline-block">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </sup>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{calculations.breakevenCalculation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Runway to $10K MRR:</span>
                  <span className="font-semibold">
                    {calculations.runwayMonths} months
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <sup className="ml-0.5 inline-block">
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </sup>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-xs">{calculations.runwayCalculation}</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {assumptions.growthRate}% MoM growth, {assumptions.churnRate}% churn
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Dialog open={showAssumptions} onOpenChange={setShowAssumptions}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Assumptions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Assumptions</DialogTitle>
                <DialogDescription>
                  Customize the underlying assumptions for your calculations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* General Assumptions */}
                <div className="font-semibold text-sm border-b pb-2">General Assumptions</div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="infra-cost" className="text-right text-sm">
                    Infra cost/customer ($)
                  </Label>
                  <Input
                    id="infra-cost"
                    type="number"
                    step="0.01"
                    value={assumptions.infrastructureCostPerCustomer}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, infrastructureCostPerCustomer: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="llm-cost" className="text-right text-sm">
                    LLM cost/report ($)
                  </Label>
                  <Input
                    id="llm-cost"
                    type="number"
                    step="0.01"
                    value={assumptions.llmTokenCostPerReport}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, llmTokenCostPerReport: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-cost" className="text-right text-sm">
                    API cost/report ($)
                  </Label>
                  <Input
                    id="api-cost"
                    type="number"
                    step="0.01"
                    value={assumptions.apiCostPerReport}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, apiCostPerReport: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="growth-rate" className="text-right text-sm">
                    Monthly growth (%)
                  </Label>
                  <Input
                    id="growth-rate"
                    type="number"
                    value={assumptions.growthRate}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, growthRate: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="churn-rate" className="text-right text-sm">
                    Monthly churn (%)
                  </Label>
                  <Input
                    id="churn-rate"
                    type="number"
                    value={assumptions.churnRate}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, churnRate: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fixed-expense" className="text-right text-sm">
                    Fixed expenses ($)
                  </Label>
                  <Input
                    id="fixed-expense"
                    type="number"
                    value={assumptions.fixedMonthlyExpenses}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, fixedMonthlyExpenses: parseFloat(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
                </div>

                {/* Seat + Usage Hybrid Assumptions */}
                {inputs.pricingModel === "Seat + Usage Hybrid" && (
                  <>
                    <div className="font-semibold text-sm border-b pb-2 mt-4">Seat + Usage Model</div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="included-reports" className="text-right text-sm">
                        Included reports/seat
                      </Label>
                      <Input
                        id="included-reports"
                        type="number"
                        value={assumptions.seatUsageIncludedReports}
                        onChange={(e) => setAssumptions(prev => ({ ...prev, seatUsageIncludedReports: parseFloat(e.target.value) || 50 }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="overage-rate" className="text-right text-sm">
                        Overage rate ($/report)
                      </Label>
                      <Input
                        id="overage-rate"
                        type="number"
                        step="0.1"
                        value={assumptions.overageRate}
                        onChange={(e) => setAssumptions(prev => ({ ...prev, overageRate: parseFloat(e.target.value) || 1 }))}
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}

                {/* JTBD Pricing Assumptions */}
                {inputs.pricingModel === "JTBD Pricing" && (
                  <>
                    <div className="font-semibold text-sm border-b pb-2 mt-4">JTBD Pricing Configuration</div>
                    {(Object.keys(assumptions.jtbdPricing || {}) as JTBDType[]).map((jobType) => (
                      <div key={jobType} className="space-y-2 border-l-2 pl-4 border-muted">
                        <div className="font-medium text-sm">{jobType}</div>
                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label className="text-right text-xs col-span-1">Price ($)</Label>
                          <Input
                            type="number"
                            value={assumptions.jtbdPricing?.[jobType].price || 0}
                            onChange={(e) => setAssumptions(prev => ({
                              ...prev,
                              jtbdPricing: {
                                ...prev.jtbdPricing!,
                                [jobType]: {
                                  ...prev.jtbdPricing![jobType],
                                  price: parseFloat(e.target.value) || 0
                                }
                              }
                            }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label className="text-right text-xs col-span-1">Reports</Label>
                          <Input
                            type="number"
                            value={assumptions.jtbdPricing?.[jobType].avgReports || 0}
                            onChange={(e) => setAssumptions(prev => ({
                              ...prev,
                              jtbdPricing: {
                                ...prev.jtbdPricing!,
                                [jobType]: {
                                  ...prev.jtbdPricing![jobType],
                                  avgReports: parseFloat(e.target.value) || 0
                                }
                              }
                            }))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label className="text-right text-xs col-span-1">Freq/mo</Label>
                          <Input
                            type="number"
                            value={assumptions.jtbdPricing?.[jobType].frequency || 1}
                            onChange={(e) => setAssumptions(prev => ({
                              ...prev,
                              jtbdPricing: {
                                ...prev.jtbdPricing!,
                                [jobType]: {
                                  ...prev.jtbdPricing![jobType],
                                  frequency: parseFloat(e.target.value) || 1
                                }
                              }
                            }))}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
};
