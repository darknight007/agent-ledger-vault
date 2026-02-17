# Google Search Console Setup Guide

## Overview

Google Search Console (GSC) is a free service that helps you monitor and maintain your site's presence in Google Search results. This guide walks through setting up GSC for AskScrooge.

## Prerequisites

- A Google account
- Access to the website's domain or hosting
- Ability to add meta tags to the website's HTML

## Step 1: Create a Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Start now"
3. Sign in with your Google account
4. Accept the terms of service

## Step 2: Add Your Property

1. In the left sidebar, click "Add property"
2. Choose "URL prefix" option
3. Enter your website URL: `https://askscrooge.com`
4. Click "Continue"

## Step 3: Verify Your Site

Google Search Console offers multiple verification methods. We recommend using the **meta tag method**:

### Meta Tag Verification (Recommended)

1. In the verification page, select "Meta tag" as the verification method
2. Copy the verification code from the provided meta tag
3. The meta tag will look like:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
   ```

4. Add this meta tag to your website's `index.html` file in the `<head>` section:
   ```html
   <head>
     <!-- Other meta tags -->
     <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
   </head>
   ```

5. Save and deploy your changes
6. Return to Google Search Console and click "Verify"
7. Wait for Google to confirm verification (usually within 24-48 hours)

### Alternative: HTML File Upload

If you cannot add meta tags:

1. Download the HTML verification file from GSC
2. Upload it to your website's root directory
3. Verify in GSC

### Alternative: Domain Name Provider

If you have access to your domain provider:

1. Add a DNS TXT record provided by GSC
2. Verify in GSC

## Step 4: Configure Your Site Settings

Once verified, configure the following in GSC:

### 4.1 Preferred Domain

1. Go to Settings (gear icon)
2. Select "Preferred domain"
3. Choose between `www.askscrooge.com` and `askscrooge.com`
4. This ensures Google crawls only one version

### 4.2 Crawl Rate

1. Go to Settings
2. Select "Crawl rate"
3. Leave as "Let Google optimize" (recommended)

### 4.3 Security Issues

1. Go to Security & Manual Actions
2. Monitor for any security issues
3. Address any issues immediately

## Step 5: Submit Your Sitemap

1. Go to "Sitemaps" in the left sidebar
2. Enter your sitemap URL: `https://askscrooge.com/sitemap.xml`
3. Click "Submit"
4. GSC will crawl and index your sitemap

## Step 6: Monitor Performance

### Performance Reports

1. Go to "Performance" in the left sidebar
2. Monitor:
   - **Total Clicks**: Number of clicks from search results
   - **Impressions**: Number of times your site appears in search results
   - **Average CTR**: Click-through rate
   - **Average Position**: Average ranking position

### Coverage Reports

1. Go to "Coverage" in the left sidebar
2. Monitor:
   - **Valid**: Pages successfully indexed
   - **Valid with warnings**: Pages indexed but with issues
   - **Excluded**: Pages not indexed
   - **Error**: Pages with crawl errors

### Mobile Usability

1. Go to "Mobile Usability" in the left sidebar
2. Monitor for mobile-specific issues
3. Fix any issues to improve mobile rankings

## Step 7: Submit URLs for Indexing

To speed up indexing of new pages:

1. Go to "URL Inspection" in the left sidebar
2. Enter the URL of your new page
3. Click "Request indexing"
4. Google will crawl and index the page

## Step 8: Monitor Search Queries

1. Go to "Performance" in the left sidebar
2. View top search queries that bring traffic to your site
3. Identify opportunities for content optimization
4. Monitor keyword rankings over time

## Step 9: Set Up Alerts

1. Go to Settings
2. Enable email notifications for:
   - Security issues
   - Manual actions
   - Crawl errors
   - Coverage changes

## Step 10: Link to Google Analytics

1. Go to Settings
2. Click "Link Google Analytics"
3. Select your Google Analytics 4 property
4. This enables cross-platform reporting

## Implementation in Code

The verification meta tag is automatically added to your site through the `google-search-console.ts` module:

```typescript
import { generateGSCVerificationTag } from '@/lib/seo/google-search-console';

// In your index.html or React component
const verificationCode = process.env.VITE_GSC_VERIFICATION_CODE;
const metaTag = generateGSCVerificationTag(verificationCode);
```

## Environment Variables

Add the following to your `.env` file:

```env
VITE_GSC_VERIFICATION_CODE=your_verification_code_here
```

## Troubleshooting

### Verification Failed

- Ensure the meta tag is in the `<head>` section
- Check that the verification code is correct
- Wait 24-48 hours for Google to crawl
- Try alternative verification methods

### No Data in Performance Reports

- Wait 2-4 weeks for data to accumulate
- Ensure your site is indexed (check Coverage report)
- Check that your site is not blocked by robots.txt
- Verify that your site is not blocked by meta robots tag

### Crawl Errors

- Check your server logs for errors
- Ensure your site is accessible
- Fix any broken links
- Check your robots.txt configuration

## Best Practices

1. **Monitor regularly**: Check GSC at least weekly
2. **Fix issues promptly**: Address crawl errors and coverage issues
3. **Submit sitemaps**: Keep your sitemap updated
4. **Request indexing**: Submit new pages for faster indexing
5. **Optimize for search**: Use GSC data to improve content
6. **Monitor mobile**: Ensure mobile usability is optimal
7. **Track performance**: Monitor clicks, impressions, and CTR

## Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Search Console Training](https://support.google.com/webmasters/answer/9128668)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)

## Next Steps

After setting up GSC:

1. Set up Google Analytics 4 (see `GOOGLE_ANALYTICS_4_SETUP.md`)
2. Monitor performance metrics
3. Optimize content based on search data
4. Track keyword rankings
5. Generate monthly reports
