/**
 * LLM Cost Data Fetching Service
 * Fetches and caches LLM model pricing information from OpenRouter API
 * OpenRouter provides accurate, real-time pricing for all major LLM models
 */

import { LLMModelCost } from './llm-cost-types';
import { getCachedLLMCosts, setCachedLLMCosts, isCacheValid } from './llm-cost-cache';
import { fetchRealtimePricing, convertToLLMModelCost } from './realtime-pricing-service';

/**
 * Fallback LLM model costs - used only if OpenRouter API is unavailable
 * These are verified models with accurate pricing
 */
const FALLBACK_LLM_COSTS: LLMModelCost[] = [
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    costPer1MTokens: 20,
    inputCostPer1MTokens: 10,
    outputCostPer1MTokens: 30,
    lastUpdated: new Date(),
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    costPer1MTokens: 10,
    inputCostPer1MTokens: 5,
    outputCostPer1MTokens: 15,
    lastUpdated: new Date(),
  },
  {
    id: 'anthropic/claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    costPer1MTokens: 9,
    inputCostPer1MTokens: 3,
    outputCostPer1MTokens: 15,
    lastUpdated: new Date(),
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    costPer1MTokens: 45,
    inputCostPer1MTokens: 15,
    outputCostPer1MTokens: 75,
    lastUpdated: new Date(),
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    costPer1MTokens: 0.1875,
    inputCostPer1MTokens: 0.075,
    outputCostPer1MTokens: 0.3,
    lastUpdated: new Date(),
  },
];

/**
 * Fetches LLM model costs with caching support
 * Checks cache first, returns cached data if valid (< 5 minutes old)
 * Otherwise fetches fresh data from OpenRouter API and caches it
 *
 * @returns Promise<LLMModelCost[]> Array of LLM model costs
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchLLMCosts(): Promise<LLMModelCost[]> {
  try {
    // Check if cache is valid
    if (isCacheValid()) {
      const cachedCosts = getCachedLLMCosts();
      if (cachedCosts) {
        return cachedCosts;
      }
    }

    // Fetch fresh data from OpenRouter API
    const freshCosts = await fetchFreshLLMCosts();

    // Cache the fetched data
    setCachedLLMCosts(freshCosts);

    return freshCosts;
  } catch (error) {
    console.error('Error fetching LLM costs:', error);
    // Return fallback data if fetch fails
    return FALLBACK_LLM_COSTS;
  }
}

/**
 * Fetches fresh LLM cost data from OpenRouter API
 * OpenRouter provides accurate, real-time pricing for all major LLM models
 *
 * @returns Promise<LLMModelCost[]> Array of fresh LLM model costs
 * @throws Error if fetch fails or response is invalid
 */
async function fetchFreshLLMCosts(): Promise<LLMModelCost[]> {
  try {
    // Fetch real-time pricing from OpenRouter
    const realtimePricing = await fetchRealtimePricing();

    // Convert to LLMModelCost format
    const costs = realtimePricing.map(convertToLLMModelCost);

    // Validate that we have data
    if (!costs || costs.length === 0) {
      throw new Error('No pricing data available from OpenRouter');
    }

    // Update lastUpdated to current time
    const updatedCosts = costs.map((cost) => ({
      ...cost,
      lastUpdated: new Date(),
    }));

    return updatedCosts;
  } catch (error) {
    console.error('Error fetching fresh LLM costs from OpenRouter:', error);
    // Return fallback data if OpenRouter fetch fails
    return FALLBACK_LLM_COSTS;
  }
}
