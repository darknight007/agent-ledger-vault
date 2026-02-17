/**
 * SEOImage Component
 * Image component with enforced alt text requirements and lazy loading support
 */

import { ImgHTMLAttributes, useEffect, useRef } from 'react';
import { validateImageAlt } from '@/lib/seo/image-alt-text';

interface SEOImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string; // Make alt required
  decorative?: boolean;
  lazy?: boolean; // Enable lazy loading
  placeholderSrc?: string; // Low-quality placeholder image
}

export const SEOImage: React.FC<SEOImageProps> = ({
  alt,
  decorative = false,
  lazy = true,
  placeholderSrc,
  src,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  // Validate alt text if not decorative
  if (!decorative && alt) {
    const img = document.createElement('img');
    img.alt = alt;
    const validation = validateImageAlt(img);

    if (!validation.isValid) {
      console.warn(`SEOImage validation failed for ${src}:`, validation.errors);
    }
  }

  // For decorative images, use empty alt
  const finalAlt = decorative ? '' : alt;

  // Set up lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || !imgRef.current || !('IntersectionObserver' in window)) {
      return;
    }

    const img = imgRef.current;
    const dataSrc = img.getAttribute('data-src');

    if (!dataSrc) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImg = entry.target as HTMLImageElement;
            const src = lazyImg.getAttribute('data-src');
            const srcset = lazyImg.getAttribute('data-srcset');

            if (src) {
              lazyImg.src = src;
            }
            if (srcset) {
              lazyImg.srcset = srcset;
            }

            lazyImg.removeAttribute('data-src');
            lazyImg.removeAttribute('data-srcset');
            observer.unobserve(lazyImg);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  // If lazy loading is enabled, use data-src instead of src
  const imageSrc = lazy ? undefined : src;
  const dataSrc = lazy ? src : undefined;

  return (
    <img
      ref={imgRef}
      {...props}
      src={imageSrc || placeholderSrc}
      data-src={dataSrc}
      alt={finalAlt}
      title={!decorative ? alt : undefined}
      loading={lazy ? 'lazy' : 'eager'}
    />
  );
};

export default SEOImage;
