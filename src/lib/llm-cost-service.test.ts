/**
 * Unit tests for LLM cost fetching service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchLLMCosts } from './llm-cost-service';
import * as cacheModule from './llm-cost-cache';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('fetchLLMCosts', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return hardcoded LLM costs on first call', async () => {
    const costs = await fetchLLMCosts();

    expect(costs).toBeDefined();
    expect(Array.isArray(costs)).toBe(true);
    expect(costs.length).toBeGreaterThanOrEqual(5);
  });

  it('should include required LLM models', async () => {
    const costs = await fetchLLMCosts();
    const modelIds = costs.map((c) => c.id);

    expect(modelIds).toContain('gpt-4o');
    expect(modelIds).toContain('gpt-4-turbo');
    expect(modelIds).toContain('claude-3-opus');
    expect(modelIds).toContain('claude-3-sonnet');
    expect(modelIds).toContain('gemini-pro');
  });

  it('should include correct cost data for each model', async () => {
    const costs = await fetchLLMCosts();

    const gpt4o = costs.find((c) => c.id === 'gpt-4o');
    expect(gpt4o).toBeDefined();
    expect(gpt4o?.costPer1MTokens).toBe(0.03);
    expect(gpt4o?.provider).toBe('OpenAI');

    const claude3Opus = costs.find((c) => c.id === 'claude-3-opus');
    expect(claude3Opus).toBeDefined();
    expect(claude3Opus?.costPer1MTokens).toBe(0.015);
    expect(claude3Opus?.provider).toBe('Anthropic');

    const geminiPro = costs.find((c) => c.id === 'gemini-pro');
    expect(geminiPro).toBeDefined();
    expect(geminiPro?.costPer1MTokens).toBe(0.0005);
    expect(geminiPro?.provider).toBe('Google');
  });

  it('should cache fetched data', async () => {
    const setCacheSpy = vi.spyOn(cacheModule, 'setCachedLLMCosts');

    await fetchLLMCosts();

    expect(setCacheSpy).toHaveBeenCalled();
    const cachedData = setCacheSpy.mock.calls[0][0];
    expect(Array.isArray(cachedData)).toBe(true);
    expect(cachedData.length).toBeGreaterThanOrEqual(5);
  });

  it('should use cached data if cache is valid', async () => {
    const setCacheSpy = vi.spyOn(cacheModule, 'setCachedLLMCosts');
    const getCacheSpy = vi.spyOn(cacheModule, 'getCachedLLMCosts');
    const isCacheValidSpy = vi.spyOn(cacheModule, 'isCacheValid');

    // First call - should fetch and cache
    const firstCall = await fetchLLMCosts();
    expect(setCacheSpy).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    const secondCall = await fetchLLMCosts();
    expect(isCacheValidSpy).toHaveBeenCalled();
    expect(getCacheSpy).toHaveBeenCalled();

    // Both calls should return the same data
    expect(firstCall).toEqual(secondCall);
  });

  it('should update lastUpdated timestamp', async () => {
    const costs = await fetchLLMCosts();

    costs.forEach((cost) => {
      expect(cost.lastUpdated).toBeDefined();
      expect(cost.lastUpdated instanceof Date).toBe(true);
    });
  });

  it('should have valid model structure', async () => {
    const costs = await fetchLLMCosts();

    costs.forEach((cost) => {
      expect(cost.id).toBeDefined();
      expect(typeof cost.id).toBe('string');
      expect(cost.name).toBeDefined();
      expect(typeof cost.name).toBe('string');
      expect(cost.provider).toBeDefined();
      expect(typeof cost.provider).toBe('string');
      expect(cost.costPer1MTokens).toBeDefined();
      expect(typeof cost.costPer1MTokens).toBe('number');
      expect(cost.costPer1MTokens).toBeGreaterThan(0);
    });
  });

  it('should throw descriptive error on failure', async () => {
    // Mock getCachedLLMCosts to throw an error
    vi.spyOn(cacheModule, 'isCacheValid').mockImplementation(() => {
      throw new Error('Cache check failed');
    });

    await expect(fetchLLMCosts()).rejects.toThrow('Failed to fetch LLM costs');
  });

  it('should handle cache retrieval errors gracefully', async () => {
    // Mock cache functions to simulate error
    vi.spyOn(cacheModule, 'isCacheValid').mockReturnValue(false);
    vi.spyOn(cacheModule, 'getCachedLLMCosts').mockReturnValue(null);

    const costs = await fetchLLMCosts();

    expect(costs).toBeDefined();
    expect(Array.isArray(costs)).toBe(true);
    expect(costs.length).toBeGreaterThanOrEqual(5);
  });
});
