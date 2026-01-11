import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WaitlistDialog } from "@/components/WaitlistDialog";
import { PricingCalculator } from "@/components/PricingCalculator";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, FileText, Youtube, Twitter, Linkedin } from "lucide-react";


const ResearchAgentBlueprint = () => {
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
                Research Agent – <span className="gradient-text">Pricing Blueprint</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
                A ready-to-use pricing model for an AI Research Agent that delivers structured memos and reports.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                1 agent run = 1 research task producing a memo or report.
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
                    <span className="font-semibold text-accent">Hybrid (Base + Usage)</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Unit of value</span>
                    <span className="font-semibold">Research task (1 memo/report)</span>
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


      {/* SECTION 3: WHAT THE RESEARCH AGENT DOES */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">What the Research Agent Does</h2>
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
                    <span>Performs web and source-based research</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Synthesizes findings into a structured memo or report</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Includes citations and source links</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                    <span>Exports output as document-ready format</span>
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
                    <span>Human validation or analyst review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Access to proprietary or paid databases (unless connected)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="h-4 w-4 text-destructive mt-1 shrink-0" />
                    <span>Regulated or legally binding advice</span>
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
            Simulate pricing for your research agent in real-time. Adjust the inputs below to see how different scenarios affect your pricing strategy.
          </p>

          <PricingCalculator blueprint="researcher-agent" />
        </div>
      </section>

      {/* SECTION 5: COST & MARGIN TRANSPARENCY */}
      <section id="cost-transparency" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how-pricing-calculated" className="border rounded-lg px-6">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                How pricing is calculated
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">LLM usage per research task</span>
                    <span className="font-medium">$0.20-0.50 (estimated)</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Tooling and search cost</span>
                    <span className="font-medium">$0.05-0.15</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Retry and quality buffer</span>
                    <span className="font-medium">+15-20%</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Target gross margin</span>
                    <span className="font-medium">55-75% (adjustable in calculator)</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg mt-4">
                  <strong>Disclaimer:</strong> All assumptions are conservative estimates and fully editable inside AskScrooge.ai. Actual costs may vary based on model selection, prompt complexity, and data sources used.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* SECTION 6: WAITLIST CONVERSION */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Clone and customize this pricing model</h2>
          <p className="text-muted-foreground mb-8">
            Join the waitlist to access this pricing blueprint inside AskScrooge.ai and adapt it to your agent.
          </p>
          <Button size="lg" className="text-lg group mb-8" onClick={() => setShowWaitlist(true)}>
            Join the Waitlist
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <div className="text-left max-w-md mx-auto">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Adjust assumptions and pricing logic</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Compare multiple pricing models</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-accent mt-1 shrink-0" />
                <span>Export pricing and metering logic</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 7: SOCIAL PROOF & CONTENT PLACEHOLDERS */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Learn how others are thinking about pricing research agents
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                  <Youtube className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold mb-2">YouTube Video</h3>
                <p className="text-sm text-muted-foreground">
                  "Walkthrough: Pricing a Research Agent"
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
                  "Thread: Why research agents should not be priced like SaaS seats"
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
                  "Post: How we modeled pricing for a research agent"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4 italic">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
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
              This page presents illustrative pricing assumptions for educational purposes.
            </p>
          </div>
        </div>
      </footer>

      <WaitlistDialog open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default ResearchAgentBlueprint;
