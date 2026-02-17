/**
 * SEO and LLM Search Optimization Types
 * Defines all TypeScript interfaces for page metadata and SEO configuration
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'Product' | 'FAQPage' | 'Article' | 'LocalBusiness' | 'BreadcrumbList';
  data: Record<string, any>;
}

export interface LLMMetadataConfig {
  contentType: 'product' | 'service' | 'article' | 'documentation';
  topic: string;
  author?: string;
  publicationDate?: string;
  facts?: Record<string, any>;
}

export interface PageMetadata {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogType: 'website' | 'article' | 'product';
  ogImage?: string;
  canonicalUrl?: string;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: StructuredDataConfig;
  llmMetadata?: LLMMetadataConfig;
}

export interface PageConfig {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  contentType: 'page' | 'article' | 'product' | 'service';
  ogImage: string;
  priority: number; // 0.0 - 1.0 for sitemap
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod: Date;
  breadcrumbs: BreadcrumbItem[];
  structuredData: StructuredDataConfig;
  llmMetadata: LLMMetadataConfig;
  performanceTargets: {
    lcp: number; // milliseconds
    fid: number; // milliseconds
    cls: number; // unitless
  };
}

export interface SitemapEntry {
  url: string;
  lastmod: string; // ISO 8601 format
  changefreq: string;
  priority: number;
}

export interface AnalyticsEvent {
  eventName: string;
  eventCategory: string;
  eventLabel: string;
  eventValue?: number;
  timestamp: Date;
  pageUrl: string;
  userAgent: string;
}

export interface MetaTagProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export interface StructuredDataProps {
  type: string;
  data: Record<string, any>;
  validate?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  includeSchema?: boolean;
}
