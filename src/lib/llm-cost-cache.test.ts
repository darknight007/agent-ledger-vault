import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCachedLLMCosts,
  setCachedLLMCosts,
  isCacheValid,
} from './llm-cost-cache';
import { LLMModelCost } from './llm-cost-types';

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

describe('LLM Cost Cache', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setCachedLLMCosts', () => {
    it('should store costs in localStorage', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      const cached = localStorage.getItem('llm_costs_cache');
      expect(cached).toBeTruthy();
      expect(cached).toContain('gpt-4o');
    });

    it('should set correct expiration time (5 minutes)', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      const beforeTime = Date.now();
      setCachedLLMCosts(mockCosts);
      const afterTime = Date.now();

      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);

      const expectedExpiry = beforeTime + 5 * 60 * 1000;
      const actualExpiry = parsedCache.expiresAt;

      // Allow 100ms tolerance for test execution time
      expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiry - 100);
      expect(actualExpiry).toBeLessThanOrEqual(afterTime + 5 * 60 * 1000 + 100);
    });

    it('should handle multiple costs', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
        {
          id: 'claude-3-opus',
          name: 'Claude 3 Opus',
          provider: 'Anthropic',
          costPer1MTokens: 0.015,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);

      expect(parsedCache.data).toHaveLength(2);
      expect(parsedCache.data[0].id).toBe('gpt-4o');
      expect(parsedCache.data[1].id).toBe('claude-3-opus');
    });

    it('should handle localStorage quota exceeded gracefully', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw, just log error
      expect(() => setCachedLLMCosts(mockCosts)).not.toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });

  describe('getCachedLLMCosts', () => {
    it('should return null when cache does not exist', () => {
      const result = getCachedLLMCosts();
      expect(result).toBeNull();
    });

    it('should return cached costs when cache is valid', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);
      const result = getCachedLLMCosts();

      expect(result).toBeTruthy();
      expect(result).toHaveLength(1);
      expect(result![0].id).toBe('gpt-4o');
    });

    it('should return null when cache is expired', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      // Manually set cache to expired
      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);
      parsedCache.expiresAt = Date.now() - 1000; // Expired 1 second ago
      localStorage.setItem('llm_costs_cache', JSON.stringify(parsedCache));

      const result = getCachedLLMCosts();
      expect(result).toBeNull();
    });

    it('should return null when cache JSON is invalid', () => {
      localStorage.setItem('llm_costs_cache', 'invalid json');

      const result = getCachedLLMCosts();
      expect(result).toBeNull();
    });

    it('should handle corrupted cache data gracefully', () => {
      localStorage.setItem('llm_costs_cache', '{}');

      const result = getCachedLLMCosts();
      expect(result).toBeNull();
    });
  });

  describe('isCacheValid', () => {
    it('should return false when cache does not exist', () => {
      const result = isCacheValid();
      expect(result).toBe(false);
    });

    it('should return true when cache is valid', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);
      const result = isCacheValid();

      expect(result).toBe(true);
    });

    it('should return false when cache is expired', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      // Manually set cache to expired
      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);
      parsedCache.expiresAt = Date.now() - 1000; // Expired 1 second ago
      localStorage.setItem('llm_costs_cache', JSON.stringify(parsedCache));

      const result = isCacheValid();
      expect(result).toBe(false);
    });

    it('should return false when cache JSON is invalid', () => {
      localStorage.setItem('llm_costs_cache', 'invalid json');

      const result = isCacheValid();
      expect(result).toBe(false);
    });

    it('should handle edge case: cache expires exactly at current time', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      // Manually set cache to expire at exactly now
      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);
      const now = Date.now();
      parsedCache.expiresAt = now;
      localStorage.setItem('llm_costs_cache', JSON.stringify(parsedCache));

      const result = isCacheValid();
      // Should be false because now >= expiresAt
      expect(result).toBe(false);
    });

    it('should handle edge case: cache expires 1ms in the future', () => {
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      // Manually set cache to expire 1ms in the future
      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);
      parsedCache.expiresAt = Date.now() + 1;
      localStorage.setItem('llm_costs_cache', JSON.stringify(parsedCache));

      const result = isCacheValid();
      // Should be true because now < expiresAt
      expect(result).toBe(true);
    });
  });

  describe('cache lifecycle', () => {
    it('should follow complete cache lifecycle', () => {
      // Initially no cache
      expect(isCacheValid()).toBe(false);
      expect(getCachedLLMCosts()).toBeNull();

      // Set cache
      const mockCosts: LLMModelCost[] = [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          provider: 'OpenAI',
          costPer1MTokens: 0.03,
          lastUpdated: new Date(),
        },
      ];

      setCachedLLMCosts(mockCosts);

      // Cache should be valid
      expect(isCacheValid()).toBe(true);
      const cachedCosts = getCachedLLMCosts();
      expect(cachedCosts).toBeTruthy();
      expect(cachedCosts).toHaveLength(1);
      expect(cachedCosts![0].id).toBe('gpt-4o');
      expect(cachedCosts![0].name).toBe('GPT-4o');

      // Expire cache
      const cached = localStorage.getItem('llm_costs_cache');
      const parsedCache = JSON.parse(cached!);
      parsedCache.expiresAt = Date.now() - 1000;
      localStorage.setItem('llm_costs_cache', JSON.stringify(parsedCache));

      // Cache should be invalid
      expect(isCacheValid()).toBe(false);
      expect(getCachedLLMCosts()).toBeNull();
    });
  });
});
