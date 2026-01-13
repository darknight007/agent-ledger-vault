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

interface CustomerSupportPricingCalculatorProps {
  blueprint?: string;
}

type PricingModel =
  | "Per-AI-Agent Pricing"
  | "Capability-Tiered AI Agents"
  | "AI Copilot for Human Agents"
  | "Deflection-Based Hybrid"
  | "Knowledge-Base Complexity"
  | "Enterprise Platform License";

type Geography = "US/Canada" | "Europe/UK" | "India" | "Southeast Asia" | "LATAM" | "Africa";
type CoverageLevelType = "FAQ & Tier-1" | "Mixed Support" | "Complex / Regulated";
type CapabilityTier = 
  | "Assist"
  | "Resolve"
  | "Concierge";

interface CalculatorInputs {
  pricingModel: PricingModel;
  geography: Geography;
  numAgents: number;
  coverageLevel: CoverageLevelType;
  valueCapture?: number;           // Model 1
  capabilityTier?: CapabilityTier;  // Model 2
  humanAgentsUsingCopilot?: number; // Model 3
  productivityLift?: number;        // Model 3
  ticketsPerAgentMonth?: number;    // Model 4
  deflectionRate?: number;          // Model 4
  documentPages?: number;           // Model 5
  avgUpdatesPerMonth?: number;      // Model 5
  totalHumanSupportAgents?: number; // Model 6
  contractLengthYears?: number;     // Model 6
}

interface Assumptions {
  humanCostByGeography: {
    [key in Geography]: number;
  };
  aiReplacementRatio: number;
  ticketResolutionAccuracy: number;
  voiceUsagePercent: number;
  llmCostPerAgent: number;
  infrastructureCost: number;
  managementOverhead: number;
  valueCaptureFraction: number;
  volumeDiscountThreshold: number;
  volumeDiscountPercent: number;
}

interface CalculationResults {
  pricePerAgent: number;
  totalMonthlyRevenue: string;
  totalCogs: string;
  grossMargin: string;
  humanCostPerAgent: number;
  humanCostAvoided: string;
  netMonthlySavings: string;
  roiMultiple: string;
  paybackMonths: number;
  breakEvenAgents: number;
  month6Projection: string;
  displayMetrics: Record<string, string | number>;
}

export const CustomerSupportPricingCalculator = ({ blueprint = "customer-support-agent" }: CustomerSupportPricingCalculatorProps) => {
  const { toast } = useToast();

  const [inputs, setInputs] = useState<CalculatorInputs>({
    pricingModel: "Per-AI-Agent Pricing",
    geography: "US/Canada",
    numAgents: 20,
    coverageLevel: "Mixed Support",
    valueCapture: 15,
    capabilityTier: "Resolve",
    humanAgentsUsingCopilot: 10,
    productivityLift: 35,
    ticketsPerAgentMonth: 1000,
    deflectionRate: 40,
    documentPages: 500,
    avgUpdatesPerMonth: 20,
    totalHumanSupportAgents: 50,
    contractLengthYears: 1,
  });

  const [assumptions, setAssumptions] = useState<Assumptions>({
    humanCostByGeography: {
      "US/Canada": 4250,
      "Europe/UK": 3500,
      "India": 900,
      "Southeast Asia": 1050,
      "LATAM": 1700,
      "Africa": 750,
    },
    aiReplacementRatio: 0.4,
    ticketResolutionAccuracy: 95,
    voiceUsagePercent: 20,
    llmCostPerAgent: 120,
    infrastructureCost: 45,
    managementOverhead: 20,
    valueCaptureFraction: 0.15,
    volumeDiscountThreshold: 50,
    volumeDiscountPercent: 15,
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
      gtag('event', 'model_selected', {
        selected_model: selectedModel,
      });
    }
  }, []);

  // Core calculations
  const calculations = (() => {
    const humanCostPerAgent = assumptions.humanCostByGeography[inputs.geography];
    const baseCogs = assumptions.llmCostPerAgent + assumptions.infrastructureCost;

    let pricePerAgent = 0;
    let totalMonthlyRevenue = 0;
    let displayMetrics: Record<string, string | number> = {};
    let effectiveSavings = 0;

    switch (inputs.pricingModel) {
      case "Per-AI-Agent Pricing": {
        // Price = human cost × value capture fraction
        const basePrice = humanCostPerAgent * (inputs.valueCapture || 15) / 100;
        pricePerAgent = basePrice;

        // Apply volume discount
        const finalPrice = inputs.numAgents >= assumptions.volumeDiscountThreshold
          ? basePrice * (1 - assumptions.volumeDiscountPercent / 100)
          : basePrice;

        totalMonthlyRevenue = finalPrice * inputs.numAgents;
        const totalCogs = baseCogs * inputs.numAgents;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          pricePerAgent: finalPrice.toFixed(0),
          basePrice: basePrice.toFixed(0),
          humanCostRef: humanCostPerAgent.toFixed(0),
          valueCapture: inputs.valueCapture || 15,
          numAgents: inputs.numAgents,
          totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        effectiveSavings = (humanCostPerAgent - finalPrice) * inputs.numAgents;
        break;
      }

      case "Capability-Tiered AI Agents": {
        const baseTierPrice = humanCostPerAgent * 0.10; // Assist tier
        const multipliers = {
          "Assist": 1.0,
          "Resolve": 1.5,
          "Concierge": 2.2,
        };
        const tierMultiplier = multipliers[inputs.capabilityTier || "Resolve"];
        pricePerAgent = baseTierPrice * tierMultiplier;

        // Apply volume discount
        const finalPrice = inputs.numAgents >= assumptions.volumeDiscountThreshold
          ? pricePerAgent * (1 - assumptions.volumeDiscountPercent / 100)
          : pricePerAgent;

        totalMonthlyRevenue = finalPrice * inputs.numAgents;
        const totalCogs = baseCogs * inputs.numAgents;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          capabilityTier: inputs.capabilityTier,
          baseTierPrice: baseTierPrice.toFixed(0),
          tierMultiplier: tierMultiplier.toFixed(2),
          pricePerAgent: finalPrice.toFixed(0),
          numAgents: inputs.numAgents,
          totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        effectiveSavings = (humanCostPerAgent * 0.3 - finalPrice) * inputs.numAgents;
        break;
      }

      case "AI Copilot for Human Agents": {
        // Price based on productivity lift
        const costPerHumanAgent = humanCostPerAgent;
        const productivityValue = costPerHumanAgent * ((inputs.productivityLift || 35) / 100);
        // Copilot captures 40-50% of the productivity gain
        pricePerAgent = productivityValue * 0.45;

        totalMonthlyRevenue = pricePerAgent * (inputs.humanAgentsUsingCopilot || 10);
        const estimatedCogs = baseCogs * (inputs.humanAgentsUsingCopilot || 10);
        const grossMargin = ((totalMonthlyRevenue - estimatedCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          humanAgentsCount: inputs.humanAgentsUsingCopilot || 10,
          costPerHumanAgent: costPerHumanAgent.toFixed(0),
          productivityLift: inputs.productivityLift || 35,
          productivityValue: productivityValue.toFixed(0),
          pricePerAgent: pricePerAgent.toFixed(0),
          totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
          estimatedCogs: estimatedCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        effectiveSavings = productivityValue * (inputs.humanAgentsUsingCopilot || 10);
        break;
      }

      case "Deflection-Based Hybrid": {
        // Base fee + deflection bonus
        const baseFee = humanCostPerAgent * 0.05; // 5% of human cost as base
        const ticketsPerMonth = inputs.ticketsPerAgentMonth || 1000;
        const deflectedTickets = ticketsPerMonth * ((inputs.deflectionRate || 40) / 100);
        const costPerTicket = humanCostPerAgent / 200; // Assumes 200 tickets/human/month
        const deflectionBonus = deflectedTickets * costPerTicket * 0.25; // Capture 25% of savings

        pricePerAgent = baseFee + deflectionBonus;
        totalMonthlyRevenue = pricePerAgent * inputs.numAgents;
        const totalCogs = baseCogs * inputs.numAgents;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          baseFee: baseFee.toFixed(0),
          ticketsPerMonth: ticketsPerMonth.toFixed(0),
          deflectionRate: inputs.deflectionRate || 40,
          deflectedTickets: deflectedTickets.toFixed(0),
          costPerTicket: costPerTicket.toFixed(2),
          deflectionBonus: deflectionBonus.toFixed(0),
          pricePerAgent: pricePerAgent.toFixed(0),
          numAgents: inputs.numAgents,
          totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        const annualDeflectionSavings = deflectionBonus * inputs.numAgents * 12 * 4; // 4x multiplier for impact
        effectiveSavings = annualDeflectionSavings;
        break;
      }

      case "Knowledge-Base Complexity": {
        // Base price + complexity surcharge
        const basePrice = humanCostPerAgent * 0.10;
        const complexityFactor = Math.min(2.0, 1.0 + (inputs.documentPages || 500) / 1000); // 1.0x to 2.0x
        const updateSurcharge = (inputs.avgUpdatesPerMonth || 20) * 5; // $5 per update

        pricePerAgent = (basePrice * complexityFactor) + (updateSurcharge / inputs.numAgents);

        totalMonthlyRevenue = pricePerAgent * inputs.numAgents;
        const totalCogs = baseCogs * inputs.numAgents;
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          basePrice: basePrice.toFixed(0),
          documentPages: inputs.documentPages || 500,
          complexityFactor: complexityFactor.toFixed(2),
          avgUpdatesPerMonth: inputs.avgUpdatesPerMonth || 20,
          updateSurcharge: updateSurcharge.toFixed(0),
          pricePerAgent: pricePerAgent.toFixed(0),
          numAgents: inputs.numAgents,
          totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        effectiveSavings = (basePrice * complexityFactor) * inputs.numAgents;
        break;
      }

      case "Enterprise Platform License": {
        // Annual license as % of total support payroll
        const totalHumanPayroll = humanCostPerAgent * (inputs.totalHumanSupportAgents || 50) * 12;
        const licensePercentage = 0.12; // 12% of payroll
        const annualLicense = totalHumanPayroll * licensePercentage;
        const monthlyLicense = annualLicense / 12;

        // Apply contract length discount
        const contractMultiplier = inputs.contractLengthYears === 3 ? 0.85 : inputs.contractLengthYears === 2 ? 0.92 : 1.0;
        const finalMonthlyLicense = monthlyLicense * contractMultiplier;

        totalMonthlyRevenue = finalMonthlyLicense;
        const totalCogs = baseCogs * (inputs.totalHumanSupportAgents || 50) * 0.5; // 50% of agents count for COGS
        const grossMargin = ((totalMonthlyRevenue - totalCogs) / totalMonthlyRevenue) * 100;

        displayMetrics = {
          totalHumanAgents: inputs.totalHumanSupportAgents || 50,
          totalHumanPayroll: (totalHumanPayroll / 12).toFixed(0),
          licensePercentage: (licensePercentage * 100).toFixed(1),
          contractLength: inputs.contractLengthYears || 1,
          contractDiscount: ((1 - contractMultiplier) * 100).toFixed(0),
          monthlyLicense: finalMonthlyLicense.toFixed(0),
          annualLicense: (finalMonthlyLicense * 12).toFixed(0),
          totalCogs: totalCogs.toFixed(0),
          grossMargin: grossMargin.toFixed(1),
        };

        effectiveSavings = monthlyLicense;
        break;
      }
    }

    // Month 6 projection
    const growthRate = 20; // 20% monthly growth
    const churnRate = 3; // 3% monthly churn
    let customersMonth6 = inputs.numAgents;
    for (let i = 0; i < 5; i++) {
      const newCustomers = customersMonth6 * (growthRate / 100);
      const churnedCustomers = customersMonth6 * (churnRate / 100);
      customersMonth6 = customersMonth6 + newCustomers - churnedCustomers;
    }

    // Calculate payback period (in months)
    const monthlyFixedCosts = 2000; // Estimated
    const paybackMonths = pricePerAgent > 0
      ? Math.ceil(monthlyFixedCosts / ((pricePerAgent - baseCogs) * inputs.numAgents))
      : 0;

    return {
      pricePerAgent,
      totalMonthlyRevenue: totalMonthlyRevenue.toFixed(0),
      totalCogs: (baseCogs * (inputs.pricingModel === "Enterprise Platform License" ? inputs.totalHumanSupportAgents || 50 : inputs.numAgents)).toFixed(0),
      grossMargin: ((parseFloat(totalMonthlyRevenue.toFixed(0)) - parseFloat((baseCogs * inputs.numAgents).toFixed(0))) / totalMonthlyRevenue * 100).toFixed(1),
      humanCostPerAgent,
      humanCostAvoided: (humanCostPerAgent * inputs.numAgents).toFixed(0),
      netMonthlySavings: effectiveSavings.toFixed(0),
      roiMultiple: ((humanCostPerAgent / (pricePerAgent + baseCogs))).toFixed(1),
      paybackMonths: Math.max(1, paybackMonths),
      breakEvenAgents: Math.ceil((monthlyFixedCosts / (pricePerAgent - baseCogs))),
      month6Projection: customersMonth6.toFixed(0),
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
                <SelectItem value="Per-AI-Agent Pricing">Per-AI-Agent Pricing (Recommended)</SelectItem>
                <SelectItem value="Capability-Tiered AI Agents">Capability-Tiered AI Agents</SelectItem>
                <SelectItem value="AI Copilot for Human Agents">AI Copilot for Human Agents</SelectItem>
                <SelectItem value="Deflection-Based Hybrid">Deflection-Based Hybrid Pricing</SelectItem>
                <SelectItem value="Knowledge-Base Complexity">Knowledge-Base Complexity Pricing</SelectItem>
                <SelectItem value="Enterprise Platform License">Enterprise Platform License</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* GEOGRAPHY SELECTOR */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            Customer Support Team Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="underline cursor-help">Pricing automatically adjusts based on average human support costs in your geography.</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This ensures fair pricing across onshore and offshore teams.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
          <Select value={inputs.geography} onValueChange={(val) => setInputs(prev => ({ ...prev, geography: val as Geography }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US/Canada">🇺🇸 United States / Canada (${assumptions.humanCostByGeography["US/Canada"]}/mo)</SelectItem>
              <SelectItem value="Europe/UK">🇪🇺 Europe / UK (${assumptions.humanCostByGeography["Europe/UK"]}/mo)</SelectItem>
              <SelectItem value="India">🇮🇳 India (${assumptions.humanCostByGeography["India"]}/mo)</SelectItem>
              <SelectItem value="Southeast Asia">🇵🇭 Southeast Asia (${assumptions.humanCostByGeography["Southeast Asia"]}/mo)</SelectItem>
              <SelectItem value="LATAM">🌎 LATAM (${assumptions.humanCostByGeography["LATAM"]}/mo)</SelectItem>
              <SelectItem value="Africa">🌍 Africa (${assumptions.humanCostByGeography["Africa"]}/mo)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* COMMON SLIDERS */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Core Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of AI Agents */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base font-semibold">Number of AI Agents</Label>
              <span className="text-lg font-bold text-accent">{inputs.numAgents}</span>
            </div>
            <Slider
              value={[inputs.numAgents]}
              onValueChange={(val) => setInputs(prev => ({ ...prev, numAgents: val[0] }))}
              min={1}
              max={5000}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">Range: 1 → 5,000</p>
          </div>

          {/* AI Coverage Level */}
          <div>
            <Label htmlFor="coverage-level" className="text-base font-semibold mb-3 block">
              AI Coverage Level
            </Label>
            <Select value={inputs.coverageLevel} onValueChange={(val) => setInputs(prev => ({ ...prev, coverageLevel: val as CoverageLevelType }))}>
              <SelectTrigger id="coverage-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FAQ & Tier-1">FAQ & Tier-1</SelectItem>
                <SelectItem value="Mixed Support">Mixed Support</SelectItem>
                <SelectItem value="Complex / Regulated">Complex / Regulated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MODEL-SPECIFIC SLIDERS */}
          {inputs.pricingModel === "Per-AI-Agent Pricing" && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-semibold">Value Capture Rate (% of Human Cost)</Label>
                <span className="text-lg font-bold text-accent">{inputs.valueCapture}%</span>
              </div>
              <Slider
                value={[inputs.valueCapture || 15]}
                onValueChange={(val) => setInputs(prev => ({ ...prev, valueCapture: val[0] }))}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">Default: 15% | Range: 5% → 30%</p>
            </div>
          )}

          {inputs.pricingModel === "Capability-Tiered AI Agents" && (
            <div>
              <Label htmlFor="capability-tier" className="text-base font-semibold mb-3 block">
                Capability Tier
              </Label>
              <Select value={inputs.capabilityTier} onValueChange={(val) => setInputs(prev => ({ ...prev, capabilityTier: val as CapabilityTier }))}>
                <SelectTrigger id="capability-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assist">Assist (Text FAQ)</SelectItem>
                  <SelectItem value="Resolve">Resolve (RAG + Troubleshooting)</SelectItem>
                  <SelectItem value="Concierge">Concierge (Voice + Reasoning)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {inputs.pricingModel === "AI Copilot for Human Agents" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Human Agents Using Copilot</Label>
                  <span className="text-lg font-bold text-accent">{inputs.humanAgentsUsingCopilot}</span>
                </div>
                <Slider
                  value={[inputs.humanAgentsUsingCopilot || 10]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, humanAgentsUsingCopilot: val[0] }))}
                  min={1}
                  max={500}
                  step={5}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Productivity Lift (%)</Label>
                  <span className="text-lg font-bold text-accent">{inputs.productivityLift}%</span>
                </div>
                <Slider
                  value={[inputs.productivityLift || 35]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, productivityLift: val[0] }))}
                  min={20}
                  max={60}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">Default: 35% | Range: 20% → 60%</p>
              </div>
            </>
          )}

          {inputs.pricingModel === "Deflection-Based Hybrid" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Tickets per Agent / Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.ticketsPerAgentMonth}</span>
                </div>
                <Slider
                  value={[inputs.ticketsPerAgentMonth || 1000]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, ticketsPerAgentMonth: val[0] }))}
                  min={100}
                  max={5000}
                  step={100}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Expected Deflection Rate (%)</Label>
                  <span className="text-lg font-bold text-accent">{inputs.deflectionRate}%</span>
                </div>
                <Slider
                  value={[inputs.deflectionRate || 40]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, deflectionRate: val[0] }))}
                  min={10}
                  max={80}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "Knowledge-Base Complexity" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Total Pages of Manuals / Docs</Label>
                  <span className="text-lg font-bold text-accent">{inputs.documentPages}</span>
                </div>
                <Slider
                  value={[inputs.documentPages || 500]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, documentPages: val[0] }))}
                  min={50}
                  max={5000}
                  step={50}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Avg Updates per Month</Label>
                  <span className="text-lg font-bold text-accent">{inputs.avgUpdatesPerMonth}</span>
                </div>
                <Slider
                  value={[inputs.avgUpdatesPerMonth || 20]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, avgUpdatesPerMonth: val[0] }))}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          )}

          {inputs.pricingModel === "Enterprise Platform License" && (
            <>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-semibold">Total Human Support Agents</Label>
                  <span className="text-lg font-bold text-accent">{inputs.totalHumanSupportAgents}</span>
                </div>
                <Slider
                  value={[inputs.totalHumanSupportAgents || 50]}
                  onValueChange={(val) => setInputs(prev => ({ ...prev, totalHumanSupportAgents: val[0] }))}
                  min={5}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="contract-length" className="text-base font-semibold mb-3 block">
                  Contract Length (Years)
                </Label>
                <Select value={inputs.contractLengthYears?.toString()} onValueChange={(val) => setInputs(prev => ({ ...prev, contractLengthYears: parseInt(val) }))}>
                  <SelectTrigger id="contract-length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years (8% discount)</SelectItem>
                    <SelectItem value="3">3 Years (15% discount)</SelectItem>
                  </SelectContent>
                </Select>
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
            Pricing & Value Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Price per AI Agent / Month</span>
                <span className="text-xl font-bold text-accent">${calculations.pricePerAgent.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Monthly AI Cost</span>
                <span className="text-lg font-bold">${calculations.totalMonthlyRevenue}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Effective Cost vs Human Agent</span>
                <span className="text-lg font-bold">${(calculations.humanCostPerAgent - calculations.pricePerAgent).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">% Cheaper than Human Support</span>
                <span className="text-lg font-bold text-accent">
                  {((1 - calculations.pricePerAgent / calculations.humanCostPerAgent) * 100).toFixed(0)}%
                </span>
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

      {/* ROI & SAVINGS PANEL */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            ROI & Human Cost Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Human Cost per Agent</p>
              <p className="text-2xl font-bold text-accent">${calculations.humanCostPerAgent.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">/ month</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Monthly Human Cost Avoided</p>
              <p className="text-2xl font-bold">${calculations.humanCostAvoided}</p>
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

      {/* SCALE & GROWTH PANEL */}
      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Scale Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Monthly Cost at 100 Agents</span>
              <span className="font-semibold">${(calculations.pricePerAgent * 100).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Monthly Cost at 1,000 Agents</span>
              <span className="font-semibold">${(calculations.pricePerAgent * 1000).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Annual Savings at Full Scale</span>
              <span className="font-semibold text-green-600">
                ${(calculations.humanCostPerAgent * inputs.numAgents * 12).toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BREAKEVEN & PAYBACK PANEL */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle>Payback & Breakeven Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Payback Period (months)</span>
              <span className="text-lg font-bold text-accent">{calculations.paybackMonths}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Breakeven AI Agents</span>
              <span className="text-lg font-bold">{calculations.breakEvenAgents}</span>
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
            <DialogTitle>Cost & Performance Assumptions</DialogTitle>
            <DialogDescription>
              Adjust these assumptions to match your specific cost structure and performance metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Human Cost Assumptions */}
            <div>
              <h4 className="font-semibold mb-4">Human Cost Assumptions</h4>
              <div className="space-y-3">
                {(Object.keys(assumptions.humanCostByGeography) as Geography[]).map(geo => (
                  <div key={geo} className="flex items-center gap-3">
                    <Label className="w-40">{geo}</Label>
                    <div className="flex items-center gap-2 flex-1">
                      <span>$</span>
                      <Input
                        type="number"
                        value={assumptions.humanCostByGeography[geo]}
                        onChange={(e) => setAssumptions(prev => ({
                          ...prev,
                          humanCostByGeography: {
                            ...prev.humanCostByGeography,
                            [geo]: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Performance Assumptions */}
            <div>
              <h4 className="font-semibold mb-4">AI Performance Assumptions</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="w-40">LLM Cost / Agent / Month</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <span>$</span>
                    <Input
                      type="number"
                      value={assumptions.llmCostPerAgent}
                      onChange={(e) => setAssumptions(prev => ({
                        ...prev,
                        llmCostPerAgent: parseInt(e.target.value) || 0
                      }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="w-40">Infrastructure Cost</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <span>$</span>
                    <Input
                      type="number"
                      value={assumptions.infrastructureCost}
                      onChange={(e) => setAssumptions(prev => ({
                        ...prev,
                        infrastructureCost: parseInt(e.target.value) || 0
                      }))}
                      className="flex-1"
                    />
                  </div>
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
          <strong>How pricing works:</strong> We price AI agents as a fraction of human support cost in your geography. This ensures fair pricing across onshore and offshore teams while maintaining strong ROI. All assumptions are conservative estimates and can be customized in the form above.
        </AlertDescription>
      </Alert>
    </div>
  );
};
