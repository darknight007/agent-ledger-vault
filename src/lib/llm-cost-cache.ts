/**
 * Cache management utilities for LLM model costs
 * Stores costs in localStorage with 5-minute expiration
 */

import { LLMModelCost, LLMCostCache } from './llm-cost-types';

const CACHE_KEY = 'llm_costs_cache';
const CACHE_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieves cached LLM costs if the cache is valid
 * @returns Array of LLMModelCost if cache is valid, null otherwise
 */
export function getCachedLLMCosts(): LLMModelCost[] | null {
  try {
    if (!isCacheValid()) {
      return null;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const parsedCache: LLMCostCache = JSON.parse(cached);
    // Convert lastUpdated strings back to Date objects
    const data = parsedCache.data.map((cost) => ({
      ...cost,
      lastUpdated: new Date(cost.lastUpdated),
    }));
    return data;
  } catch (error) {
    // Handle invalid JSON or other parsing errors
    console.error('Error retrieving cached LLM costs:', error);
    return null;
  }
}

/**
 * Stores LLM costs in localStorage with 5-minute expiration
 * @param costs Array of LLMModelCost to cache
 */
export function setCachedLLMCosts(costs: LLMModelCost[]): void {
  try {
    const now = Date.now();
    const cache: LLMCostCache = {
      data: costs,
      timestamp: now,
      expiresAt: now + CACHE_VALIDITY_MS,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    // Handle localStorage quota exceeded or other storage errors
    console.error('Error caching LLM costs:', error);
  }
}

/**
 * Checks if the cached LLM costs are still valid
 * @returns true if cache exists and is not expired, false otherwise
 */
export function isCacheValid(): boolean {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return false;
    }

    const parsedCache: LLMCostCache = JSON.parse(cached);
    const now = Date.now();

    return now < parsedCache.expiresAt;
  } catch (error) {
    // Handle invalid JSON or other parsing errors
    console.error('Error checking cache validity:', error);
    return false;
  }
}
