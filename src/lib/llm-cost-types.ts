/**
 * TypeScript interfaces for LLM model cost data and caching
 */

/**
 * Represents an LLM model with pricing information
 */
export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  costPer1MTokens: number;
  inputCostPer1MTokens?: number;
  outputCostPer1MTokens?: number;
  lastUpdated: Date;
}

/**
 * Represents the cost data for an LLM model
 * (same structure as LLMModel for consistency)
 */
export interface LLMModelCost {
  id: string;
  name: string;
  provider: string;
  costPer1MTokens: number;
  inputCostPer1MTokens?: number;
  outputCostPer1MTokens?: number;
  lastUpdated: Date;
}

/**
 * Represents cached LLM cost data with expiration information
 */
export interface LLMCostCache {
  data: LLMModelCost[];
  timestamp: number;
  expiresAt: number;
}
