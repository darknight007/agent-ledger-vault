/**
 * Performance Monitor
 * Tracks Core Web Vitals and performance metrics
 */

/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
  lcp: number | null; // Largest Contentful Paint (milliseconds)
  fid: number | null; // First Input Delay (milliseconds)
  cls: number | null; // Cumulative Layout Shift (unitless)
  ttfb: number | null; // Time to First Byte (milliseconds)
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics extends CoreWebVitals {
  pageLoadTime: number;
  domContentLoaded: number;
  resourceTiming: PerformanceResourceTiming[];
  navigationTiming: PerformanceNavigationTiming | null;
}

/**
 * Performance thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  lcp: 2500, // 2.5 seconds
  fid: 100, // 100 milliseconds
  cls: 0.1, // 0.1 unitless
  ttfb: 600, // 600 milliseconds
};

/**
 * Get Core Web Vitals
 */
export function getCoreWebVitals(): CoreWebVitals {
  const vitals: CoreWebVitals = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  };

  // Get LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Get FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (vitals.fid === null) {
            vitals.fid = Math.round(entry.processingDuration);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Get CLS (Cumulative Layout Shift)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        vitals.cls = Math.round(clsValue * 1000) / 1000;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  // Get TTFB (Time to First Byte)
  if ('performance' in window && 'timing' in performance) {
    const timing = performance.timing;
    if (timing.responseStart && timing.fetchStart) {
      vitals.ttfb = timing.responseStart - timing.fetchStart;
    }
  }

  return vitals;
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  const vitals = getCoreWebVitals();

  let pageLoadTime = 0;
  let domContentLoaded = 0;
  let navigationTiming: PerformanceNavigationTiming | null = null;

  if ('performance' in window) {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      navigationTiming = perfData;
      pageLoadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
      domContentLoaded = Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart);
    }
  }

  const resourceTiming = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return {
    ...vitals,
    pageLoadTime,
    domContentLoaded,
    resourceTiming,
    navigationTiming,
  };
}

/**
 * Check if metrics meet thresholds
 */
export function meetsPerformanceThresholds(vitals: CoreWebVitals): {
  meetsAll: boolean;
  results: Record<string, boolean>;
} {
  const results = {
    lcp: vitals.lcp === null || vitals.lcp <= PERFORMANCE_THRESHOLDS.lcp,
    fid: vitals.fid === null || vitals.fid <= PERFORMANCE_THRESHOLDS.fid,
    cls: vitals.cls === null || vitals.cls <= PERFORMANCE_THRESHOLDS.cls,
    ttfb: vitals.ttfb === null || vitals.ttfb <= PERFORMANCE_THRESHOLDS.ttfb,
  };

  return {
    meetsAll: Object.values(results).every((v) => v),
    results,
  };
}

/**
 * Get performance score (0-100)
 */
export function getPerformanceScore(vitals: CoreWebVitals): number {
  let score = 100;

  // LCP scoring (0-25 points)
  if (vitals.lcp !== null) {
    if (vitals.lcp > 4000) score -= 25;
    else if (vitals.lcp > 2500) score -= 15;
    else if (vitals.lcp > 1200) score -= 5;
  }

  // FID scoring (0-25 points)
  if (vitals.fid !== null) {
    if (vitals.fid > 300) score -= 25;
    else if (vitals.fid > 100) score -= 15;
    else if (vitals.fid > 50) score -= 5;
  }

  // CLS scoring (0-25 points)
  if (vitals.cls !== null) {
    if (vitals.cls > 0.25) score -= 25;
    else if (vitals.cls > 0.1) score -= 15;
    else if (vitals.cls > 0.05) score -= 5;
  }

  // TTFB scoring (0-25 points)
  if (vitals.ttfb !== null) {
    if (vitals.ttfb > 1200) score -= 25;
    else if (vitals.ttfb > 600) score -= 15;
    else if (vitals.ttfb > 300) score -= 5;
  }

  return Math.max(0, score);
}

/**
 * Get resource timing summary
 */
export function getResourceTimingSummary(resources: PerformanceResourceTiming[]): {
  totalResources: number;
  totalSize: number;
  totalDuration: number;
  byType: Record<string, { count: number; size: number; duration: number }>;
} {
  const summary = {
    totalResources: resources.length,
    totalSize: 0,
    totalDuration: 0,
    byType: {} as Record<string, { count: number; size: number; duration: number }>,
  };

  resources.forEach((resource) => {
    const type = resource.initiatorType || 'other';

    if (!summary.byType[type]) {
      summary.byType[type] = { count: 0, size: 0, duration: 0 };
    }

    summary.byType[type].count++;
    summary.byType[type].size += resource.transferSize || 0;
    summary.byType[type].duration += resource.duration;

    summary.totalSize += resource.transferSize || 0;
    summary.totalDuration += resource.duration;
  });

  return summary;
}

/**
 * Monitor performance and report
 */
export function monitorPerformance(callback?: (metrics: PerformanceMetrics) => void): () => void {
  const interval = setInterval(() => {
    const metrics = getPerformanceMetrics();
    if (callback) {
      callback(metrics);
    }
  }, 5000); // Check every 5 seconds

  return () => clearInterval(interval);
}

/**
 * Send performance metrics to analytics
 */
export function sendPerformanceMetrics(
  metrics: PerformanceMetrics,
  endpoint: string
): Promise<Response> {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics,
    }),
  });
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  vitals: CoreWebVitals;
  score: number;
  meetsThresholds: boolean;
  resourceSummary: ReturnType<typeof getResourceTimingSummary>;
} {
  const vitals = getCoreWebVitals();
  const score = getPerformanceScore(vitals);
  const { meetsAll } = meetsPerformanceThresholds(vitals);
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const resourceSummary = getResourceTimingSummary(resources);

  return {
    vitals,
    score,
    meetsThresholds: meetsAll,
    resourceSummary,
  };
}
