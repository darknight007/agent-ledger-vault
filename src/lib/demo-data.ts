// Consistent mock data flowing through the entire demo
// 42 resolutions × $1 = $42 is the core narrative thread

export const DEMO_PRICING_RULE = {
  metric: "ticket_resolved",
  displayName: "Ticket Resolved",
  pricePerUnit: 1.0,
  currency: "USD",
};

export const DEMO_SIMULATION = {
  monthlyVolume: 4200,
  revenue: 4200,
  aiCost: 380,
  margin: 91,
  marginAmount: 3820,
  breakdown: [
    { label: "LLM Inference (GPT-4o)", cost: 280 },
    { label: "Embedding / RAG", cost: 60 },
    { label: "Infrastructure", cost: 40 },
  ],
};

export const DEMO_INVOICE = {
  id: "INV-2026-0042",
  customer: "Acme AI Support",
  customerId: "cust_acme_001",
  date: "Feb 11, 2026",
  dueDate: "Mar 11, 2026",
  status: "paid" as const,
  lineItems: [
    {
      description: "AI Ticket Resolutions",
      metric: "ticket_resolved",
      quantity: 42,
      unitPrice: 1.0,
      total: 42.0,
    },
  ],
  subtotal: 42.0,
  tax: 0,
  total: 42.0,
  stripeTestMode: true,
};

export const DEMO_DASHBOARD = {
  revenue: 4200,
  aiCost: 380,
  margin: 91,
  totalEvents: 4200,
  activeCustomers: 12,
  revenueChart: [
    { month: "Sep", revenue: 1200, cost: 140 },
    { month: "Oct", revenue: 1800, cost: 190 },
    { month: "Nov", revenue: 2400, cost: 240 },
    { month: "Dec", revenue: 3100, cost: 300 },
    { month: "Jan", revenue: 3600, cost: 340 },
    { month: "Feb", revenue: 4200, cost: 380 },
  ],
};

export const DEMO_CHAT_MESSAGES = [
  { role: "user" as const, text: "I can't access my account after the password reset", delay: 0 },
  { role: "ai" as const, text: "I've verified your identity and reset your access credentials. You should receive a new login link in your email within 30 seconds.", delay: 1500 },
  { role: "system" as const, text: "Ticket #4,187 resolved automatically", delay: 3500 },
];

export const DEMO_TERMINAL_EVENTS = [
  { time: "14:32:01", event: 'scrooge.track("ticket_resolved", { customer: "acme" })' },
  { time: "14:32:03", event: "Event accepted → ledger updated" },
  { time: "14:32:04", event: 'scrooge.track("ticket_resolved", { customer: "acme" })' },
  { time: "14:32:06", event: "Event accepted → ledger updated" },
  { time: "14:32:08", event: 'scrooge.track("ticket_resolved", { customer: "beta_corp" })' },
  { time: "14:32:09", event: "Event accepted → ledger updated" },
];

export const DEMO_SDK_SNIPPET = `# One line. That's it.
scrooge.track("ticket_resolved")`;

export const DEMO_METRICS = [
  { key: "ticket_resolved", label: "Ticket Resolved", icon: "Zap" },
  { key: "research_completed", label: "Research Completed", icon: "Search" },
  { key: "content_generated", label: "Content Generated", icon: "FileText" },
  { key: "lead_qualified", label: "Lead Qualified", icon: "UserCheck" },
];
