import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SEOImage } from './SEOImage';

describe('SEOImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Alt Text Validation', () => {
    it('should render with required alt text', () => {
      render(<SEOImage src="image.jpg" alt="A descriptive alt text" />);
      const img = screen.getByAltText('A descriptive alt text');
      expect(img).toBeTruthy();
    });

    it('should render decorative images with empty alt', () => {
      render(<SEOImage src="image.jpg" alt="ignored" decorative={true} />);
      const img = document.querySelector('img');
      expect(img?.getAttribute('alt')).toBe('');
    });

    it('should set title attribute for non-decorative images', () => {
      render(<SEOImage src="image.jpg" alt="Test image" />);
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('title')).toBe('Test image');
    });

    it('should not set title for decorative images', () => {
      render(<SEOImage src="image.jpg" alt="ignored" decorative={true} />);
      const img = document.querySelector('img');
      expect(img?.getAttribute('title')).toBeNull();
    });
  });

  describe('Lazy Loading', () => {
    it('should enable lazy loading by default', () => {
      render(<SEOImage src="image.jpg" alt="Test image" />);
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('loading')).toBe('lazy');
    });

    it('should disable lazy loading when lazy=false', () => {
      render(<SEOImage src="image.jpg" alt="Test image" lazy={false} />);
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('loading')).toBe('eager');
    });

    it('should use data-src for lazy loading', () => {
      render(<SEOImage src="image.jpg" alt="Test image" lazy={true} />);
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('data-src')).toBe('image.jpg');
    });

    it('should not use data-src when lazy=false', () => {
      render(<SEOImage src="image.jpg" alt="Test image" lazy={false} />);
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('data-src')).toBeNull();
      expect(img.getAttribute('src')).toBe('image.jpg');
    });

    it('should use placeholder image when provided', () => {
      render(
        <SEOImage
          src="image.jpg"
          alt="Test image"
          lazy={true}
          placeholderSrc="placeholder.jpg"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('src')).toBe('placeholder.jpg');
      expect(img.getAttribute('data-src')).toBe('image.jpg');
    });
  });

  describe('Image Attributes', () => {
    it('should pass through standard img attributes', () => {
      render(
        <SEOImage
          src="image.jpg"
          alt="Test image"
          width={100}
          height={100}
          className="test-class"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('width')).toBe('100');
      expect(img.getAttribute('height')).toBe('100');
      expect(img.getAttribute('class')).toBe('test-class');
    });

    it('should support srcset attribute', () => {
      render(
        <SEOImage
          src="image.jpg"
          alt="Test image"
          srcSet="image-small.jpg 480w, image-large.jpg 1024w"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('srcset')).toBe('image-small.jpg 480w, image-large.jpg 1024w');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper alt text', () => {
      render(<SEOImage src="image.jpg" alt="Descriptive alt text for accessibility" />);
      const img = screen.getByAltText('Descriptive alt text for accessibility');
      expect(img.getAttribute('alt')).toBe('Descriptive alt text for accessibility');
    });

    it('should support aria attributes', () => {
      render(
        <SEOImage
          src="image.jpg"
          alt="Test image"
          aria-label="Additional label"
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img.getAttribute('aria-label')).toBe('Additional label');
    });
  });
});
