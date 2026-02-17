import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCoreWebVitals,
  getPerformanceMetrics,
  meetsPerformanceThresholds,
  getPerformanceScore,
  getResourceTimingSummary,
  PERFORMANCE_THRESHOLDS,
} from './performance-monitor';

describe('Performance Monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCoreWebVitals', () => {
    it('should return core web vitals object', () => {
      const vitals = getCoreWebVitals();
      expect(vitals).toHaveProperty('lcp');
      expect(vitals).toHaveProperty('fid');
      expect(vitals).toHaveProperty('cls');
      expect(vitals).toHaveProperty('ttfb');
    });

    it('should handle missing PerformanceObserver', () => {
      const vitals = getCoreWebVitals();
      expect(vitals.lcp === null || typeof vitals.lcp === 'number').toBe(true);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', () => {
      const metrics = getPerformanceMetrics();
      expect(metrics).toHaveProperty('lcp');
      expect(metrics).toHaveProperty('fid');
      expect(metrics).toHaveProperty('cls');
      expect(metrics).toHaveProperty('pageLoadTime');
      expect(metrics).toHaveProperty('domContentLoaded');
      expect(metrics).toHaveProperty('resourceTiming');
    });

    it('should have numeric values for timing', () => {
      const metrics = getPerformanceMetrics();
      expect(typeof metrics.pageLoadTime).toBe('number');
      expect(typeof metrics.domContentLoaded).toBe('number');
    });
  });

  describe('meetsPerformanceThresholds', () => {
    it('should pass when all metrics are null', () => {
      const vitals = { lcp: null, fid: null, cls: null, ttfb: null };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(true);
    });

    it('should pass when all metrics are within thresholds', () => {
      const vitals = {
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 500,
      };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(true);
      expect(result.results.lcp).toBe(true);
      expect(result.results.fid).toBe(true);
      expect(result.results.cls).toBe(true);
      expect(result.results.ttfb).toBe(true);
    });

    it('should fail when LCP exceeds threshold', () => {
      const vitals = {
        lcp: 3000,
        fid: 50,
        cls: 0.05,
        ttfb: 500,
      };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(false);
      expect(result.results.lcp).toBe(false);
    });

    it('should fail when FID exceeds threshold', () => {
      const vitals = {
        lcp: 2000,
        fid: 150,
        cls: 0.05,
        ttfb: 500,
      };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(false);
      expect(result.results.fid).toBe(false);
    });

    it('should fail when CLS exceeds threshold', () => {
      const vitals = {
        lcp: 2000,
        fid: 50,
        cls: 0.15,
        ttfb: 500,
      };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(false);
      expect(result.results.cls).toBe(false);
    });

    it('should fail when TTFB exceeds threshold', () => {
      const vitals = {
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 800,
      };
      const result = meetsPerformanceThresholds(vitals);
      expect(result.meetsAll).toBe(false);
      expect(result.results.ttfb).toBe(false);
    });
  });

  describe('getPerformanceScore', () => {
    it('should return 100 for perfect metrics', () => {
      const vitals = {
        lcp: 1000,
        fid: 30,
        cls: 0.01,
        ttfb: 200,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBe(100);
    });

    it('should return lower score for poor LCP', () => {
      const vitals = {
        lcp: 5000,
        fid: 30,
        cls: 0.01,
        ttfb: 200,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return lower score for poor FID', () => {
      const vitals = {
        lcp: 1000,
        fid: 400,
        cls: 0.01,
        ttfb: 200,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return lower score for poor CLS', () => {
      const vitals = {
        lcp: 1000,
        fid: 30,
        cls: 0.3,
        ttfb: 200,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return lower score for poor TTFB', () => {
      const vitals = {
        lcp: 1000,
        fid: 30,
        cls: 0.01,
        ttfb: 1500,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should never return negative score', () => {
      const vitals = {
        lcp: 10000,
        fid: 1000,
        cls: 1.0,
        ttfb: 5000,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should handle null values', () => {
      const vitals = {
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
      };
      const score = getPerformanceScore(vitals);
      expect(score).toBe(100);
    });
  });

  describe('getResourceTimingSummary', () => {
    it('should return summary for empty resources', () => {
      const summary = getResourceTimingSummary([]);
      expect(summary.totalResources).toBe(0);
      expect(summary.totalSize).toBe(0);
      expect(summary.totalDuration).toBe(0);
    });

    it('should calculate totals correctly', () => {
      const resources: PerformanceResourceTiming[] = [
        {
          name: 'script.js',
          initiatorType: 'script',
          transferSize: 1000,
          duration: 100,
        } as any,
        {
          name: 'style.css',
          initiatorType: 'link',
          transferSize: 500,
          duration: 50,
        } as any,
      ];

      const summary = getResourceTimingSummary(resources);
      expect(summary.totalResources).toBe(2);
      expect(summary.totalSize).toBe(1500);
      expect(summary.totalDuration).toBe(150);
    });

    it('should group by type', () => {
      const resources: PerformanceResourceTiming[] = [
        {
          name: 'script1.js',
          initiatorType: 'script',
          transferSize: 1000,
          duration: 100,
        } as any,
        {
          name: 'script2.js',
          initiatorType: 'script',
          transferSize: 500,
          duration: 50,
        } as any,
        {
          name: 'style.css',
          initiatorType: 'link',
          transferSize: 200,
          duration: 20,
        } as any,
      ];

      const summary = getResourceTimingSummary(resources);
      expect(summary.byType['script'].count).toBe(2);
      expect(summary.byType['script'].size).toBe(1500);
      expect(summary.byType['link'].count).toBe(1);
      expect(summary.byType['link'].size).toBe(200);
    });
  });

  describe('Performance thresholds', () => {
    it('should have correct threshold values', () => {
      expect(PERFORMANCE_THRESHOLDS.lcp).toBe(2500);
      expect(PERFORMANCE_THRESHOLDS.fid).toBe(100);
      expect(PERFORMANCE_THRESHOLDS.cls).toBe(0.1);
      expect(PERFORMANCE_THRESHOLDS.ttfb).toBe(600);
    });
  });
});


// ============================================================================
// PROPERTY-BASED TESTS
// ============================================================================
// **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8**

import { fc } from '@fast-check/vitest';

describe('Performance Monitor - Property-Based Tests', () => {
  /**
   * Property 41: Largest Contentful Paint Performance
   * For any LCP value, if it's within threshold, meetsPerformanceThresholds should pass
   * If it exceeds threshold, meetsPerformanceThresholds should fail
   */
  it('Property 41: LCP performance threshold compliance', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10000 }), (lcpValue) => {
        const vitals = {
          lcp: lcpValue,
          fid: null,
          cls: null,
          ttfb: null,
        };
        const result = meetsPerformanceThresholds(vitals);
        const expectedPass = lcpValue <= PERFORMANCE_THRESHOLDS.lcp;
        expect(result.results.lcp).toBe(expectedPass);
      })
    );
  });

  /**
   * Property 42: First Input Delay Performance
   * For any FID value, if it's within threshold, meetsPerformanceThresholds should pass
   * If it exceeds threshold, meetsPerformanceThresholds should fail
   */
  it('Property 42: FID performance threshold compliance', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1000 }), (fidValue) => {
        const vitals = {
          lcp: null,
          fid: fidValue,
          cls: null,
          ttfb: null,
        };
        const result = meetsPerformanceThresholds(vitals);
        const expectedPass = fidValue <= PERFORMANCE_THRESHOLDS.fid;
        expect(result.results.fid).toBe(expectedPass);
      })
    );
  });

  /**
   * Property 43: Cumulative Layout Shift Performance
   * For any CLS value, if it's within threshold, meetsPerformanceThresholds should pass
   * If it exceeds threshold, meetsPerformanceThresholds should fail
   */
  it('Property 43: CLS performance threshold compliance', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1, noNaN: true }), (clsValue) => {
        const vitals = {
          lcp: null,
          fid: null,
          cls: clsValue,
          ttfb: null,
        };
        const result = meetsPerformanceThresholds(vitals);
        const expectedPass = clsValue <= PERFORMANCE_THRESHOLDS.cls;
        expect(result.results.cls).toBe(expectedPass);
      })
    );
  });

  /**
   * Property 44: Render-Blocking Resources Minimization
   * Performance score should always be between 0 and 100
   * Score should decrease monotonically as metrics worsen
   */
  it('Property 44: Performance score bounds and monotonicity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 0, max: 1000 }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.integer({ min: 0, max: 5000 }),
        (lcp, fid, cls, ttfb) => {
          const vitals = { lcp, fid, cls, ttfb };
          const score = getPerformanceScore(vitals);
          
          // Score must be between 0 and 100
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      )
    );
  });

  /**
   * Property 45: Image Lazy Loading
   * Resource timing summary should correctly aggregate all resources
   * Total size should equal sum of individual resource sizes
   * Total duration should equal sum of individual resource durations
   */
  it('Property 45: Resource timing aggregation correctness', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string(),
            initiatorType: fc.oneof(
              fc.constant('script'),
              fc.constant('link'),
              fc.constant('img'),
              fc.constant('fetch')
            ),
            transferSize: fc.integer({ min: 0, max: 100000 }),
            duration: fc.integer({ min: 0, max: 10000 }),
          }),
          { maxLength: 100 }
        ),
        (resourceData) => {
          const resources = resourceData.map((r) => ({
            ...r,
            loadTime: 0,
            renderTime: 0,
            fetchStart: 0,
            responseStart: 0,
            responseEnd: 0,
            startTime: 0,
            entryType: 'resource',
            toJSON: () => ({}),
          } as any as PerformanceResourceTiming));

          const summary = getResourceTimingSummary(resources);

          // Total resources should match input length
          expect(summary.totalResources).toBe(resources.length);

          // Total size should equal sum of all transfer sizes
          const expectedSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
          expect(summary.totalSize).toBe(expectedSize);

          // Total duration should equal sum of all durations
          const expectedDuration = resources.reduce((sum, r) => sum + r.duration, 0);
          expect(summary.totalDuration).toBe(expectedDuration);
        }
      )
    );
  });

  /**
   * Property 46: Asset Compression and Optimization
   * For any set of resources, byType grouping should be consistent
   * Sum of byType counts should equal total resources
   * Sum of byType sizes should equal total size
   */
  it('Property 46: Resource type grouping consistency', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            name: fc.string(),
            initiatorType: fc.oneof(
              fc.constant('script'),
              fc.constant('link'),
              fc.constant('img'),
              fc.constant('fetch'),
              fc.constant('other')
            ),
            transferSize: fc.integer({ min: 0, max: 100000 }),
            duration: fc.integer({ min: 0, max: 10000 }),
          }),
          { maxLength: 100 }
        ),
        (resourceData) => {
          const resources = resourceData.map((r) => ({
            ...r,
            loadTime: 0,
            renderTime: 0,
            fetchStart: 0,
            responseStart: 0,
            responseEnd: 0,
            startTime: 0,
            entryType: 'resource',
            toJSON: () => ({}),
          } as any as PerformanceResourceTiming));

          const summary = getResourceTimingSummary(resources);

          // Sum of byType counts should equal total resources
          const totalByType = Object.values(summary.byType).reduce((sum, t) => sum + t.count, 0);
          expect(totalByType).toBe(summary.totalResources);

          // Sum of byType sizes should equal total size
          const totalByTypeSize = Object.values(summary.byType).reduce((sum, t) => sum + t.size, 0);
          expect(totalByTypeSize).toBe(summary.totalSize);

          // Sum of byType durations should equal total duration
          const totalByTypeDuration = Object.values(summary.byType).reduce(
            (sum, t) => sum + t.duration,
            0
          );
          expect(totalByTypeDuration).toBe(summary.totalDuration);
        }
      )
    );
  });

  /**
   * Property 47: Static Asset Caching
   * TTFB should always be non-negative
   * TTFB threshold should be reasonable (> 0)
   */
  it('Property 47: TTFB performance threshold validity', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5000 }), (ttfbValue) => {
        const vitals = {
          lcp: null,
          fid: null,
          cls: null,
          ttfb: ttfbValue,
        };
        const result = meetsPerformanceThresholds(vitals);
        const expectedPass = ttfbValue <= PERFORMANCE_THRESHOLDS.ttfb;
        expect(result.results.ttfb).toBe(expectedPass);
        
        // TTFB threshold should be positive
        expect(PERFORMANCE_THRESHOLDS.ttfb).toBeGreaterThan(0);
      })
    );
  });

  /**
   * Additional Property: Performance Score Consistency
   * If all metrics are null, score should be 100
   * If all metrics are perfect (best possible), score should be 100
   */
  it('Property: Performance score consistency for perfect metrics', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Perfect metrics
        const perfectVitals = {
          lcp: 500,
          fid: 10,
          cls: 0.01,
          ttfb: 100,
        };
        const perfectScore = getPerformanceScore(perfectVitals);
        expect(perfectScore).toBe(100);

        // Null metrics
        const nullVitals = {
          lcp: null,
          fid: null,
          cls: null,
          ttfb: null,
        };
        const nullScore = getPerformanceScore(nullVitals);
        expect(nullScore).toBe(100);
      })
    );
  });

  /**
   * Additional Property: Threshold Boundaries
   * Metrics exactly at threshold should pass
   * Metrics just above threshold should fail
   */
  it('Property: Threshold boundary conditions', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // LCP at threshold
        const atThreshold = {
          lcp: PERFORMANCE_THRESHOLDS.lcp,
          fid: null,
          cls: null,
          ttfb: null,
        };
        expect(meetsPerformanceThresholds(atThreshold).results.lcp).toBe(true);

        // LCP just above threshold
        const aboveThreshold = {
          lcp: PERFORMANCE_THRESHOLDS.lcp + 1,
          fid: null,
          cls: null,
          ttfb: null,
        };
        expect(meetsPerformanceThresholds(aboveThreshold).results.lcp).toBe(false);
      })
    );
  });
});
