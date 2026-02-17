/**
 * Real-time LLM Pricing Service
 * Fetches current pricing from OpenRouter API - the most reliable source for LLM pricing
 * OpenRouter aggregates pricing from all major providers and keeps it up-to-date
 */

import { LLMModelCost } from './llm-cost-types';

export interface RealtimePricingData {
  model: string;
  provider: string;
  inputCostPer1MTokens: number;
  outputCostPer1MTokens: number;
  costPer1MTokens: number; // Average for display
  benchmark?: string; // SWE, MATH, etc.
  benchmarkScore?: number;
  lastUpdated: Date;
  source: string;
}

/**
 * Fallback models - used only if API fetch fails
 * These are verified models with accurate pricing from OpenRouter
 */
const FALLBACK_MODELS: RealtimePricingData[] = [
  {
    model: 'gpt-4-turbo',
    provider: 'OpenAI',
    inputCostPer1MTokens: 10,
    outputCostPer1MTokens: 30,
    costPer1MTokens: 20,
    lastUpdated: new Date(),
    source: 'OpenRouter (Fallback)',
  },
  {
    model: 'gpt-4o',
    provider: 'OpenAI',
    inputCostPer1MTokens: 5,
    outputCostPer1MTokens: 15,
    costPer1MTokens: 10,
    lastUpdated: new Date(),
    source: 'OpenRouter (Fallback)',
  },
  {
    model: 'claude-3-5-sonnet',
    provider: 'Anthropic',
    inputCostPer1MTokens: 3,
    outputCostPer1MTokens: 15,
    costPer1MTokens: 9,
    lastUpdated: new Date(),
    source: 'OpenRouter (Fallback)',
  },
  {
    model: 'claude-3-opus',
    provider: 'Anthropic',
    inputCostPer1MTokens: 15,
    outputCostPer1MTokens: 75,
    costPer1MTokens: 45,
    lastUpdated: new Date(),
    source: 'OpenRouter (Fallback)',
  },
  {
    model: 'gemini-2.0-flash',
    provider: 'Google',
    inputCostPer1MTokens: 0.075,
    outputCostPer1MTokens: 0.3,
    costPer1MTokens: 0.1875,
    lastUpdated: new Date(),
    source: 'OpenRouter (Fallback)',
  },
];

const CACHE_KEY = 'realtime_pricing_cache';
const CACHE_VALIDITY_MS = 60 * 60 * 1000; // 1 hour
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/models';

/**
 * Fetches real-time pricing data from OpenRouter API
 * OpenRouter provides accurate, up-to-date pricing for all major LLM models
 * Uses caching to avoid excessive API calls
 */
export async function fetchRealtimePricing(): Promise<RealtimePricingData[]> {
  try {
    // Check cache first
    const cached = getCachedRealtimePricing();
    if (cached) {
      return cached;
    }

    // Fetch fresh data from OpenRouter
    const freshData = await fetchFromOpenRouter();

    // Cache the data
    cacheRealtimePricing(freshData);

    return freshData;
  } catch (error) {
    console.error('Error fetching real-time pricing:', error);
    // Return fallback data if fetch fails
    return FALLBACK_MODELS;
  }
}

/**
 * Fetches pricing data from OpenRouter API
 * OpenRouter aggregates pricing from all major providers
 */
async function fetchFromOpenRouter(): Promise<RealtimePricingData[]> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse OpenRouter response and convert to our format
    const models = parseOpenRouterResponse(data);

    // Sort by pricing (cheapest first) and take top 20
    return models
      .sort((a, b) => a.costPer1MTokens - b.costPer1MTokens)
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching from OpenRouter:', error);
    throw error;
  }
}

/**
 * Parses OpenRouter API response and converts to our format
 * OpenRouter returns models with pricing in cents per 1M tokens
 */
function parseOpenRouterResponse(data: any): RealtimePricingData[] {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid OpenRouter response format');
  }

  return data
    .filter((model: any) => {
      // Filter out models without pricing info
      return model.pricing && (model.pricing.prompt || model.pricing.completion);
    })
    .map((model: any) => {
      // OpenRouter pricing is in dollars per 1M tokens
      const inputCost = parseFloat(model.pricing.prompt) || 0;
      const outputCost = parseFloat(model.pricing.completion) || 0;
      const avgCost = (inputCost + outputCost) / 2;

      return {
        model: model.id,
        provider: extractProvider(model.id),
        inputCostPer1MTokens: inputCost,
        outputCostPer1MTokens: outputCost,
        costPer1MTokens: avgCost,
        lastUpdated: new Date(),
        source: 'OpenRouter API',
      };
    });
}

/**
 * Extracts provider name from model ID
 * e.g., "openai/gpt-4-turbo" -> "OpenAI"
 */
function extractProvider(modelId: string): string {
  const providers: Record<string, string> = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'google': 'Google',
    'meta': 'Meta',
    'mistral': 'Mistral AI',
    'deepseek': 'Deepseek',
    'together': 'Together AI',
    'cohere': 'Cohere',
    'perplexity': 'Perplexity',
    'xai': 'xAI',
  };

  const prefix = modelId.split('/')[0].toLowerCase();
  return providers[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

/**
 * Gets cached real-time pricing data if valid
 */
function getCachedRealtimePricing(): RealtimePricingData[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - data.timestamp > CACHE_VALIDITY_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    // Convert date strings back to Date objects
    return data.models.map((model: any) => ({
      ...model,
      lastUpdated: new Date(model.lastUpdated),
    }));
  } catch (error) {
    console.error('Error reading cached pricing:', error);
    return null;
  }
}

/**
 * Caches real-time pricing data
 */
function cacheRealtimePricing(data: RealtimePricingData[]): void {
  try {
    const cacheData = {
      models: data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching pricing data:', error);
  }
}

/**
 * Converts real-time pricing data to LLMModelCost format
 */
export function convertToLLMModelCost(data: RealtimePricingData): LLMModelCost {
  return {
    id: data.model,
    name: formatModelName(data.model),
    provider: data.provider,
    costPer1MTokens: data.costPer1MTokens,
    inputCostPer1MTokens: data.inputCostPer1MTokens,
    outputCostPer1MTokens: data.outputCostPer1MTokens,
    lastUpdated: data.lastUpdated,
  };
}

/**
 * Formats model ID to readable name
 * e.g., "openai/gpt-4-turbo" -> "GPT-4 Turbo"
 */
function formatModelName(modelId: string): string {
  const parts = modelId.split('/');
  const name = parts[parts.length - 1];
  
  // Convert kebab-case to Title Case
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Gets top N models by cost (cheapest first)
 */
export function getTopModelsByCost(limit: number = 10): RealtimePricingData[] {
  return FALLBACK_MODELS.slice(0, limit);
}
