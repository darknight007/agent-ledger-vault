# Customer Support Agent - Technical Specifications

## Files Structure

```
src/
├── pages/
│   └── CustomerSupportAgentBlueprint.tsx (714 lines)
│       └── Main blueprint page with 11 sections
└── components/
    └── CustomerSupportPricingCalculator.tsx (1,100+ lines)
        └── Interactive calculator with 6 pricing models
```

---

## Component Specifications

### CustomerSupportAgentBlueprint.tsx

**Exports**: `default CustomerSupportAgentBlueprint`

**Dependencies**:
- React hooks: `useState`
- React Router: `Link`
- Shadcn UI: Button, Card, Select, Accordion, Dialog, Tooltip, Alert
- Lucide Icons: 10+ icons
- Custom components: Navigation, WaitlistDialog, CustomerSupportPricingCalculator

**State Management**:
```typescript
const [showWaitlist, setShowWaitlist] = useState(false);
```

**Functions**:
- `scrollToCalculator()`: Smooth scroll to pricing calculator section

**Key Features**:
- 11 main sections (Hero, Models, Capabilities, Calculator, Geography, Transparency, ROI, Waitlist, Resources, Footnotes, Footer)
- Responsive grid layouts (LG breakpoints)
- Gradient accents and animations
- Accordion for expandable content

---

### CustomerSupportPricingCalculator.tsx

**Exports**: Named export `CustomerSupportPricingCalculator`

**Props**:
```typescript
interface CustomerSupportPricingCalculatorProps {
  blueprint?: string; // Default: "customer-support-agent"
}
```

**Type Definitions**:
```typescript
type PricingModel =
  | "Per-AI-Agent Pricing"
  | "Capability-Tiered AI Agents"
  | "AI Copilot for Human Agents"
  | "Deflection-Based Hybrid"
  | "Knowledge-Base Complexity"
  | "Enterprise Platform License";

type Geography = 
  | "US/Canada"
  | "Europe/UK"
  | "India"
  | "Southeast Asia"
  | "LATAM"
  | "Africa";

type CoverageLevelType = 
  | "FAQ & Tier-1"
  | "Mixed Support"
  | "Complex / Regulated";

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
    "US/Canada": number;
    "Europe/UK": number;
    "India": number;
    "Southeast Asia": number;
    "LATAM": number;
    "Africa": number;
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
```

**State Variables**:
```typescript
const [inputs, setInputs] = useState<CalculatorInputs>({...});
const [assumptions, setAssumptions] = useState<Assumptions>({...});
const [showAssumptions, setShowAssumptions] = useState(false);
```

**Calculation Engine**:

Returns calculated metrics based on selected pricing model:

#### Model 1: Per-AI-Agent Pricing
```
basePrice = humanCost × (valueCapture / 100)
finalPrice = basePrice × (1 - volumeDiscount) if numAgents >= threshold
totalRevenue = finalPrice × numAgents
grossMargin = (totalRevenue - totalCogs) / totalRevenue × 100
```

#### Model 2: Capability-Tiered AI Agents
```
baseTierPrice = humanCost × 0.10
multipliers = {Assist: 1.0, Resolve: 1.5, Concierge: 2.2}
pricePerAgent = baseTierPrice × tierMultiplier
totalRevenue = pricePerAgent × numAgents
```

#### Model 3: AI Copilot for Human Agents
```
productivityValue = humanCost × (productivityLift / 100)
pricePerAgent = productivityValue × 0.45
totalRevenue = pricePerAgent × humanAgentsCount
```

#### Model 4: Deflection-Based Hybrid
```
baseFee = humanCost × 0.05
costPerTicket = humanCost / 200
deflectionBonus = deflectedTickets × costPerTicket × 0.25
pricePerAgent = baseFee + deflectionBonus
totalRevenue = pricePerAgent × numAgents
```

#### Model 5: Knowledge-Base Complexity
```
basePrice = humanCost × 0.10
complexityFactor = min(2.0, 1.0 + documentPages / 1000)
updateSurcharge = avgUpdates × 5
pricePerAgent = (basePrice × complexityFactor) + (updateSurcharge / numAgents)
```

#### Model 6: Enterprise Platform License
```
totalPayroll = humanCost × totalHumanAgents × 12
annualLicense = totalPayroll × 0.12
monthlyLicense = annualLicense / 12
contractMultiplier = {1: 1.0, 2: 0.92, 3: 0.85}
finalMonthly = monthlyLicense × contractMultiplier
```

**Output Metrics**:
```typescript
{
  pricePerAgent: number;
  totalMonthlyRevenue: number;
  totalCogs: string; // formatted
  grossMargin: string; // percentage
  humanCostPerAgent: number;
  humanCostAvoided: string; // formatted
  netMonthlySavings: string; // formatted
  roiMultiple: string; // formatted
  paybackMonths: number;
  breakEvenAgents: number;
  month6Projection: string; // formatted
  displayMetrics: {
    [key: string]: any; // Model-specific metrics
  };
}
```

**Components Used**:
- Card (with Header, Title, Content)
- Button
- Slider (for numeric ranges)
- Select (with Trigger, Content, Item)
- Dialog (for Assumptions)
- Label
- Input
- Alert
- Tooltip (with Provider, Trigger, Content)
- Multiple Lucide icons

**Analytics Integration**:
```typescript
// Tracked events:
- "pricing_calculator_viewed" (on mount)
- "model_selected" (on model change)
```

---

## Data Sources & Defaults

### Human Cost Assumptions (Monthly)
```javascript
{
  "US/Canada": 4250,
  "Europe/UK": 3500,
  "India": 900,
  "Southeast Asia": 1050,
  "LATAM": 1700,
  "Africa": 750,
}
```

### COGS Components
- LLM Cost per Agent: $120/month
- Infrastructure Cost: $45/month
- **Total Base COGS**: $165/month

### Model-Specific Defaults
- Value Capture Rate: 15% (5–30%)
- Productivity Lift: 35% (20–60%)
- Deflection Rate: 40% (10–80%)
- Ticket Volume: 1,000/month
- Documentation Pages: 500
- Updates/Month: 20
- Contract Length: 1 year

### Commercial Assumptions
- Management Overhead: 20%
- AI Replacement Ratio: 0.4 (40%)
- Ticket Resolution Accuracy: 95%
- Voice Usage: 20%
- Volume Discount Threshold: 50 agents
- Volume Discount Rate: 15%
- Expected Gross Margin: 60–75%

---

## UI Component Layout

### Grid Sections:
1. **Pricing Model Selector** (Full width)
2. **Geography Selector** (Full width)
3. **Core Variables** (Full width with sliders)
4. **Pricing & Value Summary** (MD: 2 columns)
5. **ROI & Savings** (MD: 4 columns)
6. **Scale Impact** (MD: 3 columns)
7. **Payback & Breakeven** (MD: 3 columns)
8. **Edit Assumptions** (Full width button)
9. **Educational Footnotes** (Full width alert)

### Responsive Breakpoints:
- Mobile: Single column, full width
- Tablet (MD): 2 columns where applicable
- Desktop: Full layouts with proper spacing

---

## Styling & Theming

**Color System**:
- Primary accent: `bg-accent`, `text-accent`
- Muted backgrounds: `bg-muted/30`, `bg-muted/50`
- Text colors: `text-foreground`, `text-muted-foreground`
- Borders: `border-accent/30`, `border-destructive/30`

**CSS Classes Used**:
- Spacing: `px-4`, `py-16`, `gap-6`, `gap-8`
- Sizing: `max-w-7xl`, `max-w-4xl`, `max-w-2xl`
- Typography: `text-3xl`, `text-xl`, `font-bold`, `font-semibold`
- Effects: `shadow-lg`, `hover:shadow-lg`, `transition-shadow`
- Grid: `grid`, `md:grid-cols-2`, `md:grid-cols-3`, `md:grid-cols-4`

---

## Route Configuration

```typescript
// In App.tsx
<Route 
  path="/pricing-blueprints/customer-support-agent" 
  element={<CustomerSupportAgentBlueprint />} 
/>
```

**Full URL**: `https://askscrooge.com/pricing-blueprints/customer-support-agent`

**Scroll Targets**:
- `#pricing-calculator` → Interactive calculator section
- `#cost-transparency` → Cost breakdown accordion

---

## Performance Optimizations

1. **Lazy Calculations**: Models calculated only when inputs change
2. **Memoization**: No unnecessary re-renders via `useCallback`
3. **Analytics**: Non-blocking event tracking
4. **Dialog**: Assumptions panel only rendered when opened

---

## Accessibility Features

1. **Tooltips**: Hover help on geography selector and key metrics
2. **Labels**: All inputs have associated labels
3. **Semantic HTML**: Proper heading hierarchy (h2, h3, h4)
4. **Color Contrast**: Text meets WCAG AA standards
5. **Icon + Text**: All icons paired with text descriptions
6. **Keyboard Navigation**: All inputs keyboard accessible

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 18+
- CSS Grid and Flexbox support required
- JavaScript ES6+ support required

---

## Future Enhancement Opportunities

1. **Data Export**: Download pricing model as PDF/JSON
2. **API Integration**: Fetch customer-specific cost data
3. **Historical Tracking**: Compare pricing across time
4. **A/B Testing**: Test different pricing models by cohort
5. **ML-Powered Recommendations**: Suggest model based on customer profile
6. **Advanced Analytics**: Cohort analysis of model selection

---

## Deployment Checklist

- [x] TypeScript compilation successful
- [x] Vite build passes
- [x] No missing dependencies
- [x] Route added to App.tsx
- [x] Components properly exported
- [x] Styling consistent with design system
- [x] Responsive on mobile/tablet/desktop
- [x] Analytics events implemented
- [x] Tooltips and help text complete
- [x] Documentation files created

---

## Maintenance Notes

### Regular Updates Needed:
- **Monthly**: Update human cost assumptions by geography
- **Quarterly**: Review COGS estimates (LLM costs, infrastructure)
- **Annually**: Review gross margin targets and volume discounts
- **As needed**: Add new pricing models or geographies

### Monitoring:
- Google Analytics: Model selection frequency
- Support tickets: Questions about specific models
- Sales data: Which model wins most deals
- Conversion rates: Calculator → Customer

---

## Testing Checklist

### Functionality:
- [ ] All 6 models calculate correctly
- [ ] All 6 geographies show proper costs
- [ ] Sliders adjust values and results change
- [ ] Volume discounts apply at 50+ agents
- [ ] Contract discounts work in Model 6
- [ ] Assumptions dialog opens/closes
- [ ] Edit Assumptions changes calculations

### UI/UX:
- [ ] Calculator responsive on mobile
- [ ] Scroll to calculator works
- [ ] Pricing cards visually distinct
- [ ] Numbers format with proper decimals
- [ ] Color contrast meets accessibility
- [ ] Hover states work on interactive elements

### Performance:
- [ ] Calculator updates instantly on input change
- [ ] No lag when adjusting sliders
- [ ] Page loads within 3 seconds
- [ ] Assumptions dialog opens smoothly

---

## Support & Documentation

See companion documents:
- `CUSTOMER_SUPPORT_AGENT_IMPLEMENTATION.md` - Full feature overview
- `CUSTOMER_SUPPORT_QUICKSTART.md` - Sales/marketing quick start
- This file - Technical specifications
