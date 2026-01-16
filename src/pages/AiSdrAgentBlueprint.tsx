import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistDialog } from "@/components/WaitlistDialog";
import { AiSdrPricingCalculator } from "@/components/AiSdrPricingCalculator";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, FileText, Youtube, Twitter, Linkedin, Globe, Users, TrendingUp } from "lucide-react";


const AiSdrAgentBlueprint = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);

  const scrollToCalculator = () => {
    document.getElementById("pricing-calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* SECTION 1: HERO */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-accent opacity-5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                AI SDR Agent – <span className="gradient-text">Pricing Blueprint</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
                Five proven pricing models for AI SDR agents that deliver researched prospects, book qualified meetings, and compete directly with Apollo and Clay.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Price based on prospect bundles, SDR seats, or research jobs—not just generic credits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button size="lg" className="text-lg group" onClick={() => setShowWaitlist(true)}>
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <button
                  onClick={scrollToCalculator}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors pt-3"
                >
                  Try the pricing calculator
                </button>
              </div>
            </div>
            <div className="animate-slide-up">
              <Card className="border-2 border-accent/30 shadow-lg">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg">Recommended Configuration</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Pricing model</span>
                    <span className="font-semibold text-accent">Tiered Prospect Bundles</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Unit of value</span>
                    <span className="font-semibold">Prospects per month</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Key metric</span>
                    <span className="font-semibold">$ per prospect researched</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Customizable</span>
                    <span className="font-semibold text-accent">Editable inside AskScrooge.ai</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FIVE PRICING MODELS OVERVIEW */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Five Proven Pricing Models for AI SDR</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Each model is optimized for different customer segments and use cases. Choose the one that best aligns with your go-to-market strategy.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Model 1 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-accent" />
                  Tiered Prospect Bundles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">⭐</span>
                  <span className="text-sm">BEST CONVERSION. Self-serve, easy mental model.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Prospects per month, tiered by research depth
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "100–1,000 prospects/month at $0.25–$0.39 per prospect."
                </p>
              </CardContent>
            </Card>

            {/* Model 2 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-accent" />
                  Seat + Usage Hybrid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">2</span>
                  <span className="text-sm">BEST FOR TEAMS. Scales with headcount.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Per SDR seat + usage overages
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "$79/seat includes 150 prospects, $0.50 per extra."
                </p>
              </CardContent>
            </Card>

            {/* Model 3 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Check className="h-5 w-5 text-accent" />
                  Job-to-Be-Done Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">3</span>
                  <span className="text-sm">HIGHLY DIFFERENTIATED. Workflow-based.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Specific workflows, not credits
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Account research $12, warm intro finder $8, personalized outreach $15."
                </p>
              </CardContent>
            </Card>

            {/* Model 4 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Outcome-Weighted Hybrid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">4</span>
                  <span className="text-sm">INCENTIVE ALIGNED. Base + success bonus.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Fixed subscription + outcome multiplier
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "$99/seat base + $10 per positive reply booked."
                </p>
              </CardContent>
            </Card>

            {/* Model 5 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-accent" />
                  ROI-Anchored Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">5</span>
                  <span className="text-sm">ENTERPRISE ONLY. Value-based pricing.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> 10–15% of incremental meeting value
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "$750–$1,000/SDR/month (10–15% of $7,500 incremental value)."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT THE AI SDR AGENT DOES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">What the AI SDR Agent Does</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Check className="h-5 w-5 text-accent" />
                  Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Researches prospects across LinkedIn, web, and company databases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Identifies decision makers and key personas per account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Surfaces warm introductions and mutual connections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Generates personalized outreach messaging and templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Books qualified meetings directly to your calendar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Integrates with CRM, email, and calendar systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <X className="h-5 w-5 text-destructive" />
                  Not Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Replacement for human SDRs (complement, not substitute)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Legal or financial advice in outreach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Management of inbound leads (only outbound)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Real-time phone calling (email & LinkedIn messaging only)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: MODEL 1 DEEP DIVE - TIERED PROSPECT BUNDLES */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Model 1: Tiered Prospect Bundles (Best Conversion)</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Self-serve pricing focused on simplicity and competitive positioning vs Apollo and Clay.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Pricing Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <div>
                      <h4 className="font-semibold">Starter</h4>
                      <p className="text-xs text-muted-foreground">LinkedIn-only, light research</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$39</p>
                      <p className="text-xs text-muted-foreground">100 prospects</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <div>
                      <h4 className="font-semibold">Growth</h4>
                      <p className="text-xs text-muted-foreground">LinkedIn + 1 platform</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$99</p>
                      <p className="text-xs text-muted-foreground">300 prospects</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Scale</h4>
                      <p className="text-xs text-muted-foreground">Multi-platform, deep research</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$249</p>
                      <p className="text-xs text-muted-foreground">1,000 prospects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Unit Economics (Growth Plan)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Revenue</h4>
                    <p className="text-sm font-mono">$99 / month</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Blended COGS per prospect</h4>
                    <ul className="space-y-1 text-sm">
                      <li>40% deep research ($0.40) = $0.16</li>
                      <li>60% light research ($0.20) = $0.12</li>
                      <li className="font-semibold">Blended = $0.28</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">COGS Calculation</h4>
                    <p className="text-sm font-mono">300 × $0.28 = $84 COGS</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm">
                      <strong>Gross Margin:</strong> <span className="text-accent font-semibold">15%</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Gate depth by plan to achieve 60–70% margins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Easy mental model:</strong> Buyers understand "prospects per month"</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Competitive:</strong> Directly comparable to Apollo and Clay pricing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Clear upgrade triggers:</strong> More platforms = higher price, justified by value</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Self-serve friendly:</strong> No sales conversation needed to understand pricing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 5: MODEL 2 DEEP DIVE - SEAT + USAGE HYBRID */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Model 2: Seat + Usage Hybrid (Best for Real Teams)</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Once teams onboard, transition to this model for predictable revenue and better retention.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Pricing Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="pb-4 border-b border-border">
                    <h4 className="font-semibold text-sm mb-2">Per SDR Seat</h4>
                    <p className="text-2xl font-bold text-accent">$79 / month</p>
                  </div>
                  <div className="pb-4 border-b border-border">
                    <h4 className="font-semibold text-sm mb-2">Included Prospects</h4>
                    <p className="text-xl font-semibold">150 prospects</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Overage Rate</h4>
                    <p className="text-xl font-semibold text-accent">$0.50 / prospect</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Example: 1 SDR, 400 Prospects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Revenue Calculation</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Base seat cost: $79</li>
                      <li>Overages: (400 − 150) × $0.50 = $125</li>
                      <li className="font-semibold border-t border-border pt-1 mt-1">Total: $204</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">COGS Calculation</h4>
                    <p className="text-sm font-mono">400 × $0.28 = $112</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm">
                      <strong>Gross Margin:</strong> <span className="text-accent font-semibold">45%</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">Why This Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Seats anchor value:</strong> Easy to understand cost per team member</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Heavy users subsidize light users:</strong> Overages capture upsell revenue</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Scales cleanly with headcount:</strong> Add SDRs = add seats, linear growth</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Reduces churn:</strong> Seat-based models have lower churn than per-prospect</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 6: MODEL 3 DEEP DIVE - JOB-TO-BE-DONE PRICING */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Model 3: Job-to-Be-Done Pricing (Highly Differentiated)</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop competing on credits. Sell complete workflows that sales leaders actually think about.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Account Research Pack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What it includes:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Company deep dive</li>
                    <li>✓ 3 key personas identified</li>
                    <li>✓ Competitive intelligence</li>
                    <li>✓ Recent funding/news</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-accent">$12</p>
                  <p className="text-xs text-muted-foreground">per account</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Warm Intro Finder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What it includes:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Mutual connection search</li>
                    <li>✓ LinkedIn pathway mapping</li>
                    <li>✓ Intro message draft</li>
                    <li>✓ Warm intro strategy</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-accent">$8</p>
                  <p className="text-xs text-muted-foreground">per warm intro search</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Personalised Outreach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What it includes:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Deep prospect research</li>
                    <li>✓ Custom email template</li>
                    <li>✓ Hyper-personalized hooks</li>
                    <li>✓ Follow-up sequence</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-accent">$15</p>
                  <p className="text-xs text-muted-foreground">per prospect</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Economics Example: Personalised Outreach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Price per Outreach</span>
                    <span className="font-bold">$15</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">COGS (deep research)</span>
                    <span className="font-bold">$0.60</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Gross Profit</span>
                    <span className="font-bold">$14.40</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm">
                      <strong>Gross Margin:</strong> <span className="text-accent font-bold text-lg">96%</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <CardTitle>Why This Model Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span><strong>Sales leaders think in workflows:</strong> "We need account research" not "we need credits"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span><strong>Easy to expense:</strong> Each job is a clear line item on invoices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span><strong>Perfect for pilots:</strong> Buy a few jobs to test, easy to scale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span><strong>Highest margins:</strong> 96% on personalised outreach</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7: MODEL 4 DEEP DIVE - OUTCOME-WEIGHTED HYBRID */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Model 4: Outcome-Weighted Hybrid (Incentive Aligned)</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Never do pure outcome pricing. Always include base subscription to cover costs. Success bonuses align incentives.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Pricing Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="pb-4 border-b border-border">
                    <h4 className="font-semibold text-sm mb-2">Base Subscription</h4>
                    <p className="text-2xl font-bold text-accent">$99 / seat / month</p>
                    <p className="text-xs text-muted-foreground mt-1">Covers AI infrastructure costs</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Success Bonus</h4>
                    <p className="text-2xl font-bold text-accent">$10 / reply booked</p>
                    <p className="text-xs text-muted-foreground mt-1">Paid when AI SDR books a reply</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Example: 2 SDRs, 8% Reply Rate, 10% Booking Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-semibold mb-2">Monthly Revenue Calculation:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Base: 2 SDRs × $99 = <span className="font-semibold text-foreground">$198</span></li>
                      <li>Prospects: 2 × 150 = 300</li>
                      <li>Replies: 300 × 8% = 24 replies</li>
                      <li>Booked: 24 × 10% = 2.4 replies</li>
                      <li>Bonus: 2.4 × $10 = <span className="font-semibold text-foreground">$24</span></li>
                      <li className="font-bold border-t border-border pt-2 mt-2">Total: $222 / month</li>
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm"><strong>Gross Margin:</strong> <span className="text-accent font-semibold">45%+</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle>Why This Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Aligns incentives:</strong> You profit when your AI SDR books replies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Keeps downside capped:</strong> Base subscription covers your costs no matter what</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Works for agencies/rev-ops:</strong> They love outcome alignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Requires clear attribution:</strong> CRM integration to track booked replies accurately</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 8: MODEL 5 DEEP DIVE - ROI-ANCHORED ENTERPRISE */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Model 5: ROI-Anchored Enterprise (Big Deals)</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Enterprise-only pricing used when selling directly to VP of RevOps or Sales leadership. Price as a fraction of incremental value.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Value Framing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="pb-3 border-b border-border">
                    <p className="text-sm text-muted-foreground">1 AI SDR generates:</p>
                    <p className="text-xl font-bold">30% more meetings</p>
                  </div>
                  <div className="pb-3 border-b border-border">
                    <p className="text-sm text-muted-foreground">Average meeting value:</p>
                    <p className="text-xl font-bold">$500</p>
                  </div>
                  <div className="pb-3 border-b border-border">
                    <p className="text-sm text-muted-foreground">Baseline meetings/SDR:</p>
                    <p className="text-xl font-bold">20/month</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Incremental value per SDR:</p>
                    <p className="text-2xl font-bold text-accent">$3,000 / month</p>
                    <p className="text-xs text-muted-foreground mt-1">(6 extra meetings × $500)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>Pricing Logic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Charge 10–15% of incremental value</p>
                    <div className="space-y-1">
                      <p className="text-sm font-mono">10% = $300/SDR/month</p>
                      <p className="text-sm font-mono">12% = $360/SDR/month</p>
                      <p className="text-sm font-mono text-accent font-bold">15% = $450/SDR/month</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">COGS per SDR:</p>
                    <p className="font-bold">~$100/month</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm"><strong>Gross Margin:</strong> <span className="text-accent font-bold text-lg">70–80%+</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-base">Small Deal (5 SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incremental Value</span>
                  <span className="font-bold">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price (12%)</span>
                  <span className="font-bold">$1,800</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">COGS</span>
                  <span className="font-bold">$500</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Gross Margin</span>
                  <span className="text-accent font-bold">72%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-base">Mid Deal (20 SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incremental Value</span>
                  <span className="font-bold">$60,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price (12%)</span>
                  <span className="font-bold">$7,200</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">COGS</span>
                  <span className="font-bold">$2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Gross Margin</span>
                  <span className="text-accent font-bold">72%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-base">Enterprise (100 SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incremental Value</span>
                  <span className="font-bold">$300,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price (12%)</span>
                  <span className="font-bold">$36,000</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">COGS</span>
                  <span className="font-bold">$10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Gross Margin</span>
                  <span className="text-accent font-bold">72%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle>Why This Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Eliminates procurement objections:</strong> "You're only 10% of the value you create"</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Scales with customer value:</strong> 100 SDRs = $36k/month, but $300k incremental value</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Enterprise SLAs included:</strong> 99.9% uptime, white-glove support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span><strong>Negotiation room:</strong> Start at 15%, move to 10-12% for multi-year deals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 9: INTERACTIVE PRICING CALCULATOR */}
      <section id="pricing-calculator" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Interactive Pricing Calculator</h2>
          <p className="text-center text-muted-foreground mb-10">
            Simulate pricing, ROI, and cost savings for your AI SDR Agent.
            Adjust models, prospect volume, and team size to see real-world impact instantly.
          </p>

          <AiSdrPricingCalculator blueprint="ai-sdr-agent" />
        </div>
      </section>

      {/* SECTION 10: COST & MARGIN TRANSPARENCY */}
      <section id="cost-transparency" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how-pricing-calculated" className="border rounded-lg px-6">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                How pricing is calculated
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">COGS Per Prospect (Average)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">LLM research tokens</span>
                        <span className="font-medium">$0.08–$0.12</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Database queries & APIs</span>
                        <span className="font-medium">$0.05–$0.08</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Warm intro verification</span>
                        <span className="font-medium">$0.03–$0.05</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Infrastructure & logging</span>
                        <span className="font-medium">$0.02–$0.03</span>
                      </div>
                      <div className="flex justify-between items-center font-semibold mt-2">
                        <span>Blended COGS per prospect</span>
                        <span>$0.18–$0.28</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Model 1 (per prospect)</span>
                        <span className="font-medium">$0.25–$0.39</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Model 2 (per seat)</span>
                        <span className="font-medium">$79 + $0.50 per overage</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Gross Margin Target</span>
                        <span className="font-medium">45–70%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Enterprise floor (minimum deal)</span>
                        <span className="font-medium">$500–$2,000 / month</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg mt-4">
                  <strong>Disclaimer:</strong> All assumptions are conservative estimates and fully editable inside AskScrooge.ai. Actual costs vary by research depth, data sources used, and integration complexity.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="key-assumptions" className="border rounded-lg px-6 mt-4">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                Key Performance Assumptions
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">AI SDR Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Prospect research quality (vs manual)</span>
                        <span className="font-medium">92–98% accuracy</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Warm intro discovery rate</span>
                        <span className="font-medium">25–40% of prospects</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Email response rate lift (vs generic)</span>
                        <span className="font-medium">3–5× higher</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Meeting booking rate</span>
                        <span className="font-medium">5–12% of contacted prospects</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Cost per qualified meeting booked</span>
                        <span className="font-medium">$25–$60</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Commercial Assumptions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Customer acquisition cost (CAC)</span>
                        <span className="font-medium">2–4× monthly ARPU</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Expected payback period</span>
                        <span className="font-medium">3–6 months</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Customer churn rate</span>
                        <span className="font-medium">2–4% monthly</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">NRR (seat expansion potential)</span>
                        <span className="font-medium">115–140%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* SECTION 11: TYPICAL ROI & PAYBACK MODELS */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">Typical ROI & Payback Models</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Early Stage (1–2 SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$150–$300</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Cost per meeting booked</span>
                  <span className="font-semibold">$30–$50</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly meetings generated</span>
                  <span className="font-semibold">5–10</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">1–2 weeks</span>
                </div> */}
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Growth Stage (5–10 SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$500–$1,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Cost per meeting booked</span>
                  <span className="font-semibold">$25–$40</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly meetings generated</span>
                  <span className="font-semibold">40–80</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">3–5 days</span>
                </div> */}
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise (20+ SDRs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$2,000–$5,000+</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Cost per meeting booked</span>
                  <span className="font-semibold">$20–$35</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly meetings generated</span>
                  <span className="font-semibold">200–500+</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">1–3 days</span>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 12: WAITLIST CONVERSION */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Clone and customize this pricing model</h2>
          <p className="text-muted-foreground mb-8">
            Join the waitlist to access this pricing blueprint inside AskScrooge.ai and adapt it to your AI SDR agent.
          </p>
          <Button size="lg" className="text-lg group mb-8" onClick={() => setShowWaitlist(true)}>
            Join the Waitlist
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="text-left max-w-md mx-auto">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Switch between 5 pricing models instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Adjust prospect volume, team size, and research depth</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Compare cost per meeting booked and payback periods</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Export pricing and metering logic for your product</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 13: SOCIAL PROOF & RESOURCES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Learn how others are thinking about pricing AI SDRs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Youtube className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">YouTube Video</h3>
                <p className="text-sm text-muted-foreground">
                  "Walkthrough: Pricing AI SDR Agents with Tiered Prospect Bundles"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Twitter className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">X / Twitter Thread</h3>
                <p className="text-sm text-muted-foreground">
                  "Thread: Why AI SDR pricing should be per prospect, not per credit"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Linkedin className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">LinkedIn Post</h3>
                <p className="text-sm text-muted-foreground">
                  "Post: How we built $99/month AI SDR pricing that beats Apollo"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 14: EDUCATIONAL FOOTNOTES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">How Pricing Works for AI SDR Agents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We price AI SDR agents as a <strong>cost per prospect researched or per SDR seat</strong>, not as generic credits. This ensures fair pricing and clear ROI for buyers.
              </p>
              <p className="text-sm">
                <strong>Key principles:</strong>
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Prospects per month is the unit:</strong> Easy to understand and compete on.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Research depth matters:</strong> LinkedIn-only is cheaper than multi-platform deep research.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Seat-based for scale:</strong> Teams should migrate to seat pricing as they grow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>ROI is the real anchor:</strong> Cost per meeting booked is the true success metric.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Simplicity wins:</strong> Self-serve pricing (Model 1) closes deals fastest.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 15: FOOTER */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-4">
            <Link to="/" className="text-xl font-bold gradient-text">
              AskScrooge.ai
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                App
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <span className="text-muted-foreground/40">|</span>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-lg">
              This page presents illustrative pricing assumptions for educational purposes. Actual pricing should be validated with your specific use case and cost structure.
            </p>
          </div>
        </div>
      </footer>

      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default AiSdrAgentBlueprint;
