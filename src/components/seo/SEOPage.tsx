/**
 * SEOPage Component
 * Wrapper component that combines all SEO systems for a page
 * Accepts page metadata as props and injects all necessary SEO elements
 */

import React, { ReactNode } from 'react';
import { PageConfig } from '@/lib/seo/types';
import { MetaTags } from './MetaTags';
import { StructuredData } from './StructuredData';
import { CanonicalUrl } from './CanonicalUrl';
import { SocialMetadata } from './SocialMetadata';
import { LLMMetadata } from './LLMMetadata';
import { Breadcrumb } from './Breadcrumb';
import { OpenGraphMetadata, TwitterCardMetadata } from '@/lib/seo/social-metadata';

interface SEOPageProps {
  config: PageConfig;
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export const SEOPage: React.FC<SEOPageProps> = ({ config, children, showBreadcrumbs = true }) => {
  // Determine canonical URL (use config path as base)
  const canonicalUrl = `https://askscrooge.com${config.path}`;

  // Prepare Open Graph metadata
  const openGraphMetadata: OpenGraphMetadata = {
    title: config.title,
    description: config.description,
    url: canonicalUrl,
    type: config.contentType === 'product' ? 'product' : config.contentType === 'article' ? 'article' : 'website',
    image: config.ogImage,
    siteName: 'AskScrooge',
    locale: 'en_US',
  };

  // Prepare Twitter Card metadata
  const twitterCardMetadata: TwitterCardMetadata = {
    card: 'summary_large_image',
    title: config.title,
    description: config.description,
    image: config.ogImage,
    site: '@askscrooge',
    creator: '@askscrooge',
  };

  return (
    <>
      {/* Meta Tags System */}
      <MetaTags
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        canonical={canonicalUrl}
        ogTitle={config.title}
        ogDescription={config.description}
        ogImage={config.ogImage}
        ogType={openGraphMetadata.type}
        twitterCard={twitterCardMetadata.card}
        twitterTitle={twitterCardMetadata.title}
        twitterDescription={twitterCardMetadata.description}
        twitterImage={twitterCardMetadata.image}
        twitterSite={twitterCardMetadata.site}
        twitterCreator={twitterCardMetadata.creator}
      />

      {/* Structured Data System */}
      <StructuredData
        type={config.structuredData.type}
        data={config.structuredData.data}
        validate={true}
      />

      {/* Canonical URL System */}
      <CanonicalUrl url={canonicalUrl} />

      {/* Social Metadata System */}
      <SocialMetadata
        openGraph={openGraphMetadata}
        twitterCard={twitterCardMetadata}
      />

      {/* LLM Metadata System */}
      <LLMMetadata config={config.llmMetadata} />

      {/* Breadcrumb Navigation */}
      {showBreadcrumbs && config.breadcrumbs.length > 0 && (
        <Breadcrumb items={config.breadcrumbs} includeSchema={true} />
      )}

      {/* Page Content */}
      {children}
    </>
  );
};

export default SEOPage;
