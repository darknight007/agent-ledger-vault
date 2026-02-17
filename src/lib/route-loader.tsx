/**
 * Route Loader Utility
 * Provides lazy loading for routes with code splitting
 * Improves initial page load performance by deferring non-critical route code
 */

import React, { Suspense, ComponentType } from 'react';

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

/**
 * Lazy load a route component with code splitting
 * @param importFunc - Dynamic import function
 * @param fallback - Optional fallback component
 * @returns Lazy-loaded component wrapped in Suspense
 */
export function lazyRoute<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ComponentType
) {
  const LazyComponent = React.lazy(importFunc);
  const Fallback = fallback || LoadingFallback;

  return (props: P) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy load multiple route components
 * @param imports - Object with route names and import functions
 * @returns Object with lazy-loaded components
 */
export function lazyRoutes<T extends Record<string, () => Promise<{ default: ComponentType<any> }>>>(
  imports: T
): Record<keyof T, ComponentType<any>> {
  const result: Record<string, ComponentType<any>> = {};

  for (const [key, importFunc] of Object.entries(imports)) {
    result[key] = lazyRoute(importFunc);
  }

  return result as Record<keyof T, ComponentType<any>>;
}

/**
 * Preload a route component
 * Useful for prefetching routes on hover or before navigation
 * @param importFunc - Dynamic import function
 */
export function preloadRoute(importFunc: () => Promise<{ default: ComponentType<any> }>) {
  importFunc().catch((err) => {
    console.warn('Failed to preload route:', err);
  });
}
