/**
 * Centralized SEO Configuration
 * Defines metadata for all pages on the website
 */

import { PageConfig } from './types';

export const seoConfig: Record<string, PageConfig> = {
  home: {
    id: 'home',
    path: '/',
    title: 'AskScrooge — Price, Bill & Audit Your AI Agents',
    description: 'Stop guessing what to charge for your AI agent. AskScrooge gives you pricing models, billing infra, and ROI dashboards so you ship outcomes, not invoices.',
    keywords: [
      'AI agent pricing',
      'AI monetization',
      'AI billing',
      'AI ROI',
      'AI agent marketplace',
      'outcome-based pricing',
      'agentic pricing',
      'cost management',
    ],
    contentType: 'page',
    ogImage: 'https://askscrooge.com/og-image.svg',
    priority: 1.0,
    changefreq: 'weekly',
    lastmod: new Date(),
    breadcrumbs: [],
    structuredData: {
      type: 'Organization',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AskScrooge',
        description: 'Monetary middleware for AI agents — pricing models, billing infrastructure, and ROI dashboards for AI builders and enterprise buyers.',
        url: 'https://askscrooge.com',
        logo: 'https://askscrooge.com/og-image.svg',
      },
    },
    llmMetadata: {
      contentType: 'product',
      topic: 'AI agent pricing and cost management',
      author: 'AskScrooge',
      publicationDate: new Date().toISOString(),
      facts: {
        category: 'AI Pricing & Monetization',
        industry: 'Software as a Service',
        focus: 'Agentic pricing and cost management',
      },
    },
    performanceTargets: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },

  researchAgent: {
    id: 'research-agent',
    path: '/pricing-blueprints/research-agent',
    title: 'Research Agent Pricing Blueprint — AskScrooge',
    description: 'Monetize your research agent with outcome-based pricing. Learn pricing strategies, billing models, and ROI optimization for research automation.',
    keywords: [
      'research agent pricing',
      'research automation monetization',
      'AI research pricing',
      'research agent billing',
      'research automation ROI',
    ],
    contentType: 'product',
    ogImage: 'https://askscrooge.com/og-image.svg',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date(),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pricing Blueprints', url: '/pricing-blueprints' },
      { name: 'Research Agent', url: '/pricing-blueprints/research-agent' },
    ],
    structuredData: {
      type: 'Product',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Research Agent Pricing Blueprint',
        description: 'Monetize your research agent with outcome-based pricing',
        url: 'https://askscrooge.com/pricing-blueprints/research-agent',
      },
    },
    llmMetadata: {
      contentType: 'article',
      topic: 'Research agent pricing and monetization',
      author: 'AskScrooge',
      publicationDate: new Date().toISOString(),
      facts: {
        agentType: 'Research Agent',
        pricingModel: 'Outcome-based',
        category: 'AI Agent Pricing',
      },
    },
    performanceTargets: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },

  socialContentCreator: {
    id: 'social-content-creator',
    path: '/pricing-blueprints/social-content-creator-agent',
    title: 'Social Content Creator Agent Pricing — AskScrooge',
    description: 'Monetize your social content creator agent. Discover pricing strategies, billing models, and ROI optimization for content automation.',
    keywords: [
      'social content creator pricing',
      'content automation monetization',
      'AI content pricing',
      'social media agent billing',
      'content creation ROI',
    ],
    contentType: 'product',
    ogImage: 'https://askscrooge.com/og-image.svg',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date(),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pricing Blueprints', url: '/pricing-blueprints' },
      { name: 'Social Content Creator', url: '/pricing-blueprints/social-content-creator-agent' },
    ],
    structuredData: {
      type: 'Product',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Social Content Creator Agent Pricing Blueprint',
        description: 'Monetize your social content creator agent with outcome-based pricing',
        url: 'https://askscrooge.com/pricing-blueprints/social-content-creator-agent',
      },
    },
    llmMetadata: {
      contentType: 'article',
      topic: 'Social content creator agent pricing and monetization',
      author: 'AskScrooge',
      publicationDate: new Date().toISOString(),
      facts: {
        agentType: 'Social Content Creator Agent',
        pricingModel: 'Outcome-based',
        category: 'AI Agent Pricing',
      },
    },
    performanceTargets: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },

  customerSupportAgent: {
    id: 'customer-support',
    path: '/pricing-blueprints/customer-support-agent',
    title: 'Customer Support Agent Pricing Blueprint — AskScrooge',
    description: 'Monetize your customer support agent. Learn pricing strategies, billing models, and ROI optimization for support automation.',
    keywords: [
      'customer support agent pricing',
      'support automation monetization',
      'AI support pricing',
      'customer service agent billing',
      'support automation ROI',
    ],
    contentType: 'product',
    ogImage: 'https://askscrooge.com/og-image.svg',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date(),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pricing Blueprints', url: '/pricing-blueprints' },
      { name: 'Customer Support Agent', url: '/pricing-blueprints/customer-support-agent' },
    ],
    structuredData: {
      type: 'Product',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Customer Support Agent Pricing Blueprint',
        description: 'Monetize your customer support agent with outcome-based pricing',
        url: 'https://askscrooge.com/pricing-blueprints/customer-support-agent',
      },
    },
    llmMetadata: {
      contentType: 'article',
      topic: 'Customer support agent pricing and monetization',
      author: 'AskScrooge',
      publicationDate: new Date().toISOString(),
      facts: {
        agentType: 'Customer Support Agent',
        pricingModel: 'Outcome-based',
        category: 'AI Agent Pricing',
      },
    },
    performanceTargets: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },

  aiSdrAgent: {
    id: 'ai-sdr',
    path: '/pricing-blueprints/ai-sdr-agent',
    title: 'AI SDR Agent Pricing Blueprint — AskScrooge',
    description: 'Monetize your AI SDR agent. Discover pricing strategies, billing models, and ROI optimization for sales automation.',
    keywords: [
      'AI SDR pricing',
      'sales automation monetization',
      'AI sales agent pricing',
      'SDR agent billing',
      'sales automation ROI',
    ],
    contentType: 'product',
    ogImage: 'https://askscrooge.com/og-image.svg',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date(),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pricing Blueprints', url: '/pricing-blueprints' },
      { name: 'AI SDR Agent', url: '/pricing-blueprints/ai-sdr-agent' },
    ],
    structuredData: {
      type: 'Product',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'AI SDR Agent Pricing Blueprint',
        description: 'Monetize your AI SDR agent with outcome-based pricing',
        url: 'https://askscrooge.com/pricing-blueprints/ai-sdr-agent',
      },
    },
    llmMetadata: {
      contentType: 'article',
      topic: 'AI SDR agent pricing and monetization',
      author: 'AskScrooge',
      publicationDate: new Date().toISOString(),
      facts: {
        agentType: 'AI SDR Agent',
        pricingModel: 'Outcome-based',
        category: 'AI Agent Pricing',
      },
    },
    performanceTargets: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
    },
  },
};

/**
 * Get SEO configuration for a specific page
 */
export function getPageConfig(pageId: string): PageConfig | undefined {
  return seoConfig[pageId];
}

/**
 * Get all page configurations
 */
export function getAllPageConfigs(): PageConfig[] {
  return Object.values(seoConfig);
}

/**
 * Get page config by path
 */
export function getPageConfigByPath(path: string): PageConfig | undefined {
  return Object.values(seoConfig).find((config) => config.path === path);
}
