# Google Analytics 4 Setup Guide

## Overview

Google Analytics 4 (GA4) is the latest version of Google Analytics that provides advanced tracking and reporting capabilities. This guide walks through setting up GA4 for AskScrooge.

## Prerequisites

- A Google account
- Google Search Console already set up (recommended)
- Access to your website's code
- Admin access to your Google Analytics account

## Step 1: Create a Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring"
3. Enter your account name (e.g., "AskScrooge")
4. Configure data sharing settings as needed
5. Click "Next"

## Step 2: Create a GA4 Property

1. Enter your property name (e.g., "AskScrooge Website")
2. Select your reporting timezone (e.g., "America/New_York")
3. Select your currency (e.g., "USD")
4. Click "Next"

## Step 3: Set Up Your Business Information

1. Select your industry category (e.g., "Technology")
2. Select your business size (e.g., "Small")
3. Select your business objectives:
   - Get more website traffic
   - Generate leads
   - Increase sales
   - Send a newsletter
   - Engage users
4. Click "Create"

## Step 4: Add Your Website Data Stream

1. Select "Web" as your platform
2. Enter your website URL: `https://askscrooge.com`
3. Enter your stream name: "AskScrooge Website"
4. Click "Create stream"

## Step 5: Get Your Measurement ID

1. After creating the stream, you'll see your Measurement ID (format: G-XXXXXXXXXX)
2. Copy this ID - you'll need it for your website

## Step 6: Install the GA4 Tracking Script

### Option A: Using React Component (Recommended)

Create a GA4 provider component:

```typescript
// src/components/GA4Provider.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/seo/google-analytics';

export function GA4Provider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname, document.title);
  }, [location]);

  return <>{children}</>;
}
```

### Option B: Direct Script Installation

Add the GA4 tracking script to your `index.html`:

```html
<head>
  <!-- Other meta tags -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 7: Configure Environment Variables

Add your Measurement ID to your `.env` file:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 8: Set Up Event Tracking

### Track Page Views

```typescript
import { trackPageView } from '@/lib/seo/google-analytics';

// Track page view
trackPageView('/pricing', 'Pricing Page');
```

### Track User Interactions

```typescript
import { trackUserInteraction } from '@/lib/seo/google-analytics';

// Track button click
trackUserInteraction('click', 'pricing_button', 'annual_plan');

// Track form submission
trackUserInteraction('submit', 'contact_form', 'inquiry');
```

### Track Conversions

```typescript
import { trackConversion } from '@/lib/seo/google-analytics';

// Track conversion
trackConversion('signup', 100);
trackConversion('purchase', 500);
```

### Track Custom Events

```typescript
import { trackEvent } from '@/lib/seo/google-analytics';

trackEvent({
  eventName: 'calculator_used',
  eventCategory: 'engagement',
  eventLabel: 'llm_cost_calculator',
  eventValue: 1,
  customParams: {
    calculator_type: 'llm_cost',
    result_value: 1500,
  },
});
```

## Step 9: Configure Conversions

1. Go to Admin (gear icon)
2. Select "Conversions" under "Data collection and modification"
3. Click "New conversion event"
4. Enter conversion name (e.g., "signup", "purchase")
5. Select "Create event"
6. Configure conversion parameters as needed

## Step 10: Set Up Goals

1. Go to Admin
2. Select "Goals" under "Data collection and modification"
3. Click "New goal"
4. Select goal type:
   - Destination (page view)
   - Duration (session length)
   - Pages/screens per session
   - Event
5. Configure goal parameters
6. Click "Create"

## Step 11: Link to Google Search Console

1. Go to Admin
2. Select "Search Console links" under "Product links"
3. Click "Link"
4. Select your Search Console property
5. Click "Link"

This enables cross-platform reporting between GA4 and GSC.

## Step 12: Configure Data Retention

1. Go to Admin
2. Select "Data retention" under "Data collection and modification"
3. Choose retention period:
   - 2 months (default)
   - 14 months
4. Click "Save"

## Step 13: Set Up Custom Dimensions

Custom dimensions allow you to track additional data:

1. Go to Admin
2. Select "Custom definitions" under "Data collection and modification"
3. Click "Create custom dimension"
4. Enter dimension name (e.g., "user_plan")
5. Select scope (User, Session, or Event)
6. Enter parameter name (e.g., "user_plan")
7. Click "Save"

## Step 14: Configure Audiences

Audiences help you segment users:

1. Go to Admin
2. Select "Audiences" under "Data collection and modification"
3. Click "New audience"
4. Select audience type:
   - Engagement-based
   - Behavior-based
   - Demographic-based
5. Configure audience conditions
6. Click "Create"

## Step 15: Monitor Real-Time Data

1. Go to "Real-time" in the left sidebar
2. Monitor:
   - Active users
   - Recent events
   - Traffic sources
   - Page views

## Step 16: View Reports

### Acquisition Reports

1. Go to "Acquisition" in the left sidebar
2. Monitor:
   - Traffic sources (organic, direct, referral, etc.)
   - Campaign performance
   - User acquisition

### Engagement Reports

1. Go to "Engagement" in the left sidebar
2. Monitor:
   - Page views
   - Events
   - User engagement
   - Session duration

### Monetization Reports

1. Go to "Monetization" in the left sidebar
2. Monitor:
   - Revenue
   - Conversion rate
   - Average order value

### Retention Reports

1. Go to "Retention" in the left sidebar
2. Monitor:
   - User retention
   - Cohort analysis
   - Churn rate

## Step 17: Create Custom Reports

1. Go to "Reports" in the left sidebar
2. Click "Create new report"
3. Select report type:
   - Blank report
   - Comparison report
   - Funnel report
4. Configure dimensions and metrics
5. Click "Save"

## Step 18: Set Up Alerts

1. Go to Admin
2. Select "Alerts" under "Data collection and modification"
3. Click "Create alert"
4. Configure alert conditions:
   - Metric threshold
   - Comparison type
   - Threshold value
5. Select notification method (email)
6. Click "Create"

## Implementation in Code

The GA4 tracking is implemented through the `google-analytics.ts` module:

```typescript
import {
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackConversion,
} from '@/lib/seo/google-analytics';

// Track page view
trackPageView('/pricing', 'Pricing Page');

// Track user interaction
trackUserInteraction('click', 'pricing_button');

// Track conversion
trackConversion('signup', 100);

// Track custom event
trackEvent({
  eventName: 'calculator_used',
  eventCategory: 'engagement',
  eventLabel: 'llm_cost_calculator',
});
```

## Best Practices

1. **Track meaningful events**: Focus on events that matter to your business
2. **Use consistent naming**: Establish naming conventions for events
3. **Set up conversions**: Define and track key conversions
4. **Monitor regularly**: Check GA4 at least weekly
5. **Use segments**: Create segments to analyze specific user groups
6. **Create dashboards**: Build custom dashboards for key metrics
7. **Set up alerts**: Get notified of significant changes
8. **Review reports**: Generate monthly reports for stakeholders

## Troubleshooting

### No Data in GA4

- Wait 24-48 hours for data to appear
- Check that the tracking script is installed correctly
- Verify your Measurement ID is correct
- Check browser console for JavaScript errors
- Ensure cookies are not blocked

### Events Not Tracking

- Verify event names are correct
- Check that event tracking code is executed
- Ensure GA4 script is loaded before event tracking
- Check browser console for errors

### Low Traffic

- Verify your site is getting traffic
- Check that tracking script is not blocked
- Ensure your site is not in a private/incognito window
- Check that GA4 is not filtering traffic

## Additional Resources

- [GA4 Help Center](https://support.google.com/analytics)
- [GA4 Implementation Guide](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [GA4 Best Practices](https://support.google.com/analytics/answer/11091082)

## Next Steps

After setting up GA4:

1. Set up custom events for your business
2. Create custom reports and dashboards
3. Monitor performance metrics
4. Generate monthly reports
5. Optimize based on data insights
