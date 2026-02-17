import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateImageAltText,
  validateImageAlt,
  isDecorativeImage,
  isGenericAltText,
  hasKeywordStuffing,
  getAltTextStatistics,
  generateAltTextSuggestion,
  validateAltTextLength,
  getImagesMissingAlt,
  getImagesWithGenericAlt,
} from './image-alt-text';

describe('Image Alt Text Validator', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('validateImageAltText', () => {
    it('should validate images with proper alt text', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="A descriptive alt text for image one" />
        <img src="image2.jpg" alt="Another descriptive alt text" />
      `;

      const result = validateImageAltText();
      expect(result.isValid).toBe(true);
      expect(result.totalImages).toBe(2);
      expect(result.imagesWithAlt).toBe(2);
      expect(result.imagesWithoutAlt).toBe(0);
    });

    it('should detect images missing alt text', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" />
        <img src="image2.jpg" alt="Proper alt text" />
      `;

      const result = validateImageAltText();
      expect(result.isValid).toBe(false);
      expect(result.imagesWithoutAlt).toBe(1);
      expect(result.errors.some((e) => e.includes('missing alt text'))).toBe(true);
    });

    it('should detect alt text too short', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="Short" />
      `;

      const result = validateImageAltText();
      expect(result.warnings.some((w) => w.includes('too short'))).toBe(true);
    });

    it('should detect alt text too long', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="${'A'.repeat(150)}" />
      `;

      const result = validateImageAltText();
      expect(result.errors.some((e) => e.includes('too long'))).toBe(true);
    });

    it('should detect generic alt text', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="image" />
      `;

      const result = validateImageAltText();
      expect(result.warnings.some((w) => w.includes('generic'))).toBe(true);
    });

    it('should handle decorative images', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="" />
        <img src="image2.jpg" alt="Proper alt text" />
      `;

      const result = validateImageAltText();
      expect(result.isValid).toBe(true);
      expect(result.imagesWithoutAlt).toBe(0);
    });
  });

  describe('validateImageAlt', () => {
    it('should validate image with proper alt text', () => {
      const img = document.createElement('img');
      img.src = 'image.jpg';
      img.alt = 'A descriptive alt text';
      document.body.appendChild(img);

      const result = validateImageAlt(img);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing alt text', () => {
      const img = document.createElement('img');
      img.src = 'image.jpg';
      document.body.appendChild(img);

      const result = validateImageAlt(img);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('missing'))).toBe(true);
    });

    it('should detect non-image element', () => {
      const div = document.createElement('div');
      const result = validateImageAlt(div as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('not an image'))).toBe(true);
    });

    it('should accept decorative images', () => {
      const img = document.createElement('img');
      img.src = 'image.jpg';
      img.alt = '';
      document.body.appendChild(img);

      const result = validateImageAlt(img);
      expect(result.isValid).toBe(true);
    });
  });

  describe('isDecorativeImage', () => {
    it('should detect decorative image with empty alt', () => {
      const img = document.createElement('img');
      img.alt = '';
      expect(isDecorativeImage(img)).toBe(true);
    });

    it('should detect decorative image with aria-hidden', () => {
      const img = document.createElement('img');
      img.alt = 'Some text';
      img.setAttribute('aria-hidden', 'true');
      expect(isDecorativeImage(img)).toBe(true);
    });

    it('should detect decorative image with role=presentation', () => {
      const img = document.createElement('img');
      img.alt = 'Some text';
      img.setAttribute('role', 'presentation');
      expect(isDecorativeImage(img)).toBe(true);
    });

    it('should not detect content image as decorative', () => {
      const img = document.createElement('img');
      img.alt = 'Content image';
      expect(isDecorativeImage(img)).toBe(false);
    });
  });

  describe('isGenericAltText', () => {
    it('should detect generic alt text', () => {
      expect(isGenericAltText('image')).toBe(true);
      expect(isGenericAltText('photo')).toBe(true);
      expect(isGenericAltText('picture')).toBe(true);
      expect(isGenericAltText('img')).toBe(true);
      expect(isGenericAltText('image1')).toBe(true);
    });

    it('should not detect descriptive alt text as generic', () => {
      expect(isGenericAltText('A descriptive alt text')).toBe(false);
      expect(isGenericAltText('Screenshot of dashboard')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isGenericAltText('IMAGE')).toBe(true);
      expect(isGenericAltText('Photo')).toBe(true);
    });
  });

  describe('hasKeywordStuffing', () => {
    it('should detect keyword stuffing', () => {
      expect(hasKeywordStuffing('keyword keyword keyword keyword')).toBe(true);
    });

    it('should not detect normal text as keyword stuffing', () => {
      expect(hasKeywordStuffing('A descriptive alt text for the image')).toBe(false);
    });
  });

  describe('getAltTextStatistics', () => {
    it('should calculate alt text statistics', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="Descriptive alt text" />
        <img src="image2.jpg" alt="Another alt text" />
        <img src="image3.jpg" alt="" />
      `;

      const stats = getAltTextStatistics();
      expect(stats.totalImages).toBe(3);
      expect(stats.imagesWithAlt).toBe(2);
      expect(stats.decorativeImages).toBe(1);
      expect(stats.coverage).toBe(100);
    });

    it('should handle no images', () => {
      document.body.innerHTML = '';
      const stats = getAltTextStatistics();
      expect(stats.totalImages).toBe(0);
      expect(stats.coverage).toBe(0);
    });
  });

  describe('generateAltTextSuggestion', () => {
    it('should generate suggestion from filename', () => {
      const suggestion = generateAltTextSuggestion('path/to/my-image.jpg');
      expect(suggestion).toBe('My Image');
    });

    it('should handle snake_case', () => {
      const suggestion = generateAltTextSuggestion('path/to/my_image.jpg');
      expect(suggestion).toBe('My Image');
    });

    it('should handle single word', () => {
      const suggestion = generateAltTextSuggestion('path/to/image.jpg');
      expect(suggestion).toBe('Image');
    });
  });

  describe('validateAltTextLength', () => {
    it('should validate correct length', () => {
      const result = validateAltTextLength('A descriptive alt text');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect too short', () => {
      const result = validateAltTextLength('Short');
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too short'))).toBe(true);
    });

    it('should detect too long', () => {
      const result = validateAltTextLength('A'.repeat(150));
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too long'))).toBe(true);
    });
  });

  describe('getImagesMissingAlt', () => {
    it('should get images missing alt text', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" />
        <img src="image2.jpg" alt="Alt text" />
        <img src="image3.jpg" />
      `;

      const images = getImagesMissingAlt();
      expect(images).toHaveLength(2);
    });

    it('should not include decorative images', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="" />
        <img src="image2.jpg" />
      `;

      const images = getImagesMissingAlt();
      expect(images).toHaveLength(1);
    });
  });

  describe('getImagesWithGenericAlt', () => {
    it('should get images with generic alt text', () => {
      document.body.innerHTML = `
        <img src="image1.jpg" alt="image" />
        <img src="image2.jpg" alt="Descriptive text" />
        <img src="image3.jpg" alt="photo" />
      `;

      const images = getImagesWithGenericAlt();
      expect(images).toHaveLength(2);
    });
  });
});
