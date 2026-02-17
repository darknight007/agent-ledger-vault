/**
 * useHeadingValidator Hook
 * Validates heading hierarchy on component mount and updates
 */

import { useEffect } from 'react';
import { validateHeadingHierarchy, HeadingValidationResult } from '@/lib/seo/heading-validator';

/**
 * Hook to validate heading hierarchy
 */
export function useHeadingValidator(logWarnings: boolean = true): HeadingValidationResult | null {
  useEffect(() => {
    const result = validateHeadingHierarchy();

    if (logWarnings) {
      if (!result.isValid) {
        console.warn('Heading hierarchy validation failed:', result.errors);
      }

      if (result.warnings.length > 0) {
        console.warn('Heading hierarchy warnings:', result.warnings);
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, [logWarnings]);

  return null;
}

export default useHeadingValidator;
