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
import { Download, Settings, AlertTriangle, TrendingUp, Info, DollarSign, Users, Zap, Globe } from "lucide-react";

interface AiSdrPricingCalculatorProps {
  blueprint?: string;
}

type PricingModel =
  | "Tiered Prospect Bundles"
  | "Seat + Usage Hybrid"
  | "Job-to-Be-Done Pricing"
  | "Outcome-Weighted Hybrid"
  | "ROI-Anchored Enterprise";

type ResearchDepth = "light" | "standard" | "deep";

interface CalculatorInputs {
  pricingModel: PricingModel;
  researchDepth: ResearchDepth;
  prospectVolume: number;
  numSdrs: number;
  prospectsPerSdrMonth: number;
  lookupSuccessRate?: number;
  positiveReplyRate?: number;
  accountResearchBundles?: number;
  warmIntroFinders?: number;
  personalizedOutreachCount?: number;
  baseSubscription?: number;
  successBonusPerReply?: number;
  meetingValue?: number;
  replyBookingRate?: number;
}

interface Assumptions {
  cogsPerProspect: {
    light: number;
    standard: number;
    deep: number;
  };
  modelPricing: {
    starter: { prospects: number; price: number };
    growth: { prospects: number; price: number };
    scale: { prospects: number; price: number };
    seatBase: number;
    seatInclusion: number;
    seatOverage: number;
    accountResearchPrice: number;
    warmIntroPrice: number;
    personalizedOutreachPrice: number;
  };
}

interface CalculationResults {
  monthlyPrice: number;
  totalMonthlyRevenue: string;
  totalCogs: string;
  grossMargin: string;
  costPerProspect: number;
  costPerMeeting: number;
  meetingsPerMonth: number;
  netMonthlySavings: string;
  roiMultiple: string;
  paybackDays: number;
  displayMetrics: Record<string, string | number>;
}

export const AiSdrPricingCalculator = ({ blueprint = "ai-sdr-agent" }: AiSdrPricingCalculatorProps) => {
  const { toast } = useToast();

  const [inputs, setInputs] = useState<CalculatorInputs>({
    pricingModel: "Tiered Prospect Bundles",
    researchDepth: "standard",
    prospectVolume: 300,
    numSdrs: 5,
    prospectsPerSdrMonth: 150,
    lookupSuccessRate: 92,
    positiveReplyRate: 8,
    accountResearchBundles: 10,
    warmIntroFinders: 8,
    personalizedOutreachCount: 15,
    baseSubscription: 99,
    successBonusPerReply: 10,
    meetingValue: 500,
    replyBookingRate: 5,
  });

  const [assumptions, setAssumptions] = useState<Assumptions>({
    cogsPerProspect: {
      light: 0.15,
      standard: 0.28,
      deep: 0.40,
    },
    modelPricing: {
      starter: { prospects: 100, price: 39 },
      growth: { prospects: 300, price: 99 },
      scale: { prospects: 1000, price: 249 },
      seatBase: 79,
      seatInclusion: 150,
      seatOverage: 0.50,
      accountResearchPrice: 12,
      warmIntroPrice: 8,
      personalizedOutreachPrice: 15,
    },
  });

  const [showAssumptions, setShowAssumptions] = useState(false);

  // Analytics tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Window & { gtag: (event: string, eventName: string, data: Record<string, unknown>) => void }).gtag;
      gtag('event', 'pricing_calculator_viewed', {
        blueprint,
        referrer: document.referrer,
      });
    }
  }, [blueprint]);

  const trackModelSelection = useCallback((selectedModel: PricingModel) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as Window & { gtag: (event: string, eventName: string, data: Record<string, unknown>) => void }).gtag;
      gtag('event', 'sdr_model_selected', {
        selected_model: selectedModel,
      });
    }
  }, []);

  // Core calculations
  const calculations = (() => {
    const cogsPerProspect = assumptions.cogsPerProspect[inputs.researchDepth];
    let monthlyPrice = 0;
    let totalMonthlyRevenue = 0;
    let totalCogs = 0;
    let displayMetrics: Record<string, string | number> = {};
    let metricsForMeeting = { prospectCount: 0, meetingsGenerated: 0 };

    switch (inputs.pricingModel) {
      case "Tiered Prospect Bundles": {
        // Determine which tier the user falls into
        let tierPrice = 0;
        let tierName = "custom";
        
        if (inputs.prospectVolume <= assumptions.modelPricing.starter.prospects) {
          tierPrice = assumptions.modelPricing.starter.price;
          tierName = "Starter";
        } else if (inputs.prospectVolume <= assumptions.modelPricing.growth.prospects) {
          tierPrice = assumptions.modelPricing.growth.price;
          tierName = "Growth";
        } else {
          tierPrice = assumptions.modelPricing.scale.price;
          tierName = "Scale";
        }

        monthlyPrice = tierPrice;
        totalMonthlyRevenue = monthlyPrice;
        totalCogs = inputs.prospectVolume * cogsPerProspect;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;
        const costPerProspect = totalCogs / inputs.prospectVolume;

        displayMetrics = {
          tier: tierName,
          monthlyPrice: monthlyPrice.toFixed(0),
          prospectVolume: inputs.prospectVolume,
          costPerProspect: costPerProspect.toFixed(2),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        metricsForMeeting = {
          prospectCount: inputs.prospectVolume,
          meetingsGenerated: Math.floor(inputs.prospectVolume * ((inputs.positiveReplyRate || 8) / 100) * ((inputs.replyBookingRate || 5) / 100)),
        };
        break;
      }

      case "Seat + Usage Hybrid": {
        const baseCost = assumptions.modelPricing.seatBase * inputs.numSdrs;
        const overagePros = Math.max(0, inputs.prospectsPerSdrMonth * inputs.numSdrs - assumptions.modelPricing.seatInclusion * inputs.numSdrs);
        const overageCost = overagePros * assumptions.modelPricing.seatOverage;
        
        monthlyPrice = baseCost + overageCost;
        totalMonthlyRevenue = monthlyPrice;
        totalCogs = inputs.prospectsPerSdrMonth * inputs.numSdrs * cogsPerProspect;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;
        const costPerProspect = totalCogs / (inputs.prospectsPerSdrMonth * inputs.numSdrs);

        displayMetrics = {
          numSdrs: inputs.numSdrs,
          baseCost: baseCost.toFixed(0),
          overagePros: Math.max(0, overagePros).toFixed(0),
          overageCost: overageCost.toFixed(0),
          monthlyPrice: monthlyPrice.toFixed(0),
          prospectCount: (inputs.prospectsPerSdrMonth * inputs.numSdrs).toFixed(0),
          costPerProspect: costPerProspect.toFixed(2),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        metricsForMeeting = {
          prospectCount: inputs.prospectsPerSdrMonth * inputs.numSdrs,
          meetingsGenerated: Math.floor(inputs.prospectsPerSdrMonth * inputs.numSdrs * ((inputs.positiveReplyRate || 8) / 100) * ((inputs.replyBookingRate || 5) / 100)),
        };
        break;
      }

      case "Job-to-Be-Done Pricing": {
        // Model 3: Job-to-Be-Done Pricing
        // JTBDs: Account Research Pack ($12), Warm Intro Finder ($8), Personalised Outreach ($15)
        // Each job is a complete workflow, not credits
        
        const accountResearchBundles = inputs.accountResearchBundles || 10;
        const warmIntroFinders = inputs.warmIntroFinders || 8;
        const personalizedOutreachCount = inputs.personalizedOutreachCount || 15;
        
        const accountResearchRevenue = accountResearchBundles * assumptions.modelPricing.accountResearchPrice; // $12 each
        const warmIntroRevenue = warmIntroFinders * assumptions.modelPricing.warmIntroPrice; // $8 each
        const personalizedOutreachRevenue = personalizedOutreachCount * assumptions.modelPricing.personalizedOutreachPrice; // $15 each
        
        // Account Research Pack: Company + 3 personas + insights = 4 prospects researched
        // Warm Intro Finder: Mutuals + message draft = 2 prospects checked
        // Personalised Outreach: Research + custom message = 1 prospect researched
        const totalProspectsProcessed = (accountResearchBundles * 4) + (warmIntroFinders * 2) + (personalizedOutreachCount * 1);
        
        // COGS calculation: Each job has specific cost
        // Account Research: $0.60 COGS (4 prospects × $0.15 light research)
        // Warm Intro: $0.30 COGS (2 prospects × $0.15)
        // Personalised Outreach: $0.60 COGS (1 prospect deep research)
        const accountResearchCogs = accountResearchBundles * 0.60;
        const warmIntroCogs = warmIntroFinders * 0.30;
        const personalizedOutreachCogs = personalizedOutreachCount * 0.60;
        
        monthlyPrice = accountResearchRevenue + warmIntroRevenue + personalizedOutreachRevenue;
        totalMonthlyRevenue = monthlyPrice;
        totalCogs = accountResearchCogs + warmIntroCogs + personalizedOutreachCogs;
        const grossMargin = totalMonthlyRevenue > 0 ? ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100 : 0;

        // Individual job margins for transparency
        const accountResearchMargin = accountResearchRevenue > 0 ? ((accountResearchRevenue - accountResearchCogs) / accountResearchRevenue * 100).toFixed(1) : "0";
        const warmIntroMargin = warmIntroRevenue > 0 ? ((warmIntroRevenue - warmIntroCogs) / warmIntroRevenue * 100).toFixed(1) : "0";
        const personalizedOutreachMargin = personalizedOutreachRevenue > 0 ? ((personalizedOutreachRevenue - personalizedOutreachCogs) / personalizedOutreachRevenue * 100).toFixed(1) : "0";

        displayMetrics = {
          "Account Research Packs": accountResearchBundles,
          "Account Research Revenue": `$${accountResearchRevenue.toFixed(0)}`,
          "Account Research Margin": `${accountResearchMargin}%`,
          "Warm Intro Finders": warmIntroFinders,
          "Warm Intro Revenue": `$${warmIntroRevenue.toFixed(0)}`,
          "Warm Intro Margin": `${warmIntroMargin}%`,
          "Personalised Outreach": personalizedOutreachCount,
          "Personalised Outreach Revenue": `$${personalizedOutreachRevenue.toFixed(0)}`,
          "Personalised Outreach Margin": `${personalizedOutreachMargin}%`,
          "Total Monthly Revenue": `$${monthlyPrice.toFixed(0)}`,
          "Total COGS": `$${totalCogs.toFixed(2)}`,
          "Blended Gross Margin": `${grossMargin.toFixed(1)}%`,
        };

        metricsForMeeting = {
          prospectCount: totalProspectsProcessed,
          meetingsGenerated: Math.floor(totalProspectsProcessed * ((inputs.positiveReplyRate || 8) / 100) * ((inputs.replyBookingRate || 5) / 100)),
        };
        break;
      }

      case "Outcome-Weighted Hybrid": {
        // Model 4: Outcome-Weighted Hybrid
        // Base subscription (covers costs) + Success kicker (outcome bonus)
        // Never do pure outcome pricing - always have base to cover COGS
        // Example: $99/seat base + $10 per positive reply booked
        
        const numSdrs = inputs.numSdrs;
        const baseCostPerSeat = inputs.baseSubscription || 99;
        const baseCost = baseCostPerSeat * numSdrs;
        
        // Calculate expected replies from prospects
        const prospectsPerSdr = inputs.prospectsPerSdrMonth || 150;
        const totalProspectsProcessed = prospectsPerSdr * numSdrs;
        const positiveReplyRate = (inputs.positiveReplyRate || 8) / 100;
        const expectedReplies = totalProspectsProcessed * positiveReplyRate;
        
        // Success bonus per positive reply booked
        const successBonusPerReply = inputs.successBonusPerReply || 10;
        const successBonusRevenue = expectedReplies * successBonusPerReply;
        
        monthlyPrice = baseCost + successBonusRevenue;
        totalMonthlyRevenue = monthlyPrice;
        
        // COGS: Base covers the core AI cost (~$0.28 blended COGS per prospect)
        // Plus additional incentive cost from the success bonus program
        const coresAiCogs = totalProspectsProcessed * cogsPerProspect;
        const successIncentiveCost = expectedReplies * (successBonusPerReply * 0.3); // Assume 30% cost of bonus paid out
        totalCogs = coresAiCogs + successIncentiveCost;
        
        const grossMargin = totalMonthlyRevenue > 0 ? ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100 : 0;
        
        // Calculate what percentage of revenue comes from base vs outcome
        const baseRevenuePercent = (baseCost / monthlyPrice * 100).toFixed(1);
        const outcomeRevenuePercent = (successBonusRevenue / monthlyPrice * 100).toFixed(1);

        displayMetrics = {
          "Number of SDRs": numSdrs,
          "Base Price per SDR": `$${baseCostPerSeat}`,
          "Total Base Revenue": `$${baseCost.toFixed(0)}`,
          "Base Revenue %": `${baseRevenuePercent}%`,
          "Total Prospects Processed": totalProspectsProcessed,
          "Positive Reply Rate": `${inputs.positiveReplyRate || 8}%`,
          "Expected Replies": Math.floor(expectedReplies),
          "Success Bonus per Reply": `$${successBonusPerReply}`,
          "Total Success Bonus Revenue": `$${successBonusRevenue.toFixed(0)}`,
          "Outcome Revenue %": `${outcomeRevenuePercent}%`,
          "Total Monthly Revenue": `$${monthlyPrice.toFixed(0)}`,
          "Total COGS": `$${totalCogs.toFixed(0)}`,
          "Gross Margin": `${grossMargin.toFixed(1)}%`,
        };

        metricsForMeeting = {
          prospectCount: totalProspectsProcessed,
          meetingsGenerated: Math.floor(expectedReplies * ((inputs.replyBookingRate || 5) / 100)),
        };
        break;
      }

      case "ROI-Anchored Enterprise": {
        // Model 5: ROI-Anchored Enterprise Pricing
        // Used only when selling to RevOps / Sales leadership
        // Framing: 1 SDR → 30% more meetings
        // Avg meeting value = $500
        // Incremental value = $7,500 / month per SDR
        // Pricing anchor: Charge 10–15% of incremental value → $750–$1,000 / SDR / month
        // COGS ≈ $100, Margins ≈ 90%+
        
        const numSdrs = inputs.numSdrs;
        const baselineMeetingsPerSdr = 20; // Average baseline meetings per SDR per month
        const meetingValue = inputs.meetingValue || 500;
        const incrementalMeetingPercentage = 0.30; // 30% more meetings with AI SDR
        
        // Calculate incremental value
        const totalBaselineMeetings = baselineMeetingsPerSdr * numSdrs;
        const incrementalMeetings = totalBaselineMeetings * incrementalMeetingPercentage;
        const incrementalMeetingValue = incrementalMeetings * meetingValue;
        
        // Value capture: 10-15% of incremental value
        // Default to 12% (midpoint)
        const valueCapture = 0.12; // 12% capture
        const totalIncrementalRevenue = incrementalMeetingValue * valueCapture;
        
        // Price per SDR (and total monthly price)
        const pricePerSdr = totalIncrementalRevenue / numSdrs;
        monthlyPrice = totalIncrementalRevenue;
        totalMonthlyRevenue = monthlyPrice;
        
        // COGS: ~$100 per SDR per month (covers AI infrastructure + operations)
        const cogsPerSdr = 100;
        totalCogs = cogsPerSdr * numSdrs;
        
        const grossMargin = totalMonthlyRevenue > 0 ? ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100 : 0;

        displayMetrics = {
          "Number of SDRs": numSdrs,
          "Baseline Meetings/SDR": baselineMeetingsPerSdr,
          "Total Baseline Meetings": totalBaselineMeetings,
          "Incremental Meeting %": "30%",
          "Additional Meetings Generated": Math.floor(incrementalMeetings),
          "Meeting Value": `$${meetingValue}`,
          "Incremental Value (Total)": `$${incrementalMeetingValue.toFixed(0)}`,
          "Value Capture %": "12%",
          "Price per SDR / Month": `$${pricePerSdr.toFixed(0)}`,
          "Total Monthly Revenue": `$${monthlyPrice.toFixed(0)}`,
          "COGS per SDR": `$${cogsPerSdr}`,
          "Total COGS": `$${totalCogs.toFixed(0)}`,
          "Gross Margin": `${grossMargin.toFixed(1)}%`,
        };

        // For meeting metrics - use the incremental meetings generated
        metricsForMeeting = {
          prospectCount: Math.floor(incrementalMeetings * 5), // Assume 5 prospects per meeting (reverse calc)
          meetingsGenerated: Math.floor(incrementalMeetings),
        };
        break;
      }
    }

    // Calculate payback
    const meetingValue = inputs.meetingValue || 500;
    const costPerMeeting = metricsForMeeting.meetingsGenerated > 0 
      ? monthlyPrice / metricsForMeeting.meetingsGenerated 
      : 0;
    const paybackDays = meetingValue > 0 ? Math.ceil((monthlyPrice / meetingValue) * 30) : 0;

    return {
      monthlyPrice,
      totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
      totalCogs: totalCogs.toFixed(0),
      grossMargin: ((parseFloat(totalMonthlyRevenue.toFixed(0)) - totalCogs) / parseFloat(totalMonthlyRevenue.toFixed(0)) * 100).toFixed(1),
      costPerProspect: cogsPerProspect,
      costPerMeeting,
      meetingsPerMonth: metricsForMeeting.meetingsGenerated,
      netMonthlySavings: (metricsForMeeting.meetingsGenerated * meetingValue - monthlyPrice).toFixed(0),
      roiMultiple: monthlyPrice > 0 ? ((metricsForMeeting.meetingsGenerated * meetingValue) / monthlyPrice).toFixed(1) : "0",
      paybackDays,
      displayMetrics,
    } as CalculationResults;
  })();

  const handleModelChange = (model: PricingModel) => {
    setInputs(prev => ({ ...prev, pricingModel: model }));
    trackModelSelection(model);
  };

  return (
    <div className="space-y-8">
      {/* PRICING MODEL SELECTOR */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Pricing Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pricing-model" className="text-base font-semibold mb-3 block">
              Pricing Model
            </Label>
            <Select value={inputs.pricingModel} onValueChange={handleModelChange}>
              <SelectTrigger id="pricing-model" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tiered Prospect Bundles">Tiered Prospect Bundles (Recommended)</SelectItem>
                <SelectItem value="Seat + Usage Hybrid">Seat + Usage Hybrid</SelectItem>
                <SelectItem value="Job-to-Be-Done Pricing">Job-to-Be-Done Pricing</SelectItem>
                <SelectItem value="Outcome-Weighted Hybrid">Outcome-Weighted Hybrid</SelectItem>
                <SelectItem value="ROI-Anchored Enterprise">ROI-Anchored Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* RESEARCH DEPTH SELECTOR */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Research Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="research-depth" className="text-base font-semibold mb-3 block">
              Research Depth
            </Label>
            <Select value={inputs.researchDepth} onValueChange={(val) => setInputs(prev => ({ ...prev, researchDepth: val as ResearchDepth }))}>
              <SelectTrigger id="research-depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light Research (LinkedIn only - $0.15/prospect)</SelectItem>
                <SelectItem value="standard">Standard Research (LinkedIn + 1 platform - $0.28/prospect)</SelectItem>
                <SelectItem value="deep">Deep Research (Multi-platform - $0.40/prospect)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* MODEL-SPECIFIC INPUTS */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Core Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {inputs.pricingModel === "Tiered Prospect Bundles" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Prospects per Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.prospectVolume}</span>
                </div>
                <Slider
                  value={[inputs.prospectVolume]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, prospectVolume: val[0] }))}
                  min={50}
                  max={2000}
                  step={50}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">Range: 50 → 2,000</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Positive Reply Rate (%)</Label>
                  <span className="text-lg font-bold text-accent">{inputs.positiveReplyRate}%</span>
                </div>
                <Slider
                  value={[inputs.positiveReplyRate || 8]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, positiveReplyRate: val[0] }))}
                  min={2}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">Default: 8% | Range: 2% → 20%</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Reply to Meeting Booking Rate (%)</Label>
                  <span className="text-lg font-bold text-accent">{inputs.replyBookingRate}%</span>
                </div>
                <Slider
                  value={[inputs.replyBookingRate || 5]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, replyBookingRate: val[0] }))}
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "Seat + Usage Hybrid" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Number of SDRs</Label>
                  <span className="text-lg font-bold text-accent">{inputs.numSdrs}</span>
                </div>
                <Slider
                  value={[inputs.numSdrs]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, numSdrs: val[0] }))}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Prospects per SDR per Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.prospectsPerSdrMonth}</span>
                </div>
                <Slider
                  value={[inputs.prospectsPerSdrMonth]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, prospectsPerSdrMonth: val[0] }))}
                  min={50}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Positive Reply Rate (%)</Label>
                  <span className="text-lg font-bold text-accent">{inputs.positiveReplyRate}%</span>
                </div>
                <Slider
                  value={[inputs.positiveReplyRate || 8]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, positiveReplyRate: val[0] }))}
                  min={2}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "Job-to-Be-Done Pricing" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Account Research Bundles / Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.accountResearchBundles}</span>
                </div>
                <Slider
                  value={[inputs.accountResearchBundles || 10]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, accountResearchBundles: val[0] }))}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Warm Intro Finders / Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.warmIntroFinders}</span>
                </div>
                <Slider
                  value={[inputs.warmIntroFinders || 8]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, warmIntroFinders: val[0] }))}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Personalized Outreach / Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.personalizedOutreachCount}</span>
                </div>
                <Slider
                  value={[inputs.personalizedOutreachCount || 15]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, personalizedOutreachCount: val[0] }))}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "Outcome-Weighted Hybrid" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Number of SDRs</Label>
                  <span className="text-lg font-bold text-accent">{inputs.numSdrs}</span>
                </div>
                <Slider
                  value={[inputs.numSdrs]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, numSdrs: val[0] }))}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Base Subscription per SDR ($)</Label>
                  <span className="text-lg font-bold text-accent">${inputs.baseSubscription}</span>
                </div>
                <Slider
                  value={[inputs.baseSubscription || 99]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, baseSubscription: val[0] }))}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Success Bonus per Reply Booked ($)</Label>
                  <span className="text-lg font-bold text-accent">${inputs.successBonusPerReply}</span>
                </div>
                <Slider
                  value={[inputs.successBonusPerReply || 10]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, successBonusPerReply: val[0] }))}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "ROI-Anchored Enterprise" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Number of SDRs</Label>
                  <span className="text-lg font-bold text-accent">{inputs.numSdrs}</span>
                </div>
                <Slider
                  value={[inputs.numSdrs]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, numSdrs: val[0] }))}
                  min={1}
                  max={500}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Average Meeting Value ($)</Label>
                  <span className="text-lg font-bold text-accent">${inputs.meetingValue}</span>
                </div>
                <Slider
                  value={[inputs.meetingValue || 500]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, meetingValue: val[0] }))}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* PRICING & VALUE SUMMARY PANEL */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Pricing & ROI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Monthly Price</span>
                <span className="text-xl font-bold text-accent">${calculations.monthlyPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Cost per Prospect</span>
                <span className="text-lg font-bold">${calculations.costPerProspect.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Estimated Meetings / Month</span>
                <span className="text-lg font-bold text-accent">{calculations.meetingsPerMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost per Meeting Booked</span>
                <span className="text-lg font-bold">${calculations.costPerMeeting.toFixed(0)}</span>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-3 text-sm">Model Details</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(calculations.displayMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI & MEETING VALUE PANEL */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Meeting Value & ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Avg Meeting Value</p>
              <p className="text-2xl font-bold text-accent">${(inputs.meetingValue || 500)}</p>
              <p className="text-xs text-muted-foreground">per meeting</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Meetings Generated</p>
              <p className="text-2xl font-bold">{calculations.meetingsPerMonth}</p>
              <p className="text-xs text-muted-foreground">/ month</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Net Monthly Savings</p>
              <p className="text-2xl font-bold text-green-600">${calculations.netMonthlySavings}</p>
              <p className="text-xs text-muted-foreground">after AI cost</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">ROI Multiple</p>
              <p className="text-2xl font-bold text-accent">{calculations.roiMultiple}×</p>
              <p className="text-xs text-muted-foreground">return on cost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PAYBACK PANEL */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle>Payback & Margin Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Payback Period (Days)</span>
              <span className="text-lg font-bold text-accent">{calculations.paybackDays}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Total Monthly Revenue</span>
              <span className="text-lg font-bold">${calculations.totalMonthlyRevenue}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Gross Margin %</span>
              <span className="text-lg font-bold text-accent">{calculations.grossMargin}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ASSUMPTIONS DIALOG */}
      <Dialog open={showAssumptions} onOpenChange={setShowAssumptions}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Edit Assumptions
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pricing & Cost Assumptions</DialogTitle>
            <DialogDescription>
              Adjust these assumptions to match your specific pricing and cost structure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* COGS Assumptions */}
            <div>
              <h4 className="font-semibold mb-4">Cost of Goods Sold (COGS) per Prospect</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-40">Light Research</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <span>$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={assumptions.cogsPerProspect.light}
                      onChange={(e) => setAssumptions(prev => ({
                        ...prev,
                        cogsPerProspect: {
                          ...prev.cogsPerProspect,
                          light: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Standard Research</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <span>$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={assumptions.cogsPerProspect.standard}
                      onChange={(e) => setAssumptions(prev => ({
                        ...prev,
                        cogsPerProspect: {
                          ...prev.cogsPerProspect,
                          standard: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Deep Research</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <span>$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={assumptions.cogsPerProspect.deep}
                      onChange={(e) => setAssumptions(prev => ({
                        ...prev,
                        cogsPerProspect: {
                          ...prev.cogsPerProspect,
                          deep: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Model Pricing */}
            <div>
              <h4 className="font-semibold mb-4">Tiered Prospect Bundle Pricing</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-40">Starter Price ($)</Label>
                  <Input
                    type="number"
                    value={assumptions.modelPricing.starter.price}
                    onChange={(e) => setAssumptions(prev => ({
                      ...prev,
                      modelPricing: {
                        ...prev.modelPricing,
                        starter: { ...prev.modelPricing.starter, price: parseInt(e.target.value) || 0 }
                      }
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Growth Price ($)</Label>
                  <Input
                    type="number"
                    value={assumptions.modelPricing.growth.price}
                    onChange={(e) => setAssumptions(prev => ({
                      ...prev,
                      modelPricing: {
                        ...prev.modelPricing,
                        growth: { ...prev.modelPricing.growth, price: parseInt(e.target.value) || 0 }
                      }
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Scale Price ($)</Label>
                  <Input
                    type="number"
                    value={assumptions.modelPricing.scale.price}
                    onChange={(e) => setAssumptions(prev => ({
                      ...prev,
                      modelPricing: {
                        ...prev.modelPricing,
                        scale: { ...prev.modelPricing.scale, price: parseInt(e.target.value) || 0 }
                      }
                    }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Seat Pricing */}
            <div>
              <h4 className="font-semibold mb-4">Seat + Usage Hybrid Pricing</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-40">Seat Base Price ($)</Label>
                  <Input
                    type="number"
                    value={assumptions.modelPricing.seatBase}
                    onChange={(e) => setAssumptions(prev => ({
                      ...prev,
                      modelPricing: {
                        ...prev.modelPricing,
                        seatBase: parseInt(e.target.value) || 0
                      }
                    }))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Overage Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={assumptions.modelPricing.seatOverage}
                    onChange={(e) => setAssumptions(prev => ({
                      ...prev,
                      modelPricing: {
                        ...prev.modelPricing,
                        seatOverage: parseFloat(e.target.value) || 0
                      }
                    }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button onClick={() => setShowAssumptions(false)} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDUCATIONAL FOOTNOTES */}
      <Alert className="border-accent/30 bg-accent/5">
        <Info className="h-4 w-4 text-accent" />
        <AlertDescription>
          <strong>How AI SDR pricing works:</strong> We price based on prospects researched or SDR seats, not generic credits. This ensures clear ROI anchored to cost per meeting booked. All assumptions are conservative estimates and can be customized above.
        </AlertDescription>
      </Alert>
    </div>
  );
};
