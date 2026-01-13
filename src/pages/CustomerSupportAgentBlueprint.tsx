import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistDialog } from "@/components/WaitlistDialog";
import { CustomerSupportPricingCalculator } from "@/components/CustomerSupportPricingCalculator";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, FileText, Youtube, Twitter, Linkedin, Globe, Users, TrendingUp } from "lucide-react";


const CustomerSupportAgentBlueprint = () => {
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
                Customer Support Agent – <span className="gradient-text">Pricing Blueprint</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
                Six proven pricing models for AI customer support agents that handle ticket deflection, agent augmentation, and tier-1 resolution.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Price based on geography, capabilities, and deflection impact—not just seats.
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
                    <span className="font-semibold text-accent">Geography-Indexed ARPU</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Unit of value</span>
                    <span className="font-semibold">Per-AI-Agent per month</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Key metric</span>
                    <span className="font-semibold">% of human agent cost</span>
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

      {/* SECTION 2: SIX PRICING MODELS OVERVIEW */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Six Proven Pricing Models for Customer Support AI</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Each model is optimized for different customer segments, geographies, and business models. Choose the one that best aligns with your go-to-market strategy.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Model 1 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-accent" />
                  Per-AI-Agent Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">⭐</span>
                  <span className="text-sm">DEFAULT. Best for SMBs, mid-market, fast conversion</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> % of human agent cost in buyer's geography
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Price per AI agent per month, indexed to local human support costs."
                </p>
              </CardContent>
            </Card>

            {/* Model 2 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Capability-Tiered Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">2</span>
                  <span className="text-sm">Best for buyers with different support maturity levels</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Base agent price × capability multiplier
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Pay more only when you need voice, reasoning, or advanced workflows."
                </p>
              </CardContent>
            </Card>

            {/* Model 3 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-accent" />
                  AI Copilot for Human Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">3</span>
                  <span className="text-sm">Best for offshore teams, BPOs, blended human+AI ops</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> Productivity uplift per human agent
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Increase each agent's throughput instead of replacing headcount."
                </p>
              </CardContent>
            </Card>

            {/* Model 4 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Check className="h-5 w-5 text-accent" />
                  Deflection-Based Hybrid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">4</span>
                  <span className="text-sm">Best for e-commerce, high ticket volumes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> % of ticket cost saved (geo-indexed)
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Base fee + bonus only when tickets are deflected."
                </p>
              </CardContent>
            </Card>

            {/* Model 5 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-accent" />
                  Knowledge-Base Complexity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">5</span>
                  <span className="text-sm">Best for hardware, SaaS, regulated products</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> AI agents + documentation scale
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "More complex products pay slightly more."
                </p>
              </CardContent>
            </Card>

            {/* Model 6 */}
            <Card className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-accent" />
                  Enterprise Platform License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">6</span>
                  <span className="text-sm">Best for banks, insurers, governments</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Anchor:</strong> % of total support payroll
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "Annual license priced as a fraction of your support workforce."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT THE CUSTOMER SUPPORT AGENT DOES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">What the Customer Support Agent Does</h2>
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
                    <span>Handles tier-1 support questions via FAQ and knowledge base</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Deflects simple tickets without human involvement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Routes complex tickets to human agents with context</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Provides real-time suggestions to human agents (copilot mode)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Learns from resolved tickets and knowledge updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Available 24/7 across voice, chat, and email channels</span>
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
                    <span>Replacement for human support agents (complementary tool)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Financial or legal advice (unless trained on compliance docs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Integration with custom legacy support systems (fees may apply)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Phone-based support (voice routing only)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE PRICING CALCULATOR */}
      <section id="pricing-calculator" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Interactive Pricing Calculator</h2>
          <p className="text-center text-muted-foreground mb-10">
            Simulate pricing, ROI, and human cost savings for your AI Customer Support Agents.
            Adjust geography, team size, and capabilities to see real-world impact instantly.
          </p>

          <CustomerSupportPricingCalculator blueprint="customer-support-agent" />
        </div>
      </section>

      {/* SECTION 5: GEOGRAPHY PRICING REFERENCE */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">Average Human Support Costs by Geography</h2>
          <Card className="border-accent/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">🇺🇸 United States / Canada</span>
                  <span className="font-semibold">$3,500–$5,000 / month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">🇪🇺 Europe / UK</span>
                  <span className="font-semibold">$2,800–$4,200 / month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">🇮🇳 India</span>
                  <span className="font-semibold">$600–$1,200 / month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">🇵🇭 Southeast Asia (Philippines, Vietnam)</span>
                  <span className="font-semibold">$700–$1,400 / month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">🌎 LATAM</span>
                  <span className="font-semibold">$1,200–$2,200 / month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">🌍 Africa</span>
                  <span className="font-semibold">$500–$1,000 / month</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-muted p-4 rounded-lg mt-6">
                <strong>Source:</strong> Industry benchmarks (2024-2025). Includes salary + benefits + overhead. Adjust in calculator for your specific region.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 6: COST & MARGIN TRANSPARENCY */}
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
                    <h4 className="font-semibold mb-2">COGS Per AI Agent (Monthly)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">LLM token costs</span>
                        <span className="font-medium">$80–$150</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Infrastructure & hosting</span>
                        <span className="font-medium">$30–$60</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Knowledge base updates & indexing</span>
                        <span className="font-medium">$10–$25</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Monitoring, logging, backup</span>
                        <span className="font-medium">$15–$30</span>
                      </div>
                      <div className="flex justify-between items-center font-semibold mt-2">
                        <span>Total COGS per AI Agent</span>
                        <span>$135–$265 / month</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Pricing Strategy</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Per-Agent ARPU (US example)</span>
                        <span className="font-medium">$400–$800 / month</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Gross Margin Target</span>
                        <span className="font-medium">60–75%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Volume discounts (50+ agents)</span>
                        <span className="font-medium">10–20% off</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Enterprise floor (minimum deal)</span>
                        <span className="font-medium">$2,000–$5,000 / month</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg mt-4">
                  <strong>Disclaimer:</strong> All assumptions are conservative estimates and fully editable inside AskScrooge.ai. Actual costs vary by model selection, prompt complexity, knowledge base size, and channel (voice adds 15–30% cost).
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
                    <h4 className="font-semibold mb-2">AI Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Ticket deflection rate (typical)</span>
                        <span className="font-medium">30–60%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">First-contact resolution (tier-1)</span>
                        <span className="font-medium">75–95%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Response accuracy</span>
                        <span className="font-medium">92–98%</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Avg resolution time (AI vs human)</span>
                        <span className="font-medium">2 min vs 15 min</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Human agent productivity lift (copilot)</span>
                        <span className="font-medium">25–40%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Availability (uptime SLA)</span>
                        <span className="font-medium">99.9% (enterprise), 99.5% (standard)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Commercial Assumptions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Customer acquisition cost (CAC)</span>
                        <span className="font-medium">1–3× monthly ARPU</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Expected payback period</span>
                        <span className="font-medium">4–8 months</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-border">
                        <span className="text-muted-foreground">Customer churn rate</span>
                        <span className="font-medium">2–5% monthly</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">NRR (upsell potential)</span>
                        <span className="font-medium">110–130%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* SECTION 7: BREAKEVEN & ROI */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">Typical ROI & Payback Models</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">SMB (1–5 agents)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$500–$2,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Human cost saved</span>
                  <span className="font-semibold">$2,500–$10,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly ROI</span>
                  <span className="font-semibold text-accent">3–8×</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">4–8 weeks</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Mid-Market (10–50 agents)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$3,000–$15,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Human cost saved</span>
                  <span className="font-semibold">$15,000–$75,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly ROI</span>
                  <span className="font-semibold text-accent">4–10×</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">3–6 weeks</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise (100+ agents)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly cost</span>
                  <span className="font-semibold">$20,000–$100,000+</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Human cost saved</span>
                  <span className="font-semibold">$150,000–$750,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Monthly ROI</span>
                  <span className="font-semibold text-accent">6.2–15×</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback period</span>
                  <span className="font-semibold">2–4 weeks</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 8: WAITLIST CONVERSION */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Clone and customize this pricing model</h2>
          <p className="text-muted-foreground mb-8">
            Join the waitlist to access this pricing blueprint inside AskScrooge.ai and adapt it to your customer support agent.
          </p>
          <Button size="lg" className="text-lg group mb-8" onClick={() => setShowWaitlist(true)}>
            Join the Waitlist
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="text-left max-w-md mx-auto">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Switch between 6 pricing models instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Adjust geography, capabilities, and ROI assumptions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Compare breakeven analysis and payback periods</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Export pricing and metering logic for your product</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 9: SOCIAL PROOF & RESOURCES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Learn how others are thinking about pricing customer support agents
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Youtube className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">YouTube Video</h3>
                <p className="text-sm text-muted-foreground">
                  "Walkthrough: Pricing a Customer Support Agent with Geography-Indexed ARPU"
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
                  "Thread: Why customer support AI should be priced by deflection, not by seat"
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
                  "Post: How we modeled geography-indexed pricing for customer support AI"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 10: EDUCATIONAL FOOTNOTES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">How Pricing Works for Customer Support AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                We price AI agents as a <strong>fraction of human support cost in your geography</strong>. This ensures fair pricing across onshore and offshore teams while maintaining strong ROI.
              </p>
              <p className="text-sm">
                <strong>Key principles:</strong>
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Geography matters:</strong> A support agent in India costs 1/5 what one costs in the US. Your AI pricing should reflect that economic reality.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Deflection drives ROI:</strong> Every ticket the AI resolves saves you the cost of a human agent handling it. Price captures this value.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Capability tiers exist:</strong> FAQ-only agents are cheaper than voice+reasoning agents. Let buyers choose their maturity level.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Simplicity wins:</strong> Complex models confuse buyers. Per-agent pricing (Model 1) closes deals fastest.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span><strong>Volume discounts matter:</strong> Teams scaling from 1 to 100 agents need pricing that rewards loyalty, not cannibalization.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 11: FOOTER */}
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

export default CustomerSupportAgentBlueprint;
