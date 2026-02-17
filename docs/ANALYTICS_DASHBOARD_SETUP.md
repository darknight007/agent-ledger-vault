# Analytics Dashboard Setup Guide

## Overview

This guide covers setting up monitoring dashboards in Google Analytics 4 and Google Search Console to track SEO performance and generate monthly reports for AskScrooge.

## Part 1: Google Analytics 4 Dashboards

### Dashboard 1: SEO Performance Overview

This dashboard provides a high-level view of SEO performance metrics.

#### Steps to Create:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Click "Create new report"
4. Select "Blank report"
5. Name it "SEO Performance Overview"

#### Add Metrics:

1. Click "Add metric"
2. Add the following metrics:
   - **Users**: Total number of users
   - **Sessions**: Total number of sessions
   - **Engagement rate**: Percentage of engaged sessions
   - **Average session duration**: Average time spent on site
   - **Bounce rate**: Percentage of sessions that bounced

#### Add Dimensions:

1. Click "Add dimension"
2. Add the following dimensions:
   - **Source/Medium**: Traffic source (organic, direct, referral)
   - **Landing page**: First page visited in session
   - **Device category**: Desktop, mobile, tablet

#### Configure Filters:

1. Click "Add filter"
2. Filter by:
   - **Source**: "organic" (to show only organic search traffic)
   - **Date range**: Last 30 days

#### Save Dashboard:

1. Click "Save"
2. Name: "SEO Performance Overview"
3. Click "Save"

### Dashboard 2: Organic Search Traffic

This dashboard focuses on organic search traffic performance.

#### Steps to Create:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Click "Create new report"
4. Select "Blank report"
5. Name it "Organic Search Traffic"

#### Add Metrics:

1. Click "Add metric"
2. Add the following metrics:
   - **Users**: Total organic users
   - **Sessions**: Total organic sessions
   - **Conversions**: Total conversions from organic traffic
   - **Conversion rate**: Percentage of sessions that converted
   - **Revenue**: Total revenue from organic traffic (if applicable)

#### Add Dimensions:

1. Click "Add dimension"
2. Add the following dimensions:
   - **Landing page**: First page visited
   - **Page title**: Title of landing page
   - **Device category**: Desktop, mobile, tablet
   - **Country**: User's country

#### Configure Filters:

1. Click "Add filter"
2. Filter by:
   - **Source**: "google" (to show only Google organic search)
   - **Date range**: Last 30 days

#### Save Dashboard:

1. Click "Save"
2. Name: "Organic Search Traffic"
3. Click "Save"

### Dashboard 3: Page Performance

This dashboard shows performance metrics for individual pages.

#### Steps to Create:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Click "Create new report"
4. Select "Blank report"
5. Name it "Page Performance"

#### Add Metrics:

1. Click "Add metric"
2. Add the following metrics:
   - **Views**: Number of page views
   - **Users**: Number of unique users
   - **Engagement rate**: Percentage of engaged sessions
   - **Average engagement time**: Average time spent on page
   - **Bounce rate**: Percentage of sessions that bounced

#### Add Dimensions:

1. Click "Add dimension"
2. Add the following dimensions:
   - **Page path and query string**: Full page URL
   - **Page title**: Title of page

#### Configure Sorting:

1. Click "Sort"
2. Sort by "Views" in descending order

#### Save Dashboard:

1. Click "Save"
2. Name: "Page Performance"
3. Click "Save"

### Dashboard 4: Conversion Funnel

This dashboard tracks conversion funnel performance.

#### Steps to Create:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Click "Create new report"
4. Select "Funnel report"
5. Name it "Conversion Funnel"

#### Add Funnel Steps:

1. Click "Add step"
2. Add the following steps:
   - **Step 1**: Landing page (e.g., homepage)
   - **Step 2**: Product page view
   - **Step 3**: Pricing page view
   - **Step 4**: Contact form submission
   - **Step 5**: Conversion event

#### Configure Funnel:

1. Set funnel window to "30 days"
2. Set funnel type to "Unordered" (users don't need to follow exact sequence)

#### Save Dashboard:

1. Click "Save"
2. Name: "Conversion Funnel"
3. Click "Save"

### Dashboard 5: User Engagement

This dashboard tracks user engagement metrics.

#### Steps to Create:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Click "Create new report"
4. Select "Blank report"
5. Name it "User Engagement"

#### Add Metrics:

1. Click "Add metric"
2. Add the following metrics:
   - **Active users**: Number of active users
   - **Engagement rate**: Percentage of engaged sessions
   - **Average session duration**: Average time spent per session
   - **Events per session**: Average number of events per session
   - **Scroll depth**: Percentage of page scrolled

#### Add Dimensions:

1. Click "Add dimension"
2. Add the following dimensions:
   - **Event name**: Type of event (click, scroll, etc.)
   - **Page path**: Page where event occurred

#### Save Dashboard:

1. Click "Save"
2. Name: "User Engagement"
3. Click "Save"

## Part 2: Google Search Console Dashboards

### Dashboard 1: Search Performance

This dashboard shows search performance metrics from GSC.

#### Steps to Create:

1. Go to Google Search Console
2. Click "Performance" in the left sidebar
3. Configure the following:

#### Add Filters:

1. Click "New" to add filters
2. Add the following filters:
   - **Query**: Top search queries
   - **Page**: Top landing pages
   - **Country**: Traffic by country
   - **Device**: Traffic by device type

#### Configure Date Range:

1. Select "Last 3 months" for trend analysis
2. Compare with previous period

#### Export Data:

1. Click "Export" to download data
2. Save as CSV for analysis

### Dashboard 2: Coverage Report

This dashboard shows page indexing status.

#### Steps to Create:

1. Go to Google Search Console
2. Click "Coverage" in the left sidebar
3. Monitor the following:

#### Track Metrics:

1. **Valid**: Pages successfully indexed
2. **Valid with warnings**: Pages indexed but with issues
3. **Excluded**: Pages not indexed
4. **Error**: Pages with crawl errors

#### Export Data:

1. Click "Export" to download coverage data
2. Save as CSV for analysis

### Dashboard 3: Mobile Usability

This dashboard shows mobile-specific issues.

#### Steps to Create:

1. Go to Google Search Console
2. Click "Mobile Usability" in the left sidebar
3. Monitor the following:

#### Track Issues:

1. **Clickable elements too close**: Touch targets too small
2. **Viewport not configured**: Missing viewport meta tag
3. **Text too small to read**: Font size too small
4. **Content wider than viewport**: Horizontal scrolling

#### Fix Issues:

1. Click on each issue to see affected pages
2. Fix the issue on your website
3. Request validation in GSC

## Part 3: Monthly Reporting

### Report 1: SEO Performance Report

This report summarizes monthly SEO performance.

#### Report Contents:

1. **Executive Summary**
   - Total organic users
   - Total organic sessions
   - Organic conversion rate
   - Month-over-month change

2. **Traffic Metrics**
   - Organic users by week
   - Organic sessions by week
   - Traffic sources breakdown
   - Device breakdown

3. **Top Performing Pages**
   - Top 10 pages by views
   - Top 10 pages by engagement
   - Top 10 pages by conversions

4. **Search Performance**
   - Top search queries
   - Top landing pages
   - Average CTR
   - Average position

5. **Conversion Metrics**
   - Total conversions
   - Conversion rate
   - Revenue (if applicable)
   - Conversion by source

6. **Recommendations**
   - Pages to optimize
   - Keywords to target
   - Content opportunities

#### Generate Report:

1. Go to Google Analytics 4
2. Click "Reports" in the left sidebar
3. Select "SEO Performance Overview" dashboard
4. Click "Export" to download data
5. Create report in Google Sheets or PowerPoint

### Report 2: Search Console Report

This report summarizes search performance from GSC.

#### Report Contents:

1. **Search Performance Summary**
   - Total impressions
   - Total clicks
   - Average CTR
   - Average position

2. **Top Search Queries**
   - Top 20 queries by impressions
   - Top 20 queries by clicks
   - Top 20 queries by CTR

3. **Top Landing Pages**
   - Top 10 pages by impressions
   - Top 10 pages by clicks
   - Top 10 pages by CTR

4. **Coverage Status**
   - Valid pages
   - Pages with warnings
   - Excluded pages
   - Pages with errors

5. **Mobile Usability**
   - Mobile-friendly pages
   - Pages with issues
   - Issue breakdown

6. **Indexing Status**
   - Pages indexed
   - Pages not indexed
   - Indexing trend

#### Generate Report:

1. Go to Google Search Console
2. Click "Performance" in the left sidebar
3. Select date range (last 30 days)
4. Click "Export" to download data
5. Create report in Google Sheets or PowerPoint

### Report 3: Combined Analytics Report

This report combines GA4 and GSC data for comprehensive analysis.

#### Report Contents:

1. **Overview**
   - Organic traffic trend
   - Conversion trend
   - Revenue trend (if applicable)

2. **Traffic Analysis**
   - Organic users by source
   - Organic sessions by device
   - Traffic by country

3. **Search Performance**
   - Top search queries
   - Top landing pages
   - Search visibility trend

4. **Conversion Analysis**
   - Conversion funnel
   - Top converting pages
   - Conversion rate by source

5. **Recommendations**
   - Quick wins
   - Long-term opportunities
   - Content gaps

#### Generate Report:

1. Export data from GA4
2. Export data from GSC
3. Combine in Google Sheets
4. Create visualizations
5. Add analysis and recommendations

## Part 4: Automated Reporting

### Set Up Email Reports

#### Google Analytics 4:

1. Go to Admin
2. Select "Email reports" under "Data collection and modification"
3. Click "Create email report"
4. Configure:
   - Report name
   - Recipients
   - Frequency (daily, weekly, monthly)
   - Metrics to include
5. Click "Create"

#### Google Search Console:

1. Go to Settings
2. Select "Email notifications"
3. Enable notifications for:
   - Security issues
   - Manual actions
   - Crawl errors
   - Coverage changes

### Set Up Alerts

#### Google Analytics 4:

1. Go to Admin
2. Select "Alerts" under "Data collection and modification"
3. Click "Create alert"
4. Configure:
   - Alert name
   - Metric to monitor
   - Threshold value
   - Comparison type
5. Click "Create"

#### Google Search Console:

1. Go to Settings
2. Select "Alerts"
3. Enable alerts for:
   - Security issues
   - Manual actions
   - Crawl errors

## Part 5: Dashboard Best Practices

1. **Keep it simple**: Focus on key metrics only
2. **Use consistent metrics**: Use same metrics across reports
3. **Set benchmarks**: Establish baseline metrics
4. **Track trends**: Monitor metrics over time
5. **Compare periods**: Compare current vs. previous period
6. **Segment data**: Break down by source, device, etc.
7. **Update regularly**: Review dashboards weekly
8. **Share insights**: Share reports with stakeholders
9. **Take action**: Use insights to optimize content
10. **Document changes**: Track changes and their impact

## Part 6: Key Metrics to Monitor

### Traffic Metrics

- **Organic users**: Number of unique users from organic search
- **Organic sessions**: Number of sessions from organic search
- **Bounce rate**: Percentage of sessions that bounced
- **Average session duration**: Average time spent per session

### Conversion Metrics

- **Conversion rate**: Percentage of sessions that converted
- **Total conversions**: Number of conversions
- **Revenue**: Total revenue from conversions
- **Cost per conversion**: Cost to acquire one conversion

### Search Metrics

- **Impressions**: Number of times site appears in search results
- **Clicks**: Number of clicks from search results
- **CTR**: Click-through rate from search results
- **Average position**: Average ranking position

### Engagement Metrics

- **Engagement rate**: Percentage of engaged sessions
- **Events per session**: Average number of events per session
- **Pages per session**: Average number of pages per session
- **Scroll depth**: Percentage of page scrolled

## Additional Resources

- [GA4 Reporting Guide](https://support.google.com/analytics/answer/9212670)
- [GSC Performance Report](https://support.google.com/webmasters/answer/7042828)
- [Google Sheets Integration](https://support.google.com/analytics/answer/1033068)
- [Data Studio Dashboards](https://support.google.com/datastudio)

## Next Steps

1. Create all dashboards
2. Set up automated email reports
3. Configure alerts
4. Generate first monthly report
5. Share with stakeholders
6. Optimize based on insights
