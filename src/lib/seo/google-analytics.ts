/**
 * Google Analytics 4 Integration
 * Handles GA4 tracking script and event tracking
 */

/**
 * Configuration for Google Analytics 4
 */
export interface GA4Config {
  measurementId: string;
  enabled: boolean;
  anonymizeIp?: boolean;
  cookieFlags?: string;
}

/**
 * Analytics event for tracking
 */
export interface GA4Event {
  eventName: string;
  eventCategory: string;
  eventLabel: string;
  eventValue?: number;
  timestamp?: Date;
  pageUrl?: string;
  userAgent?: string;
  customParams?: Record<string, any>;
}

/**
 * Generate GA4 tracking script tag
 * @param measurementId - The GA4 measurement ID
 * @returns Script tag HTML string
 */
export function generateGA4TrackingScript(measurementId: string): string {
  if (!measurementId || measurementId.trim().length === 0) {
    throw new Error('GA4 measurement ID is required');
  }

  if (!isValidMeasurementId(measurementId)) {
    throw new Error('Invalid GA4 measurement ID format');
  }

  return `
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>
  `.trim();
}

/**
 * Validate GA4 measurement ID format
 * @param id - The measurement ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidMeasurementId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // GA4 measurement IDs follow the format G-XXXXXXXXXX
  return /^G-[A-Z0-9]{10}$/.test(id.trim());
}

/**
 * Create GA4 configuration
 * @param measurementId - The GA4 measurement ID
 * @param options - Optional configuration options
 * @returns GA4 configuration object
 */
export function createGA4Config(
  measurementId: string,
  options?: {
    anonymizeIp?: boolean;
    cookieFlags?: string;
  }
): GA4Config {
  if (!isValidMeasurementId(measurementId)) {
    throw new Error('Invalid GA4 measurement ID format');
  }

  return {
    measurementId,
    enabled: true,
    anonymizeIp: options?.anonymizeIp ?? true,
    cookieFlags: options?.cookieFlags,
  };
}

/**
 * Track page view event
 * @param pageUrl - The page URL
 * @param pageTitle - The page title
 */
export function trackPageView(pageUrl: string, pageTitle: string): void {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 not initialized or gtag not available');
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pageUrl,
    page_title: pageTitle,
  });
}

/**
 * Track custom event
 * @param event - The event to track
 */
export function trackEvent(event: GA4Event): void {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('GA4 not initialized or gtag not available');
    return;
  }

  const eventData: Record<string, any> = {
    event_category: event.eventCategory,
    event_label: event.eventLabel,
  };

  if (event.eventValue !== undefined) {
    eventData.value = event.eventValue;
  }

  if (event.pageUrl) {
    eventData.page_path = event.pageUrl;
  }

  if (event.customParams) {
    Object.assign(eventData, event.customParams);
  }

  window.gtag('event', event.eventName, eventData);
}

/**
 * Track user interaction
 * @param interactionType - Type of interaction (click, scroll, etc.)
 * @param elementName - Name of the element interacted with
 * @param elementValue - Optional value associated with the interaction
 */
export function trackUserInteraction(
  interactionType: string,
  elementName: string,
  elementValue?: string
): void {
  trackEvent({
    eventName: `user_${interactionType}`,
    eventCategory: 'user_interaction',
    eventLabel: elementName,
    customParams: elementValue ? { element_value: elementValue } : undefined,
  });
}

/**
 * Track conversion event
 * @param conversionName - Name of the conversion
 * @param conversionValue - Optional value of the conversion
 */
export function trackConversion(
  conversionName: string,
  conversionValue?: number
): void {
  trackEvent({
    eventName: 'conversion',
    eventCategory: 'conversion',
    eventLabel: conversionName,
    eventValue: conversionValue,
  });
}

/**
 * Declare gtag global type for TypeScript
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
