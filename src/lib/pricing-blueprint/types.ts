/**
 * Core data models and TypeScript interfaces for Pricing Blueprint Scaling system
 * Defines all types used across the 9-agent workflow and supporting systems
 */

// ============================================================================
// Archetype and Agent Profile Types
// ============================================================================

export interface Archetype {
  id: string;
  name: string;
  description: string;
  category: string;
  primaryUseCase: string;
  targetICP: string;
  keyFeatures: string[];
  estimatedMarketSize: number;
  tokenConsumption: 'low' | 'medium' | 'high';
  userBaseSize: number;
  growthPotential: number;
  priority: number;
  similarArchetypes: string[];
  metadata: Record<string, any>;
}

export interface ArchetypeFilter {
  category?: string;
  useCase?: string;
  minPriority?: number;
  tokenConsumption?: string;
}

export interface AgentProfile {
  name: string;
  description: string;
  primaryUseCase: string;
  targetICP: string;
  keyFeatures: string[];
  estimatedMarketSize: number;
  competitivePosition: string;
}

// ============================================================================
// Value Metrics and Pricing Types
// ============================================================================

export interface ValueMetric {
  id: string;
  name: string;
  description: string;
  unit: string;
  measurable: boolean;
  observable: boolean;
  frequency: string;
  examples: string[];
}

export type PricingArchetypeType =
  | 'seat-based'
  | 'usage-based'
  | 'credits'
  | 'hybrid'
  | 'outcome-based'
  | 'enterprise-only';

export interface PricingArchetype {
  type: PricingArchetypeType;
  rationale: string;
  pros: string[];
  cons: string[];
}

export interface Feature {
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface UsageLimit {
  meter: string;
  limit: number;
  overage: {
    type: 'per-unit' | 'tiered' | 'blocked';
    price?: number;
  };
}

export interface Tier {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: Feature[];
  usageLimits: UsageLimit[];
  targetSegment: string;
}

// ============================================================================
// Meter and Telemetry Types
// ============================================================================

export interface TelemetryEvent {
  name: string;
  description: string;
  properties: Record<string, string>;
  frequency: 'high' | 'medium' | 'low';
  accuracy: number; // 0-100
}

export interface TelemetryMapping {
  meter: Meter;
  telemetryEvents: TelemetryEvent[];
  existingEvents: TelemetryEvent[];
  newEventsRequired: TelemetryEvent[];
  implementationGuidance: string;
  estimatedEffort: number; // in hours
  fraudMitigations: string[];
}

export interface Meter {
  id: string;
  name: string;
  description: string;
  unit: string;
  telemetryMapping: TelemetryMapping;
  accuracy: number;
  fraudRisk: 'low' | 'medium' | 'high';
}

// ============================================================================
// Calibration and Risk Types
// ============================================================================

export interface ComparisonResult {
  proposedPrice: number;
  marketAverage: number;
  percentileRank: number;
  isOutlier: boolean;
  recommendation: string;
}

export interface PriceCalibration {
  methodology: string;
  benchmarkComparison: ComparisonResult;
  marketAlignment: string;
  confidenceLevel: number;
  assumptions: string[];
}

export interface Risk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface ComplianceIssue {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  resolution: string;
}

export interface RiskAssessment {
  risks: Risk[];
  complianceIssues: ComplianceIssue[];
  fairnessAnalysis: string;
  mitigationStrategies: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implementationGuidance: string;
}

// ============================================================================
// Blueprint Types
// ============================================================================

export interface BlueprintMetadata {
  createdDate: Date;
  lastUpdated: Date;
  author: string;
  status: 'draft' | 'approved' | 'published';
  version: number;
  qualityScore: number;
}

export interface Blueprint {
  id: string;
  archetypeId: string;
  archetype: Archetype;

  // Template sections
  agentProfile: AgentProfile;
  valueMetrics: ValueMetric[];
  pricingArchetype: PricingArchetype;
  tiers: Tier[];
  meters: Meter[];
  calibration: PriceCalibration;
  risks: RiskAssessment;
  recommendations: Recommendation[];

  // Metadata
  metadata: BlueprintMetadata;

  // Outputs
  markdownContent: string;
  jsonSchema: Record<string, any>;
  pricingPage?: string;
  documentation?: Documentation;
  variants?: PricingVariant[];
}

// ============================================================================
// Documentation Types
// ============================================================================

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  owner?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'guide' | 'template' | 'tool';
}

export interface Documentation {
  rationale: string;
  assumptions: string[];
  tradeoffs: string[];
  riskAssessment: string;
  implementationChecklist: ChecklistItem[];
  faq: FAQItem[];
  relatedResources: Resource[];
}

// ============================================================================
// Variant Types
// ============================================================================

export interface PricingVariant {
  id: string;
  name: string;
  pricingArchetype: PricingArchetypeType;
  tiers: Tier[];
  rationale: string;
  pros: string[];
  cons: string[];
  estimatedRevenue: number;
  estimatedCAC: number;
}

export interface VariantComparison {
  variants: PricingVariant[];
  analysis: {
    revenueComparison: string;
    customerAcquisitionComparison: string;
    churnRiskComparison: string;
    recommendation: string;
  };
}

// ============================================================================
// Workflow Agent Types
// ============================================================================

export interface WorkflowContext {
  batchId: string;
  archetypeId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface AgentInput {
  archetype: Archetype;
  previousOutputs: Map<string, AgentOutput>;
  context: WorkflowContext;
}

export interface AgentOutput {
  agentName: string;
  data: Record<string, any>;
  metadata: {
    executionTime: number;
    tokensUsed: number;
    confidence: number;
  };
}

export interface WorkflowAgent {
  name: string;
  execute(input: AgentInput): Promise<AgentOutput>;
  validate(output: AgentOutput): ValidationResult;
}

// ============================================================================
// Batch Processing Types
// ============================================================================

export interface BatchOptions {
  concurrencyLimit: number;
  retryPolicy: RetryPolicy;
  timeoutPerAgent: number;
  priorityLevel: 'low' | 'normal' | 'high';
}

export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}

export interface BatchStatus {
  batchId: string;
  state: 'queued' | 'processing' | 'completed' | 'failed';
  progress: BatchProgress;
  startTime: Date;
  estimatedCompletionTime: Date;
}

export interface FailureReport {
  archetypeId: string;
  archetypeName: string;
  error: string;
  failedAgent: string;
  timestamp: Date;
  retryCount: number;
}

export interface BatchResults {
  batchId: string;
  blueprints: Blueprint[];
  failedArchetypes: FailureReport[];
  summary: {
    successCount: number;
    failureCount: number;
    averageQualityScore: number;
    totalProcessingTime: number;
  };
}

// ============================================================================
// Validation and QA Types
// ============================================================================

export interface ValidationCheck {
  name: string;
  category: 'completeness' | 'consistency' | 'feasibility' | 'market-alignment';
  passed: boolean;
  details: string;
}

export interface ValidationIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  checks: ValidationCheck[];
  issues: ValidationIssue[];
  recommendations: string[];
}

// ============================================================================
// Benchmark Types
// ============================================================================

export interface CompetitorPricing {
  competitor: string;
  product: string;
  pricing: number;
  pricingModel: string;
  features: string[];
  targetSegment: string;
}

export interface PricingTrend {
  date: Date;
  averagePrice: number;
  medianPrice: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface BenchmarkData {
  competitors: CompetitorPricing[];
  marketAverage: number;
  marketMedian: number;
  percentiles: { p25: number; p50: number; p75: number; p90: number };
  trends: PricingTrend[];
}

export interface OutlierAnalysis {
  isOutlier: boolean;
  deviation: number;
  percentileRank: number;
  recommendation: string;
}

export interface PricingRecommendation {
  title: string;
  description: string;
  suggestedPrice: number;
  rationale: string;
  confidence: number;
}

// ============================================================================
// Telemetry Feasibility Types
// ============================================================================

export interface ExistingEvent {
  name: string;
  description: string;
  available: boolean;
}

export interface MissingEvent {
  name: string;
  description: string;
  estimatedEffort: number;
  priority: 'low' | 'medium' | 'high';
}

export interface EffortEstimate {
  totalHours: number;
  breakdown: {
    implementation: number;
    testing: number;
    documentation: number;
  };
  riskFactors: string[];
}

export interface ObservabilityResult {
  observable: boolean;
  accuracy: number;
  challenges: string[];
  recommendations: string[];
}

export interface FraudVector {
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

// ============================================================================
// Feedback and Compliance Types
// ============================================================================

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Feedback {
  id: string;
  blueprintId: string;
  author: string;
  type: 'accuracy' | 'completeness' | 'clarity' | 'feasibility';
  content: string;
  timestamp: Date;
  addressed: boolean;
}

export interface ComplianceReview {
  blueprintId: string;
  passed: boolean;
  issues: ComplianceIssue[];
  recommendations: string[];
  reviewedBy: string;
  reviewDate: Date;
}

// ============================================================================
// Search and Filter Types
// ============================================================================

export interface SearchQuery {
  archetype?: string;
  category?: string;
  minQualityScore?: number;
  status?: 'draft' | 'approved' | 'published';
  dateRange?: { start: Date; end: Date };
}

export interface BlueprintVersion {
  version: number;
  timestamp: Date;
  author: string;
  changes: string;
  blueprint: Blueprint;
}

// ============================================================================
// JSON Schema Validation Types
// ============================================================================

export interface JSONSchema {
  $schema: string;
  type: string;
  properties: Record<string, any>;
  required: string[];
  additionalProperties: boolean;
  definitions?: Record<string, any>;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
